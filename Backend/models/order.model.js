import mongoose from "mongoose";
import { Customer } from "./customer.model.js";

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
        gst: {
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

// Get order with customer details and order items
orderSchema.statics.getOrderWithDetails = async function (orderId) {
    try {
        const order = await this.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(orderId) },
            },
            {
                $lookup: {
                    from: "customers",
                    localField: "customer_id",
                    foreignField: "_id",
                    as: "customer",
                },
            },
            {
                $unwind: "$customer",
            },
            {
                $lookup: {
                    from: "orderdetails",
                    localField: "_id",
                    foreignField: "order_id",
                    as: "orderItems",
                },
            },
            {
                $lookup: {
                    from: "products",
                    localField: "orderItems.product_id",
                    foreignField: "_id",
                    as: "products",
                },
            },
            {
                $project: {
                    _id: 1,
                    invoice_no: 1,
                    order_date: 1,
                    order_status: 1,
                    total_products: 1,
                    sub_total: 1,
                    gst: 1,
                    total: 1,
                    customer_name: "$customer.name",
                    customer_phone: "$customer.phone",
                    customer_address: "$customer.address",
                    orderItems: {
                        $map: {
                            input: "$orderItems",
                            as: "item",
                            in: {
                                product_id: "$$item.product_id",
                                quantity: "$$item.quantity",
                                unitcost: "$$item.unitcost",
                                total: "$$item.total",
                                product_name: {
                                    $arrayElemAt: [
                                        "$products.product_name",
                                        {
                                            $indexOfArray: [
                                                "$products._id",
                                                "$$item.product_id",
                                            ],
                                        },
                                    ],
                                },
                            },
                        },
                    },
                    createdAt: 1,
                    updatedAt: 1,
                },
            },
        ]);

        return order[0];
    } catch (error) {
        throw new Error(error.message);
    }
};

export const Order = mongoose.model("Order", orderSchema);
