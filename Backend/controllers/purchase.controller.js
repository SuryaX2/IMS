import { Purchase } from "../models/purchase.model.js";
import { PurchaseDetail } from "../models/purchase-detail.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createPurchase = asyncHandler(async (req, res, next) => {
    const { supplier_id, purchase_no, purchase_status, details } = req.body;

    if (!supplier_id || !purchase_no || !details || !Array.isArray(details)) {
        return next(new ApiError(400, "Invalid purchase data"));
    }

    try {
        // Check if purchase number is unique
        const existingPurchase = await Purchase.findOne({ purchase_no });
        if (existingPurchase) {
            return next(new ApiError(409, "Purchase number already exists"));
        }

        // Create purchase
        const purchase = await Purchase.create({
            supplier_id,
            purchase_no,
            purchase_status: purchase_status || "pending",
            created_by: req.user._id,
        });

        // Create purchase details individually using createDetail method
        // This will properly update stock for each product if status is completed
        const purchaseDetails = [];
        for (const detail of details) {
            const detailData = {
                purchase_id: purchase._id,
                product_id: detail.product_id,
                quantity: detail.quantity,
                unitcost: detail.unitcost,
                total: detail.quantity * detail.unitcost,
            };

            // Only update stock if purchase is marked as completed right away
            if (
                purchase.purchase_status === "completed" ||
                purchase.purchase_status === "approved"
            ) {
                const createdDetail =
                    await PurchaseDetail.createDetail(detailData);
                purchaseDetails.push(createdDetail);
            } else {
                // For pending purchases, don't update stock yet - just create the record
                const createdDetail = await PurchaseDetail.create(detailData);
                purchaseDetails.push(createdDetail);
            }
        }

        return res
            .status(201)
            .json(
                new ApiResponse(
                    201,
                    { purchase, purchaseDetails },
                    "Purchase created successfully"
                )
            );
    } catch (error) {
        return next(new ApiError(500, error.message));
    }
});

const getAllPurchases = asyncHandler(async (req, res, next) => {
    try {
        let purchases;

        // If user is admin, get all purchases
        if (req.user.role === "admin") {
            purchases = await Purchase.getAllPurchases();
        } else {
            // Otherwise, get only user's purchases
            purchases = await Purchase.find({ created_by: req.user._id })
                .populate("supplier_id", "name shopname")
                .populate("created_by", "username")
                .sort({ createdAt: -1 });
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    purchases,
                    "Purchases fetched successfully"
                )
            );
    } catch (error) {
        return next(new ApiError(500, error.message));
    }
});

const getPurchaseDetails = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    try {
        // First find the purchase to check ownership
        const purchase = await Purchase.findById(id);

        if (!purchase) {
            return next(new ApiError(404, "Purchase not found"));
        }

        // Check if user is admin or the creator of the purchase
        if (
            req.user.role !== "admin" &&
            !purchase.created_by.equals(req.user._id)
        ) {
            return next(
                new ApiError(
                    403,
                    "You don't have permission to view this purchase"
                )
            );
        }

        const details = await PurchaseDetail.getDetailsByPurchaseId(id);

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    details,
                    "Purchase details fetched successfully"
                )
            );
    } catch (error) {
        return next(new ApiError(500, error.message));
    }
});

const updatePurchaseStatus = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { purchase_status } = req.body;

    if (!purchase_status) {
        return next(new ApiError(400, "Purchase status is required"));
    }

    try {
        // First find the purchase to check ownership
        const purchase = await Purchase.findById(id);

        if (!purchase) {
            return next(new ApiError(404, "Purchase not found"));
        }

        // Check if user is admin or the creator of the purchase
        if (
            req.user.role !== "admin" &&
            !purchase.created_by.equals(req.user._id)
        ) {
            return next(
                new ApiError(
                    403,
                    "You don't have permission to update this purchase"
                )
            );
        }

        const updatedPurchase = await Purchase.findByIdAndUpdate(
            id,
            {
                purchase_status,
                updated_by: req.user._id,
            },
            { new: true }
        );

        // If purchase is now approved/completed, update stock levels
        if (purchase_status === "completed" || purchase_status === "approved") {
            // Get all purchase details for this purchase
            const purchaseDetails = await PurchaseDetail.find({
                purchase_id: id,
            });

            // For each purchase detail, manually call addStockProduct
            for (const detail of purchaseDetails) {
                await detail.addStockProduct();
            }
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    updatedPurchase,
                    "Purchase status updated successfully"
                )
            );
    } catch (error) {
        return next(new ApiError(500, error.message));
    }
});

export {
    createPurchase,
    getAllPurchases,
    getPurchaseDetails,
    updatePurchaseStatus,
};
