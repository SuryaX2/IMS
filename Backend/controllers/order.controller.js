import { Order } from "../models/order.model.js";
import { OrderDetail } from "../models/order-detail.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

const createOrder = asyncHandler(async (req, res, next) => {
    const {
        customer_id,
        total_products,
        sub_total,
        gst,
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
                    gst,
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
    const {
        search,
        customer_id,
        start_date,
        end_date,
        order_status,
        min_total,
        max_total,
        sort_by,
        sort_order,
        page = 1,
        limit = 10,
    } = req.query;

    // Build filter object
    let filter = {};

    if (search) {
        filter.$or = [{ invoice_no: { $regex: search, $options: "i" } }];
    }

    if (customer_id) {
        filter.customer_id = customer_id;
    }

    if (order_status) {
        filter.order_status = order_status;
    }

    // Date range filter
    if (start_date || end_date) {
        filter.order_date = {};
        if (start_date) filter.order_date.$gte = new Date(start_date);
        if (end_date) filter.order_date.$lte = new Date(end_date);
    }

    // Total amount range filter
    if (min_total || max_total) {
        filter.total = {};
        if (min_total) filter.total.$gte = parseFloat(min_total);
        if (max_total) filter.total.$lte = parseFloat(max_total);
    }

    // Build sort options
    let sortOptions = {};
    if (sort_by) {
        sortOptions[sort_by] = sort_order === "desc" ? -1 : 1;
    } else {
        sortOptions = { createdAt: -1 };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    try {
        const orders = await Order.find(filter)
            .populate("customer_id", "name")
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Order.countDocuments(filter);

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    orders,
                    pagination: {
                        total,
                        page: parseInt(page),
                        limit: parseInt(limit),
                        pages: Math.ceil(total / parseInt(limit)),
                    },
                },
                "Orders fetched successfully"
            )
        );
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

// Generate PDF invoice
const generateInvoice = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    try {
        const order = await Order.getOrderWithDetails(id);

        if (!order) {
            return next(new ApiError(404, "Order not found"));
        }

        // Create a PDF document
        const doc = new PDFDocument({ margin: 50 });

        // Set response headers for downloading the PDF
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=invoice-${order.invoice_no}.pdf`
        );

        // Pipe the PDF to the response
        doc.pipe(res);

        // Add content to the PDF
        // Header
        doc.fontSize(25).text("INVOICE", { align: "center" });
        doc.moveDown();

        // Company and Invoice Information
        doc.fontSize(10)
            .text(`Invoice Number: ${order.invoice_no}`, { align: "right" })
            .text(`Date: ${new Date(order.order_date).toLocaleDateString()}`, {
                align: "right",
            })
            .moveDown();

        // Customer Information
        doc.fontSize(12)
            .text("Customer Information:")
            .fontSize(10)
            .text(`Name: ${order.customer_name}`)
            .text(`Phone: ${order.customer_phone}`)
            .text(`Address: ${order.customer_address}`)
            .moveDown();

        // Items Table
        doc.fontSize(12).text("Order Items:").moveDown();

        // Table headers
        let startX = 50;
        let startY = doc.y;
        let headerHeight = 20;

        doc.rect(startX, startY, 500, headerHeight).stroke();

        doc.fontSize(10)
            .text("Product", startX + 10, startY + 5, { width: 200 })
            .text("Quantity", startX + 210, startY + 5, { width: 90 })
            .text("Unit Price", startX + 300, startY + 5, { width: 100 })
            .text("Total", startX + 400, startY + 5, { width: 90 });

        startY += headerHeight;

        // Table rows
        order.orderItems.forEach((item) => {
            const rowHeight = 20;

            doc.rect(startX, startY, 500, rowHeight).stroke();

            doc.fontSize(10)
                .text(item.product_name, startX + 10, startY + 5, {
                    width: 200,
                })
                .text(item.quantity.toString(), startX + 210, startY + 5, {
                    width: 90,
                })
                .text(
                    `$${item.unitcost.toFixed(2)}`,
                    startX + 300,
                    startY + 5,
                    { width: 100 }
                )
                .text(`$${item.total.toFixed(2)}`, startX + 400, startY + 5, {
                    width: 90,
                });

            startY += rowHeight;
        });

        // Summary
        doc.moveDown()
            .fontSize(10)
            .text(`Subtotal: $${order.sub_total.toFixed(2)}`, {
                align: "right",
            })
            .text(
                `gst (${order.gst}%): $${(order.total - order.sub_total).toFixed(2)}`,
                { align: "right" }
            )
            .fontSize(12)
            .text(`Total: $${order.total.toFixed(2)}`, { align: "right" });

        // Footer
        doc.fontSize(10)
            .moveDown(3)
            .text("Thank you for your business!", { align: "center" });

        // Finalize PDF
        doc.end();
    } catch (error) {
        return next(new ApiError(500, error.message));
    }
});

export {
    createOrder,
    getAllOrders,
    getOrderDetails,
    updateOrderStatus,
    generateInvoice,
};
