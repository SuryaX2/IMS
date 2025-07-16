import { Purchase } from "../models/purchase.model.js";
import { PurchaseDetail } from "../models/purchase-detail.model.js";
import { Product } from "../models/product.model.js";
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

        // Handle different status changes
        let returnInfo = null;

        if (purchase_status === "returned") {
            // Handle return logic
            returnInfo = await handlePurchaseReturn(id, purchase);
        } else if (
            purchase_status === "completed" ||
            purchase_status === "approved"
        ) {
            // If purchase is being approved/completed from pending
            if (purchase.purchase_status === "pending") {
                const purchaseDetails = await PurchaseDetail.find({
                    purchase_id: id,
                });

                // Add stock for each purchase detail
                for (const detail of purchaseDetails) {
                    await detail.addStockProduct();
                }
            }
        }

        const updatedPurchase = await Purchase.findByIdAndUpdate(
            id,
            {
                purchase_status,
                updated_by: req.user._id,
            },
            { new: true }
        );

        const responseData = {
            purchase: updatedPurchase,
            ...(returnInfo && { returnInfo }),
        };

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    responseData,
                    `Purchase status updated to ${purchase_status} successfully`
                )
            );
    } catch (error) {
        return next(new ApiError(500, error.message));
    }
});

// Helper function to handle purchase returns
const handlePurchaseReturn = async (purchaseId, purchase) => {
    try {
        // Use the static method from PurchaseDetail model to process all returns
        const returnInfo = await PurchaseDetail.processAllReturns(purchaseId);

        return returnInfo;
    } catch (error) {
        throw new Error(`Return processing failed: ${error.message}`);
    }
};

// New endpoint to get return information before processing
const getReturnPreview = asyncHandler(async (req, res, next) => {
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

        // Check if purchase is already returned
        if (purchase.purchase_status === "returned") {
            return next(new ApiError(400, "Purchase is already returned"));
        }

        // Check if purchase was completed/approved (you can only return completed purchases)
        if (
            purchase.purchase_status !== "completed" &&
            purchase.purchase_status !== "approved"
        ) {
            return next(
                new ApiError(
                    400,
                    "Only completed/approved purchases can be returned"
                )
            );
        }

        // Get purchase details with current stock information
        const purchaseDetails = await PurchaseDetail.find({
            purchase_id: id,
        }).populate("product_id", "product_name stock");

        const returnPreview = [];
        let totalPotentialRefund = 0;

        for (const detail of purchaseDetails) {
            const product = detail.product_id;
            const purchasedQuantity = detail.quantity;
            const currentStock = product.stock;

            const returnableQuantity = Math.min(
                purchasedQuantity,
                currentStock
            );
            const refundAmount = returnableQuantity * detail.unitcost;
            totalPotentialRefund += refundAmount;

            returnPreview.push({
                product_id: product._id,
                product_name: product.product_name,
                purchased_quantity: purchasedQuantity,
                current_stock: currentStock,
                returnable_quantity: returnableQuantity,
                unit_cost: detail.unitcost,
                potential_refund: refundAmount,
                can_fully_return: returnableQuantity === purchasedQuantity,
            });
        }

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
    } catch (error) {
        return next(new ApiError(500, error.message));
    }
});

export {
    createPurchase,
    getAllPurchases,
    getPurchaseDetails,
    updatePurchaseStatus,
    getReturnPreview,
};
