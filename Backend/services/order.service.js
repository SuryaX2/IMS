import mongoose from "mongoose";
import { Order } from "../models/order.model.js";
import { OrderDetail } from "../models/order-detail.model.js";
import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";

class OrderService {
    async createOrder(orderData, userId) {
        const {
            customer_id,
            sub_total,
            gst,
            total,
            invoice_no,
            order_status,
            orderItems,
        } = orderData;

        if (
            !customer_id ||
            !invoice_no ||
            !Array.isArray(orderItems) ||
            orderItems.length === 0
        ) {
            throw new ApiError(400, "Invalid order data");
        }

        const existing = await Order.findOne({ invoice_no }).lean();
        if (existing) {
            throw new ApiError(409, "Invoice number already exists");
        }

        const insufficientItems =
            await Product.findInsufficientStock(orderItems);
        if (insufficientItems.length > 0) {
            throw new ApiError(
                422,
                "Insufficient stock for one or more products",
                insufficientItems
            );
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const stockDeductions = [];

            for (const item of orderItems) {
                const updated = await Product.deductStock(
                    item.product_id,
                    item.quantity,
                    session
                );

                if (!updated) {
                    throw new ApiError(
                        422,
                        `Insufficient stock for product ID: ${item.product_id}. Please refresh and try again.`
                    );
                }

                stockDeductions.push({
                    product_id: item.product_id,
                    quantity: item.quantity,
                });
            }

            const [order] = await Order.create(
                [
                    {
                        customer_id,
                        order_date: new Date(),
                        order_status: order_status || "pending",
                        total_products: orderItems.length,
                        sub_total,
                        gst,
                        total,
                        invoice_no,
                        created_by: userId,
                        updated_by: userId,
                    },
                ],
                { session }
            );

            await OrderDetail.bulkCreateDetails(
                orderItems.map((item) => ({
                    order_id: order._id,
                    product_id: item.product_id,
                    quantity: item.quantity,
                    unitcost: item.unitcost,
                    total: item.quantity * item.unitcost,
                })),
                session
            );

            await session.commitTransaction();
            return order;
        } catch (err) {
            await session.abortTransaction();
            throw err;
        } finally {
            session.endSession();
        }
    }

    async updateOrderStatus(orderId, newStatus, userId, userRole) {
        const order = await Order.findById(orderId);

        if (!order) {
            throw new ApiError(404, "Order not found");
        }

        if (
            userRole !== "admin" &&
            order.created_by.toString() !== userId.toString()
        ) {
            throw new ApiError(
                403,
                "You are not authorized to update this order"
            );
        }

        const validTransitions = {
            pending: ["processing", "cancelled"],
            processing: ["completed", "cancelled"],
            completed: [],
            cancelled: [],
        };

        if (!validTransitions[order.order_status]?.includes(newStatus)) {
            throw new ApiError(
                400,
                `Cannot transition order from "${order.order_status}" to "${newStatus}"`
            );
        }

        if (newStatus === "cancelled") {
            const session = await mongoose.startSession();
            session.startTransaction();

            try {
                const details = await OrderDetail.find({
                    order_id: orderId,
                }).lean();

                for (const detail of details) {
                    await Product.restoreStock(
                        detail.product_id,
                        detail.quantity,
                        session
                    );
                }

                const updated = await Order.findByIdAndUpdate(
                    orderId,
                    { order_status: newStatus, updated_by: userId },
                    { new: true, session }
                );

                await session.commitTransaction();
                return updated;
            } catch (err) {
                await session.abortTransaction();
                throw err;
            } finally {
                session.endSession();
            }
        }

        return Order.findByIdAndUpdate(
            orderId,
            { order_status: newStatus, updated_by: userId },
            { new: true }
        );
    }
}

export default new OrderService();
