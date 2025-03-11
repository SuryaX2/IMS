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

        // Create purchase without transaction
        const purchase = await Purchase.create({
            supplier_id,
            purchase_no,
            purchase_status: purchase_status || "pending",
            created_by: req.user._id,
        });

        // Create purchase details separately
        const purchaseDetails = details.map((detail) => ({
            purchase_id: purchase._id,
            product_id: detail.product_id,
            quantity: detail.quantity,
            unitcost: detail.unitcost,
            total: detail.quantity * detail.unitcost,
        }));

        await PurchaseDetail.insertMany(purchaseDetails);

        return res
            .status(201)
            .json(
                new ApiResponse(201, purchase, "Purchase created successfully")
            );
    } catch (error) {
        return next(new ApiError(500, error.message));
    }
});

const getAllPurchases = asyncHandler(async (req, res, next) => {
    try {
        const purchases = await Purchase.getAllPurchases();

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
        const purchase = await Purchase.findByIdAndUpdate(
            id,
            {
                purchase_status,
                updated_by: req.user._id,
            },
            { new: true }
        );

        if (!purchase) {
            return next(new ApiError(404, "Purchase not found"));
        }

        // If purchase is now approved/completed, update stock levels
        if (purchase_status === "completed" || purchase_status === "approved") {
            // Get all purchase details for this purchase
            const purchaseDetails = await PurchaseDetail.find({
                purchase_id: id,
            });

            // Update stock for each product using the addStockProduct method
            for (const detail of purchaseDetails) {
                await detail.addStockProduct();
            }
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    purchase,
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
