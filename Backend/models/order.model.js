import mongoose from "mongoose";
import { Customer } from "./customer.model";

const orderSchema = mongoose.Schema(
    {
        customer_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
        },
        order_date: {
            type: Date,
            required: true,
            default: Date.now,
        },
        order_status: {
            type: String,
            enum: ["pending", "processing", "completed", "cancelled"],
            default: "pending",
        },
        total_products: {
            type: Number,
            required: true,
        },
        sub_total: {
            type: Number,
            required: true,
        },
        vat: {
            type: Number,
            default: 0,
        },
        total: {
            type: Number,
            required: true,
        },
        invoice_no: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            maxlength: 10,
        },
    },
    { timestamps: true }
);

// CRUD methods
orderSchema.statics.createOrder = async function (orderData) {
    try {
        const order = await this.create(orderData);
        return order;
    } catch (error) {
        throw new Error(error.message);
    }
};

orderSchema.statics.getAllOrders = async function () {
    try {
        const orders = await this.find({})
            .populate("customer_id", "name")
            .sort({ createdAt: -1 });
        return orders;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const Order = mongoose.model("Order", orderSchema);
