import mongoose from "mongoose";
import { Product } from "./product.model.js";
import { Purchase } from "./purchase.model.js";

const purchaseDetailSchema = mongoose.Schema(
    {
        purchase_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Purchase",
            required: true,
        },
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        unitcost: {
            type: Number,
            required: true,
        },
        total: {
            type: Number,
            required: true,
        },
        // Return tracking fields
        return_processed: {
            type: Boolean,
            default: false,
        },
        return_date: {
            type: Date,
        },
        returned_quantity: {
            type: Number,
            default: 0,
        },
        refund_amount: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

// Add stock product method
purchaseDetailSchema.methods.addStockProduct = async function () {
    try {
        await Product.updateStock(this.product_id, this.quantity, true);
        return true;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Method to process return for this detail
purchaseDetailSchema.methods.processReturn = async function () {
    try {
        // Get the product to check current stock
        const product = await Product.findById(this.product_id);
        if (!product) {
            throw new Error("Product not found");
        }

        // Calculate returnable quantity (minimum of purchased quantity and current stock)
        const returnableQuantity = Math.min(this.quantity, product.stock);

        if (returnableQuantity <= 0) {
            throw new Error("No stock available to return");
        }

        // Calculate refund amount
        const refundAmount = returnableQuantity * this.unitcost;

        // Update product stock (reduce by returnable quantity)
        await Product.updateStock(this.product_id, returnableQuantity, false);

        // Update this purchase detail with return information
        this.return_processed = true;
        this.return_date = new Date();
        this.returned_quantity = returnableQuantity;
        this.refund_amount = refundAmount;

        await this.save();

        return {
            product_id: this.product_id,
            purchased_quantity: this.quantity,
            returned_quantity: returnableQuantity,
            refund_amount: refundAmount,
            fully_returned: returnableQuantity === this.quantity,
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

// CRUD methods
purchaseDetailSchema.statics.createDetail = async function (detailData) {
    try {
        // Calculate total if not provided
        if (!detailData.total) {
            detailData.total = detailData.quantity * detailData.unitcost;
        }

        const detail = await this.create(detailData);

        // Get the associated purchase to check its status
        const purchase = await Purchase.findById(detail.purchase_id);

        // Only add to stock when purchase is completed or approved
        if (
            purchase &&
            (purchase.purchase_status === "completed" ||
                purchase.purchase_status === "approved")
        ) {
            await detail.addStockProduct();
        }

        return detail;
    } catch (error) {
        throw new Error(error.message);
    }
};

purchaseDetailSchema.statics.getDetailsByPurchaseId = async function (
    purchaseId
) {
    try {
        const details = await this.find({ purchase_id: purchaseId }).populate(
            "product_id",
            "product_name product_code stock"
        );
        return details;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Get detailed return information for a purchase
purchaseDetailSchema.statics.getReturnDetailsByPurchaseId = async function (
    purchaseId
) {
    try {
        const details = await this.find({
            purchase_id: purchaseId,
            return_processed: true,
        }).populate("product_id", "product_name product_code");
        return details;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Static method to process returns for all details of a purchase
purchaseDetailSchema.statics.processAllReturns = async function (purchaseId) {
    try {
        const details = await this.find({ purchase_id: purchaseId }).populate(
            "product_id",
            "product_name stock"
        );

        const returnResults = [];
        let totalRefundAmount = 0;

        for (const detail of details) {
            const returnResult = await detail.processReturn();
            returnResults.push(returnResult);
            totalRefundAmount += returnResult.refund_amount;
        }

        return {
            total_refund_amount: totalRefundAmount,
            return_details: returnResults,
            return_summary: {
                total_items_processed: returnResults.length,
                fully_returned_items: returnResults.filter(
                    (item) => item.fully_returned
                ).length,
                partially_returned_items: returnResults.filter(
                    (item) => !item.fully_returned
                ).length,
            },
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

export const PurchaseDetail = mongoose.model(
    "PurchaseDetail",
    purchaseDetailSchema
);
