import mongoose from "mongoose";
import { Order } from "../models/order.model.js";
import { OrderDetail } from "../models/order-detail.model.js";
import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";

const generateInvoiceNo = () => {
    const ts = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${ts}${rand}`.substring(0, 10);
};

class OrderService {
    async createOrder(orderData, userId) {
        const { customer_id, sub_total, gst, total, order_status, orderItems } =
            orderData;

        if (
            !customer_id ||
            !Array.isArray(orderItems) ||
            orderItems.length === 0
        ) {
            throw new ApiError(400, "Invalid order data");
        }

        let invoice_no;
        let attempts = 0;
        do {
            invoice_no = generateInvoiceNo();
            const existing = await Order.findOne({ invoice_no }).lean();
            if (!existing) break;
            attempts++;
        } while (attempts < 5);

        if (attempts >= 5) {
            throw new ApiError(
                500,
                "Failed to generate a unique invoice number. Please try again."
            );
        }

        const initialStatus = order_status || "pending";
        const shouldDeductStock = initialStatus === "completed";

        if (shouldDeductStock) {
            const insufficientItems =
                await Product.findInsufficientStock(orderItems);
            if (insufficientItems.length > 0) {
                throw new ApiError(
                    422,
                    "Insufficient stock for one or more products",
                    insufficientItems
                );
            }
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const [order] = await Order.create(
                [
                    {
                        customer_id,
                        order_date: new Date(),
                        order_status: initialStatus,
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

            if (shouldDeductStock) {
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
                }
            }

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

        if (newStatus === "completed") {
            const details = await OrderDetail.find({
                order_id: orderId,
            }).lean();

            const items = details.map((d) => ({
                product_id: d.product_id,
                quantity: d.quantity,
            }));

            const insufficientItems =
                await Product.findInsufficientStock(items);
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
                for (const detail of details) {
                    const updated = await Product.deductStock(
                        detail.product_id,
                        detail.quantity,
                        session
                    );
                    if (!updated) {
                        throw new ApiError(
                            422,
                            `Insufficient stock for product ID: ${detail.product_id}. Please refresh and try again.`
                        );
                    }
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
