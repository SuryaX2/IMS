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
    },
    { timestamps: true }
);

// Add stock product method
purchaseDetailSchema.methods.addStockProduct = async function () {
    try {
        await Product.updateStock(this.product_id, this.quantity, true);
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

        // Add to stock when purchase detail is created
        await detail.addStockProduct();

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
            "product_name product_code"
        );
        return details;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const PurchaseDetail = mongoose.model(
    "PurchaseDetail",
    purchaseDetailSchema
);
