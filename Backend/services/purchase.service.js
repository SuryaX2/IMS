import mongoose from "mongoose";
import { Purchase } from "../models/purchase.model.js";
import { PurchaseDetail } from "../models/purchase-detail.model.js";
import { Product } from "../models/product.model.js";
import { Supplier } from "../models/supplier.model.js";
import { ApiError } from "../utils/ApiError.js";

class PurchaseService {
    async createPurchase(purchaseData, userId) {
        const { supplier_id, purchase_no, purchase_status, details } =
            purchaseData;

        if (
            !supplier_id ||
            !purchase_no ||
            !Array.isArray(details) ||
            details.length === 0
        ) {
            throw new ApiError(400, "Invalid purchase data");
        }

        const supplier = await Supplier.findById(supplier_id).lean();
        if (!supplier) {
            throw new ApiError(404, "Supplier not found");
        }

        const productIds = details.map((d) => d.product_id?.toString());
        const uniqueProductIds = [...new Set(productIds)];
        if (uniqueProductIds.length !== productIds.length) {
            throw new ApiError(400, "Duplicate products in purchase details");
        }

        const products = await Product.find({
            _id: { $in: uniqueProductIds },
        })
            .select("_id")
            .lean();

        if (products.length !== uniqueProductIds.length) {
            throw new ApiError(400, "One or more products not found");
        }

        for (const d of details) {
            if (!d.quantity || d.quantity < 1) {
                throw new ApiError(
                    400,
                    "Quantity must be at least 1 for all items"
                );
            }
            if (d.unitcost === undefined || d.unitcost < 0) {
                throw new ApiError(
                    400,
                    "Unit cost must be non-negative for all items"
                );
            }
        }

        const existing = await Purchase.findOne({ purchase_no }).lean();
        if (existing) {
            throw new ApiError(409, "Purchase number already exists");
        }

        const initialStatus = purchase_status || "pending";
        if (!["pending", "completed"].includes(initialStatus)) {
            throw new ApiError(
                400,
                `Invalid purchase status: ${initialStatus}`
            );
        }

        const shouldAddStock = initialStatus === "completed";

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const [purchase] = await Purchase.create(
                [
                    {
                        supplier_id,
                        purchase_no,
                        purchase_status: initialStatus,
                        created_by: userId,
                    },
                ],
                { session }
            );

            await PurchaseDetail.bulkCreateDetails(
                details.map((d) => ({
                    purchase_id: purchase._id,
                    product_id: d.product_id,
                    quantity: d.quantity,
                    unitcost: d.unitcost,
                })),
                session
            );

            if (shouldAddStock) {
                for (const detail of details) {
                    await Product.restoreStock(
                        detail.product_id,
                        detail.quantity,
                        session
                    );
                }
            }

            await session.commitTransaction();
            return purchase;
        } catch (err) {
            await session.abortTransaction();
            throw err;
        } finally {
            session.endSession();
        }
    }

    async updatePurchaseStatus(purchaseId, newStatus, userId, userRole) {
        const purchase = await Purchase.findById(purchaseId);

        if (!purchase) {
            throw new ApiError(404, "Purchase not found");
        }

        if (userRole !== "admin" && !purchase.created_by.equals(userId)) {
            throw new ApiError(
                403,
                "You don't have permission to update this purchase"
            );
        }

        const validTransitions = {
            pending: ["completed"],
            completed: ["returned"],
            returned: [],
        };

        if (!validTransitions[purchase.purchase_status]?.includes(newStatus)) {
            throw new ApiError(
                400,
                `Cannot transition purchase from "${purchase.purchase_status}" to "${newStatus}"`
            );
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        let returnInfo = null;

        try {
            if (newStatus === "returned") {
                returnInfo = await PurchaseDetail.processAllReturns(
                    purchaseId,
                    session
                );
            } else if (newStatus === "completed") {
                const purchaseDetails = await PurchaseDetail.find({
                    purchase_id: purchaseId,
                }).lean();

                for (const detail of purchaseDetails) {
                    await Product.restoreStock(
                        detail.product_id,
                        detail.quantity,
                        session
                    );
                }
            }

            const updated = await Purchase.findByIdAndUpdate(
                purchaseId,
                { purchase_status: newStatus, updated_by: userId },
                { new: true, session }
            );

            await session.commitTransaction();
            return { purchase: updated, ...(returnInfo && { returnInfo }) };
        } catch (err) {
            await session.abortTransaction();
            throw err;
        } finally {
            session.endSession();
        }
    }
}

export default new PurchaseService();
