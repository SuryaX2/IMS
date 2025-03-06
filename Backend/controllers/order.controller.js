import { Order } from "../models/order.model.js";
import { OrderDetail } from "../models/order-detail.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createOrder = asyncHandler(async (req, res, next) => {
    const {
        customer_id,
        total_products,
        sub_total,
        vat,
        total,
        invoice_no,
        order_status,
        orderItems,
    } = req.body;

    if (
        !customer_id ||
        !invoice_no ||
        !orderItems ||
        !Array.isArray(orderItems)
    ) {
        return next(new ApiError(400, "Invalid order data"));
    }

    const session = await Order.startSession();
    session.startTransaction();

    try {
        // Check if invoice number is unique
        const existingOrder = await Order.findOne({ invoice_no });
        if (existingOrder) {
            return next(new ApiError(409, "Invoice number already exists"));
        }

        // Create order
        const order = await Order.create(
            [
                {
                    customer_id,
                    order_date: new Date(),
                    order_status: order_status || "pending",
                    total_products,
                    sub_total,
                    vat,
                    total,
                    invoice_no,
                },
            ],
            { session }
        );

        // Create order details
        const orderDetails = orderItems.map((item) => ({
            order_id: order[0]._id,
            product_id: item.product_id,
            quantity: item.quantity,
            unitcost: item.unitcost,
            total: item.quantity * item.unitcost,
        }));

        await OrderDetail.create(orderDetails, { session });

        await session.commitTransaction();
        session.endSession();

        return res
            .status(201)
            .json(new ApiResponse(201, order[0], "Order created successfully"));
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return next(new ApiError(500, error.message));
    }
});

const getAllOrders = asyncHandler(async (req, res, next) => {
    try {
        const orders = await Order.getAllOrders();

        return res
            .status(200)
            .json(new ApiResponse(200, orders, "Orders fetched successfully"));
    } catch (error) {
        return next(new ApiError(500, error.message));
    }
});

const getOrderDetails = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    try {
        const details = await OrderDetail.getDetailsByOrderId(id);

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    details,
                    "Order details fetched successfully"
                )
            );
    } catch (error) {
        return next(new ApiError(500, error.message));
    }
});

const updateOrderStatus = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { order_status } = req.body;

    if (!order_status) {
        return next(new ApiError(400, "Order status is required"));
    }

    try {
        const order = await Order.findByIdAndUpdate(
            id,
            { order_status },
            { new: true }
        );

        if (!order) {
            return next(new ApiError(404, "Order not found"));
        }

        return res
            .status(200)
            .json(
                new ApiResponse(200, order, "Order status updated successfully")
            );
    } catch (error) {
        return next(new ApiError(500, error.message));
    }
});

export { createOrder, getAllOrders, getOrderDetails, updateOrderStatus };
