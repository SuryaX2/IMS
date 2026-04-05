import mongoose from "mongoose";
import { Purchase } from "../models/purchase.model.js";
import { PurchaseDetail } from "../models/purchase-detail.model.js";
import { Product } from "../models/product.model.js";
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

        const existing = await Purchase.findOne({ purchase_no }).lean();
        if (existing) {
            throw new ApiError(409, "Purchase number already exists");
        }

        const initialStatus = purchase_status || "pending";
        const shouldAddStock =
            initialStatus === "completed" || initialStatus === "approved";

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
            pending: ["completed", "approved"],
            completed: ["returned"],
            approved: ["returned"],
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
            } else if (newStatus === "completed" || newStatus === "approved") {
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
