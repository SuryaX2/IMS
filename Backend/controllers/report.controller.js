import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { Purchase } from "../models/purchase.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Stock report
export const getStockReport = asyncHandler(async (req, res, next) => {
    try {
        const stockReport = await Product.aggregate([
            {
                $lookup: {
                    from: "categories",
                    localField: "category_id",
                    foreignField: "_id",
                    as: "category",
                },
            },
            {
                $unwind: "$category",
            },
            {
                $project: {
                    product_name: 1,
                    product_code: 1,
                    category_name: "$category.category_name",
                    stock: 1,
                    buying_price: 1,
                    selling_price: 1,
                    stock_value: { $multiply: ["$stock", "$buying_price"] },
                },
            },
            {
                $sort: { stock: -1 },
            },
        ]);

        // Calculate totals
        const totalStock = stockReport.reduce(
            (sum, product) => sum + product.stock,
            0
        );
        const totalValue = stockReport.reduce(
            (sum, product) => sum + product.stock_value,
            0
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    report: stockReport,
                    summary: {
                        totalProducts: stockReport.length,
                        totalStock,
                        totalValue,
                    },
                },
                "Stock report generated successfully"
            )
        );
    } catch (error) {
        return next(new ApiError(500, error.message));
    }
});

// Sales report by period
export const getSalesReport = asyncHandler(async (req, res, next) => {
    const { startDate, endDate } = req.query;

    // Format dates or use default (last 30 days)
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate
        ? new Date(startDate)
        : new Date(end - 30 * 24 * 60 * 60 * 1000);

    try {
        const salesReport = await Order.aggregate([
            {
                $match: {
                    order_date: { $gte: start, $lte: end },
                    order_status: "completed",
                },
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
                $project: {
                    invoice_no: 1,
                    order_date: 1,
                    customer_name: "$customer.name",
                    total_products: 1,
                    sub_total: 1,
                    vat: 1,
                    total: 1,
                },
            },
            {
                $sort: { order_date: -1 },
            },
        ]);

        // Calculate summary
        const totalSales = salesReport.reduce(
            (sum, order) => sum + order.total,
            0
        );
        const totalVat = salesReport.reduce((sum, order) => sum + order.vat, 0);
        const totalOrders = salesReport.length;

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    report: salesReport,
                    summary: {
                        totalOrders,
                        totalSales,
                        totalVat,
                        averageOrderValue: totalOrders
                            ? totalSales / totalOrders
                            : 0,
                    },
                    period: { start, end },
                },
                "Sales report generated successfully"
            )
        );
    } catch (error) {
        return next(new ApiError(500, error.message));
    }
});

// Top selling products
export const getTopSellingProducts = asyncHandler(async (req, res, next) => {
    const { limit = 10 } = req.query;

    try {
        const topProducts = await OrderDetail.aggregate([
            {
                $group: {
                    _id: "$product_id",
                    totalSold: { $sum: "$quantity" },
                    totalRevenue: { $sum: "$total" },
                },
            },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "product",
                },
            },
            {
                $unwind: "$product",
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "product.category_id",
                    foreignField: "_id",
                    as: "category",
                },
            },
            {
                $unwind: "$category",
            },
            {
                $project: {
                    product_name: "$product.product_name",
                    product_code: "$product.product_code",
                    category: "$category.category_name",
                    totalSold: 1,
                    totalRevenue: 1,
                    averagePrice: { $divide: ["$totalRevenue", "$totalSold"] },
                },
            },
            {
                $sort: { totalSold: -1 },
            },
            {
                $limit: parseInt(limit),
            },
        ]);

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    topProducts,
                    "Top selling products report generated successfully"
                )
            );
    } catch (error) {
        return next(new ApiError(500, error.message));
    }
});
