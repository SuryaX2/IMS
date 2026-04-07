import { Purchase } from "../models/purchase.model.js";
import { PurchaseDetail } from "../models/purchase-detail.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import purchaseService from "../services/purchase.service.js";

const createPurchase = asyncHandler(async (req, res, next) => {
    try {
        const purchase = await purchaseService.createPurchase(
            req.body,
            req.user._id
        );
        return res
            .status(201)
            .json(
                new ApiResponse(201, purchase, "Purchase created successfully")
            );
    } catch (err) {
        return next(err);
    }
});

const getAllPurchases = asyncHandler(async (req, res, next) => {
    try {
        const purchases =
            req.user.role === "admin"
                ? await Purchase.getAllPurchases()
                : await Purchase.find({ created_by: req.user._id })
                      .populate("supplier_id", "name shopname")
                      .populate("created_by", "username")
                      .sort({ createdAt: -1 });

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    purchases,
                    "Purchases fetched successfully"
                )
            );
    } catch (err) {
        return next(new ApiError(500, err.message));
    }
});

const getPurchaseDetails = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    try {
        const purchase = await Purchase.findById(id);

        if (!purchase) {
            return next(new ApiError(404, "Purchase not found"));
        }

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
    } catch (err) {
        return next(new ApiError(500, err.message));
    }
});

const updatePurchaseStatus = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { purchase_status } = req.body;

    if (!purchase_status) {
        return next(new ApiError(400, "Purchase status is required"));
    }

    try {
        const result = await purchaseService.updatePurchaseStatus(
            id,
            purchase_status,
            req.user._id,
            req.user.role
        );

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    result,
                    `Purchase status updated to ${purchase_status} successfully`
                )
            );
    } catch (err) {
        return next(err);
    }
});

const getReturnPreview = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    try {
        const purchase = await Purchase.findById(id);

        if (!purchase) {
            return next(new ApiError(404, "Purchase not found"));
        }

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

        if (purchase.purchase_status === "returned") {
            return next(new ApiError(400, "Purchase is already returned"));
        }

        if (purchase.purchase_status !== "completed") {
            return next(
                new ApiError(400, "Only completed purchases can be returned")
            );
        }

        const purchaseDetails = await PurchaseDetail.find({
            purchase_id: id,
        }).populate("product_id", "product_name stock");

        let totalPotentialRefund = 0;

        const returnPreview = purchaseDetails.map((detail) => {
            const product = detail.product_id;
            const returnableQuantity = Math.min(detail.quantity, product.stock);
            const refundAmount = returnableQuantity * detail.unitcost;
            totalPotentialRefund += refundAmount;

            return {
                product_id: product._id,
                product_name: product.product_name,
                purchased_quantity: detail.quantity,
                current_stock: product.stock,
                returnable_quantity: returnableQuantity,
                unit_cost: detail.unitcost,
                potential_refund: refundAmount,
                can_fully_return: returnableQuantity === detail.quantity,
            };
        });

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    purchase_id: id,
                    purchase_no: purchase.purchase_no,
                    total_potential_refund: totalPotentialRefund,
                    return_preview: returnPreview,
                },
                "Return preview generated successfully"
            )
        );
    } catch (err) {
        return next(new ApiError(500, err.message));
    }
});

export {
    createPurchase,
    getAllPurchases,
    getPurchaseDetails,
    updatePurchaseStatus,
    getReturnPreview,
};
