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

    try {
        // Check if invoice number is unique
        const existingOrder = await Order.findOne({ invoice_no });
        if (existingOrder) {
            return next(new ApiError(409, "Invoice number already exists"));
        }

        // Create order
        const order = await Order.create({
            customer_id,
            order_date: new Date(),
            order_status: order_status || "pending",
            total_products: orderItems.length,
            sub_total,
            gst,
            total,
            invoice_no,
        });

        // Create order details
        const orderDetails = orderItems.map((item) => ({
            order_id: order._id,
            product_id: item.product_id,
            quantity: item.quantity,
            unitcost: item.unitcost,
            total: item.quantity * item.unitcost,
        }));

        for (const item of orderDetails) {
            await OrderDetail.createDetail(item);
        }

        return res
            .status(201)
            .json(new ApiResponse(201, order, "Order created successfully"));
    } catch (error) {
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
    const prevOrder = await Order.findById(id);

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

        // If order is being completed and wasn't completed before
        if (
            order_status === "completed" &&
            prevOrder.order_status !== "completed"
        ) {
            // Get all order details
            const orderDetails = await OrderDetail.find({ order_id: id });

            // Reduce stock for each item if not already done
            for (const detail of orderDetails) {
                await detail.reduceStockProduct();
            }
        }

        // If order was completed and now it's cancelled, restore stock
        if (
            prevOrder.order_status === "completed" &&
            order_status === "cancelled"
        ) {
            const orderDetails = await OrderDetail.find({ order_id: id });

            // Restore stock for each item
            for (const detail of orderDetails) {
                // The third parameter 'false' in updateStock means reduce stock,
                // so 'true' would mean increase stock
                await Product.updateStock(
                    detail.product_id,
                    detail.quantity,
                    true
                );
            }
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

        // Create a PDF document with better margins
        const doc = new PDFDocument({
            margin: 50,
            size: "A4",
            bufferPages: true,
        });

        // Set response headers for downloading the PDF
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=invoice-${order.invoice_no}.pdf`
        );

        // Pipe the PDF to the response
        doc.pipe(res);

        // Define colors - using a more subtle, modern palette
        const primaryColor = "#34495e";
        const accentColor = "#3498db";
        const subtleColor = "#95a5a6";
        const highlightColor = "#2980b9";

        // Add InventoryPro logo
        doc.fontSize(32)
            .fillColor(primaryColor)
            .font("Helvetica-Bold")
            .text("Inventory", 50, 50, { continued: true })
            .fillColor(accentColor)
            .text("Pro", { align: "left" });

        // Add a thin subtle line beneath the logo
        doc.moveTo(50, 90)
            .lineTo(550, 90)
            .strokeColor(subtleColor)
            .lineWidth(0.5)
            .stroke();

        // Document title
        doc.fontSize(11)
            .fillColor(subtleColor)
            .font("Helvetica")
            .text("INVOICE", 50, 105);

        // Invoice number and date with clean styling
        doc.fontSize(20)
            .fillColor(primaryColor)
            .font("Helvetica-Bold")
            .text(`#${order.invoice_no}`, 50, 125);

        doc.fontSize(10)
            .fillColor(subtleColor)
            .font("Helvetica")
            .text(
                `Issued: ${new Date(order.order_date).toLocaleDateString()}`,
                50,
                150
            );

        // Add a gradient separator
        doc.moveTo(50, 170).lineTo(550, 170).stroke(accentColor);

        // Customer Information with clean styling
        const billingY = 190;
        doc.fontSize(11)
            .fillColor(subtleColor)
            .font("Helvetica")
            .text("BILL TO", 50, billingY);

        doc.fontSize(14)
            .fillColor(primaryColor)
            .font("Helvetica-Bold")
            .text(order.customer_name, 50, billingY + 20);

        doc.fontSize(10)
            .fillColor(primaryColor)
            .font("Helvetica")
            .text(order.customer_address, 50, billingY + 40, { width: 200 })
            .text(`Phone: ${order.customer_phone}`, 50, doc.y + 10);

        // Add table headers with subtle styling
        const tableTop = 290;

        // Subtle header background
        doc.rect(50, tableTop, 500, 30).fill("#f8f9fa");

        // Header text
        doc.fillColor(primaryColor)
            .fontSize(10)
            .font("Helvetica-Bold")
            .text("ITEM", 70, tableTop + 10)
            .text("QUANTITY", 280, tableTop + 10)
            .text("PRICE", 375, tableTop + 10)
            .text("AMOUNT", 470, tableTop + 10);

        // Add a thin line below headers
        doc.moveTo(50, tableTop + 30)
            .lineTo(550, tableTop + 30)
            .stroke(subtleColor);

        // Table rows with clean styling
        let tableRowY = tableTop + 40;

        // Line height for item rows
        const lineHeight = 25;

        order.orderItems.forEach((item, index) => {
            doc.fillColor(primaryColor)
                .font("Helvetica")
                .fontSize(10)
                .text(item.product_name, 70, tableRowY, { width: 200 })
                .text(item.quantity.toString(), 300, tableRowY)
                .text(`$${item.unitcost.toFixed(2)}`, 370, tableRowY)
                .font("Helvetica-Bold")
                .text(`$${item.total.toFixed(2)}`, 470, tableRowY);

            tableRowY += lineHeight;

            // Add subtle separator between items (except after the last item)
            if (index < order.orderItems.length - 1) {
                doc.moveTo(70, tableRowY - 5)
                    .lineTo(530, tableRowY - 5)
                    .strokeColor(subtleColor)
                    .opacity(0.3)
                    .lineWidth(0.5)
                    .stroke()
                    .opacity(1); // Reset opacity
            }
        });

        // Add a line above the summary
        const summaryY = tableRowY + 20;
        doc.moveTo(350, summaryY)
            .lineTo(550, summaryY)
            .strokeColor(subtleColor)
            .lineWidth(0.5)
            .stroke();

        // Summary section with clean alignment
        doc.fillColor(primaryColor)
            .font("Helvetica")
            .fontSize(10)
            .text("Subtotal", 370, summaryY + 10)
            .text(`$${order.sub_total.toFixed(2)}`, 470, summaryY + 10, {
                align: "right",
            })
            .text(`GST (${order.gst}%)`, 370, summaryY + 30)
            .text(
                `$${(order.total - order.sub_total).toFixed(2)}`,
                470,
                summaryY + 30,
                { align: "right" }
            );

        // Add a double line above total
        doc.moveTo(350, summaryY + 50)
            .lineTo(550, summaryY + 50)
            .strokeColor(subtleColor)
            .lineWidth(0.5)
            .stroke();
        doc.moveTo(350, summaryY + 52)
            .lineTo(550, summaryY + 52)
            .strokeColor(subtleColor)
            .lineWidth(0.5)
            .stroke();

        // Total with highlight
        doc.font("Helvetica-Bold")
            .fontSize(14)
            .text("TOTAL", 370, summaryY + 60)
            .fillColor(highlightColor)
            .text(`$${order.total.toFixed(2)}`, 470, summaryY + 60, {
                align: "right",
            });

        // Add payment information and thank you note
        const noteY = summaryY + 100;
        doc.moveTo(50, noteY).lineTo(550, noteY).stroke(subtleColor);

        doc.fillColor(primaryColor)
            .fontSize(10)
            .font("Helvetica")
            .text("Payment Information", 50, noteY + 20, { continued: true })
            .font("Helvetica-Bold")
            .text(": Please include the invoice number with your payment.", {
                continued: false,
            });

        doc.fontSize(12)
            .font("Helvetica-Bold")
            .fillColor(accentColor)
            .text("Thank you for your business!", 50, noteY + 50);

        // Add footer
        doc.fontSize(8)
            .fillColor(subtleColor)
            .font("Helvetica")
            .text(`InventoryPro - Invoice #${order.invoice_no}`, 50, 700, {
                align: "center",
                width: 500,
            });

        // Page numbers
        const pageCount = doc.bufferedPageCount;
        for (let i = 0; i < pageCount; i++) {
            doc.switchToPage(i);
            doc.fontSize(8)
                .fillColor(subtleColor)
                .text(`Page ${i + 1} of ${pageCount}`, 50, 720, {
                    align: "center",
                    width: 500,
                });
        }

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
