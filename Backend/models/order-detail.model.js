import mongoose from "mongoose";
import { Product } from "./product.model.js";
import { Order } from "./order.model.js";

const orderDetailSchema = mongoose.Schema(
    {
        order_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
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

// Reduce stock product method
orderDetailSchema.methods.reduceStockProduct = async function () {
    try {
        await Product.updateStock(this.product_id, this.quantity, false);
    } catch (error) {
        throw new Error(error.message);
    }
};

// CRUD methods
orderDetailSchema.statics.createDetail = async function (detailData) {
    try {
        // Calculate total if not provided
        if (!detailData.total) {
            detailData.total = detailData.quantity * detailData.unitcost;
        }

        const detail = await this.create(detailData);

        // Reduce from stock when order detail is created
        await detail.reduceStockProduct();

        return detail;
    } catch (error) {
        throw new Error(error.message);
    }
};

orderDetailSchema.statics.getDetailsByOrderId = async function (orderId) {
    try {
        const details = await this.find({ order_id: orderId }).populate(
            "product_id",
            "product_name product_code"
        );
        return details;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const OrderDetail = mongoose.model("OrderDetail", orderDetailSchema);
