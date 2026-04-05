import { Order } from "../models/order.model.js";
import { OrderDetail } from "../models/order-detail.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import orderService from "../services/order.service.js";
import PDFDocument from "pdfkit";

const createOrder = asyncHandler(async (req, res, next) => {
    try {
        const order = await orderService.createOrder(req.body, req.user._id);
        return res
            .status(201)
            .json(new ApiResponse(201, order, "Order created successfully"));
    } catch (err) {
        return next(err);
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

    const filter = {};

    if (req.user.role !== "admin") {
        filter.created_by = req.user._id;
    }

    if (search) {
        filter.$or = [{ invoice_no: { $regex: search, $options: "i" } }];
    }

    if (customer_id) filter.customer_id = customer_id;
    if (order_status) filter.order_status = order_status;

    if (start_date || end_date) {
        filter.order_date = {};
        if (start_date) filter.order_date.$gte = new Date(start_date);
        if (end_date) filter.order_date.$lte = new Date(end_date);
    }

    if (min_total || max_total) {
        filter.total = {};
        if (min_total) filter.total.$gte = parseFloat(min_total);
        if (max_total) filter.total.$lte = parseFloat(max_total);
    }

    const sortOptions = sort_by
        ? { [sort_by]: sort_order === "desc" ? -1 : 1 }
        : { createdAt: -1 };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    try {
        const [orders, total] = await Promise.all([
            Order.find(filter)
                .populate("customer_id", "name")
                .sort(sortOptions)
                .skip(skip)
                .limit(parseInt(limit)),
            Order.countDocuments(filter),
        ]);

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
    } catch (err) {
        return next(new ApiError(500, err.message));
    }
});

const getAllOrdersAdmin = getAllOrders;

const getOrderDetails = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    try {
        const order = await Order.findById(id);

        if (!order) {
            return next(new ApiError(404, "Order not found"));
        }

        if (
            req.user.role !== "admin" &&
            order.created_by.toString() !== req.user._id.toString()
        ) {
            return next(
                new ApiError(403, "You are not authorized to access this order")
            );
        }

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
    } catch (err) {
        return next(new ApiError(500, err.message));
    }
});

const updateOrderStatus = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { order_status } = req.body;

    if (!order_status) {
        return next(new ApiError(400, "Order status is required"));
    }

    try {
        const order = await orderService.updateOrderStatus(
            id,
            order_status,
            req.user._id,
            req.user.role
        );

        return res
            .status(200)
            .json(
                new ApiResponse(200, order, "Order status updated successfully")
            );
    } catch (err) {
        return next(err);
    }
});

const generateInvoice = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    try {
        const orderDetails =
            req.user.role === "admin"
                ? await Order.getOrderWithDetails(id)
                : await Order.getOrderWithDetails(id, req.user._id);

        if (!orderDetails) {
            return next(
                new ApiError(
                    404,
                    "Order not found or you don't have permission to access it"
                )
            );
        }

        const doc = new PDFDocument({
            margin: 50,
            size: "A4",
            bufferPages: true,
        });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=invoice-${orderDetails.invoice_no}.pdf`
        );

        doc.pipe(res);

        const primaryColor = "#34495e";
        const accentColor = "#3498db";
        const subtleColor = "#95a5a6";
        const highlightColor = "#2980b9";

        doc.fontSize(32)
            .fillColor(primaryColor)
            .font("Helvetica-Bold")
            .text("Inventory", 50, 50, { continued: true })
            .fillColor(accentColor)
            .text("Pro", { align: "left" });

        doc.moveTo(50, 90)
            .lineTo(550, 90)
            .strokeColor(subtleColor)
            .lineWidth(0.5)
            .stroke();

        doc.fontSize(11)
            .fillColor(subtleColor)
            .font("Helvetica")
            .text("INVOICE", 50, 105);

        doc.fontSize(20)
            .fillColor(primaryColor)
            .font("Helvetica-Bold")
            .text(`#${orderDetails.invoice_no}`, 50, 125);

        doc.fontSize(10)
            .fillColor(subtleColor)
            .font("Helvetica")
            .text(
                `Issued: ${new Date(orderDetails.order_date).toLocaleDateString()}`,
                50,
                150
            );

        doc.moveTo(50, 170).lineTo(550, 170).stroke(accentColor);

        const billingY = 190;
        doc.fontSize(11)
            .fillColor(subtleColor)
            .font("Helvetica")
            .text("BILL TO", 50, billingY);
        doc.fontSize(14)
            .fillColor(primaryColor)
            .font("Helvetica-Bold")
            .text(orderDetails.customer_name, 50, billingY + 20);
        doc.fontSize(10)
            .fillColor(primaryColor)
            .font("Helvetica")
            .text(orderDetails.customer_address, 50, billingY + 40, {
                width: 200,
            })
            .text(`Phone: ${orderDetails.customer_phone}`, 50, doc.y + 10);

        const tableTop = 290;
        doc.rect(50, tableTop, 500, 30).fill("#f8f9fa");

        doc.fillColor(primaryColor)
            .fontSize(10)
            .font("Helvetica-Bold")
            .text("ITEM", 70, tableTop + 10)
            .text("QUANTITY", 280, tableTop + 10)
            .text("PRICE", 375, tableTop + 10)
            .text("AMOUNT", 470, tableTop + 10);

        doc.moveTo(50, tableTop + 30)
            .lineTo(550, tableTop + 30)
            .stroke(subtleColor);

        let tableRowY = tableTop + 40;
        const lineHeight = 25;

        orderDetails.orderItems.forEach((item, index) => {
            doc.fillColor(primaryColor)
                .font("Helvetica")
                .fontSize(10)
                .text(item.product_name, 70, tableRowY, { width: 200 })
                .text(item.quantity.toString(), 300, tableRowY)
                .text(`$${item.unitcost.toFixed(2)}`, 370, tableRowY)
                .font("Helvetica-Bold")
                .text(`$${item.total.toFixed(2)}`, 470, tableRowY);

            tableRowY += lineHeight;

            if (index < orderDetails.orderItems.length - 1) {
                doc.moveTo(70, tableRowY - 5)
                    .lineTo(530, tableRowY - 5)
                    .strokeColor(subtleColor)
                    .opacity(0.3)
                    .lineWidth(0.5)
                    .stroke()
                    .opacity(1);
            }
        });

        const summaryY = tableRowY + 20;
        doc.moveTo(350, summaryY)
            .lineTo(550, summaryY)
            .strokeColor(subtleColor)
            .lineWidth(0.5)
            .stroke();

        doc.fillColor(primaryColor)
            .font("Helvetica")
            .fontSize(10)
            .text("Subtotal", 370, summaryY + 10)
            .text(`$${orderDetails.sub_total.toFixed(2)}`, 470, summaryY + 10, {
                align: "right",
            })
            .text("GST (18%)", 370, summaryY + 30)
            .text(
                `$${(orderDetails.total - orderDetails.sub_total).toFixed(2)}`,
                470,
                summaryY + 30,
                { align: "right" }
            );

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

        doc.font("Helvetica-Bold")
            .fontSize(14)
            .text("TOTAL", 370, summaryY + 60)
            .fillColor(highlightColor)
            .text(`$${orderDetails.total.toFixed(2)}`, 470, summaryY + 60, {
                align: "right",
            });

        const noteY = summaryY + 100;
        doc.moveTo(50, noteY).lineTo(550, noteY).stroke(subtleColor);

        doc.fillColor(primaryColor)
            .fontSize(10)
            .font("Helvetica")
            .text("Payment Information", 50, noteY + 20, { continued: true })
            .font("Helvetica-Bold")
            .text(": Please include the invoice number with your payment.");

        doc.fontSize(12)
            .font("Helvetica-Bold")
            .fillColor(accentColor)
            .text("Thank you for your business!", 50, noteY + 50);

        doc.fontSize(8)
            .fillColor(subtleColor)
            .font("Helvetica")
            .text(
                `InventoryPro - Invoice #${orderDetails.invoice_no}`,
                50,
                700,
                {
                    align: "center",
                    width: 500,
                }
            );

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

        doc.end();
    } catch (err) {
        return next(new ApiError(500, err.message));
    }
});

export {
    createOrder,
    getAllOrders,
    getAllOrdersAdmin,
    getOrderDetails,
    updateOrderStatus,
    generateInvoice,
};
