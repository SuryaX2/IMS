import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { Purchase } from "../models/purchase.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import transporter from "../utils/nodemailer.js";
import mongoose from "mongoose";

// Get dashboard metrics (total sales, inventory value, low stock)
const getDashboardMetrics = asyncHandler(async (req, res, next) => {
    try {
        const userId = req.user._id;
        const isAdmin = req.user.role === "admin";

        // Base query for filtering by user
        const userFilter = isAdmin ? {} : { created_by: userId };

        // Get total sales (sum of all orders) - Fixed pipeline
        const salesMatchStage = isAdmin
            ? { order_status: { $ne: "cancelled" } }
            : {
                  order_status: { $ne: "cancelled" },
                  created_by: new mongoose.Types.ObjectId(userId),
              };

        const salesData = await Order.aggregate([
            { $match: salesMatchStage },
            { $group: { _id: null, totalSales: { $sum: "$total" } } },
        ]);

        // Get total purchase value - Fixed pipeline
        const purchaseMatchStage = isAdmin
            ? {}
            : { created_by: new mongoose.Types.ObjectId(userId) };

        const purchaseData = await Purchase.aggregate([
            { $match: purchaseMatchStage },
            {
                $lookup: {
                    from: "purchasedetails",
                    localField: "_id",
                    foreignField: "purchase_id",
                    as: "details",
                },
            },
            { $unwind: { path: "$details", preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    _id: null,
                    totalPurchase: { $sum: { $ifNull: ["$details.total", 0] } },
                },
            },
        ]);

        // Get inventory value and count
        const inventoryData = await Product.aggregate([
            { $match: userFilter },
            {
                $group: {
                    _id: null,
                    inventoryValue: {
                        $sum: { $multiply: ["$stock", "$buying_price"] },
                    },
                    totalProducts: { $sum: 1 },
                    totalStock: { $sum: "$stock" },
                },
            },
        ]);

        // Get recent orders (last 5)
        const recentOrders = await Order.find(userFilter)
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("customer_id", "name");

        // Get low stock products (stock < 10)
        const lowStockProducts = await Product.find({
            ...userFilter,
            stock: { $lt: 10 },
        })
            .select("product_name stock")
            .sort({ stock: 1 })
            .limit(10);

        // Get out of stock products
        const outOfStockCount = await Product.countDocuments({
            ...userFilter,
            stock: 0,
        });

        const metrics = {
            totalSales: salesData.length > 0 ? salesData[0].totalSales : 0,
            totalPurchase:
                purchaseData.length > 0 ? purchaseData[0].totalPurchase : 0,
            inventoryValue:
                inventoryData.length > 0 ? inventoryData[0].inventoryValue : 0,
            totalProducts:
                inventoryData.length > 0 ? inventoryData[0].totalProducts : 0,
            totalStock:
                inventoryData.length > 0 ? inventoryData[0].totalStock : 0,
            outOfStockCount,
            lowStockProducts,
            recentOrders,
        };

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    metrics,
                    "Dashboard metrics fetched successfully"
                )
            );
    } catch (error) {
        console.error("Dashboard metrics error:", error);
        return next(new ApiError(500, error.message));
    }
});

// Get stock report
const getStockReport = asyncHandler(async (req, res, next) => {
    try {
        const userId = req.user._id;
        const isAdmin = req.user.role === "admin";

        // Match stage for filtering by user
        const matchStage = isAdmin
            ? {}
            : { created_by: new mongoose.Types.ObjectId(userId) };

        const stockReport = await Product.aggregate([
            { $match: matchStage },
            {
                $lookup: {
                    from: "categories",
                    localField: "category_id",
                    foreignField: "_id",
                    as: "category",
                },
            },
            {
                $lookup: {
                    from: "units",
                    localField: "unit_id",
                    foreignField: "_id",
                    as: "unit",
                },
            },
            {
                $unwind: {
                    path: "$category",
                    preserveNullAndEmptyArrays: true,
                },
            },
            { $unwind: { path: "$unit", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    product_name: 1,
                    product_code: 1,
                    category_name: {
                        $ifNull: ["$category.category_name", "N/A"],
                    },
                    unit_name: { $ifNull: ["$unit.unit_name", "N/A"] },
                    buying_price: 1,
                    selling_price: 1,
                    stock: 1,
                    inventory_value: { $multiply: ["$stock", "$buying_price"] },
                    status: {
                        $cond: {
                            if: { $eq: ["$stock", 0] },
                            then: "Out of Stock",
                            else: {
                                $cond: {
                                    if: { $lt: ["$stock", 10] },
                                    then: "Low Stock",
                                    else: "In Stock",
                                },
                            },
                        },
                    },
                },
            },
            { $sort: { stock: 1 } },
        ]);

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    stockReport,
                    "Stock report fetched successfully"
                )
            );
    } catch (error) {
        console.error("Stock report error:", error);
        return next(new ApiError(500, error.message));
    }
});

// Get sales report
const getSalesReport = asyncHandler(async (req, res, next) => {
    const { start_date, end_date } = req.query;
    const userId = req.user._id;
    const isAdmin = req.user.role === "admin";

    let dateFilter = {};
    if (start_date && end_date) {
        dateFilter = {
            order_date: {
                $gte: new Date(start_date),
                $lte: new Date(end_date),
            },
        };
    }

    // Add user filtering for non-admin users
    if (!isAdmin) {
        dateFilter.created_by = new mongoose.Types.ObjectId(userId);
    }

    try {
        // Get sales by date
        const salesByDate = await Order.aggregate([
            { $match: { ...dateFilter, order_status: { $ne: "cancelled" } } },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$order_date",
                        },
                    },
                    total: { $sum: "$total" },
                    orders: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        // Get sales by product
        const salesByProduct = await Order.aggregate([
            { $match: { ...dateFilter, order_status: { $ne: "cancelled" } } },
            {
                $lookup: {
                    from: "orderdetails",
                    localField: "_id",
                    foreignField: "order_id",
                    as: "details",
                },
            },
            {
                $unwind: {
                    path: "$details",
                    preserveNullAndEmptyArrays: false,
                },
            },
            {
                $lookup: {
                    from: "products",
                    localField: "details.product_id",
                    foreignField: "_id",
                    as: "product",
                },
            },
            {
                $unwind: {
                    path: "$product",
                    preserveNullAndEmptyArrays: false,
                },
            },
            {
                $group: {
                    _id: "$product._id",
                    product_name: { $first: "$product.product_name" },
                    quantity: { $sum: "$details.quantity" },
                    total: { $sum: "$details.total" },
                },
            },
            { $sort: { total: -1 } },
            { $limit: 10 },
        ]);

        const report = {
            salesByDate,
            salesByProduct,
            summary: {
                totalSales: salesByDate.reduce(
                    (sum, item) => sum + item.total,
                    0
                ),
                totalOrders: salesByDate.reduce(
                    (sum, item) => sum + item.orders,
                    0
                ),
            },
        };

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    report,
                    "Sales report fetched successfully"
                )
            );
    } catch (error) {
        console.error("Sales report error:", error);
        return next(new ApiError(500, error.message));
    }
});

// Get top selling products
const getTopProducts = asyncHandler(async (req, res, next) => {
    const { limit = 10 } = req.query;
    const userId = req.user._id;
    const isAdmin = req.user.role === "admin";

    try {
        // Match stage for non-admin users
        const orderMatch = isAdmin
            ? { order_status: { $ne: "cancelled" } }
            : {
                  order_status: { $ne: "cancelled" },
                  created_by: new mongoose.Types.ObjectId(userId),
              };

        const topProducts = await Order.aggregate([
            { $match: orderMatch },
            {
                $lookup: {
                    from: "orderdetails",
                    localField: "_id",
                    foreignField: "order_id",
                    as: "details",
                },
            },
            {
                $unwind: {
                    path: "$details",
                    preserveNullAndEmptyArrays: false,
                },
            },
            {
                $lookup: {
                    from: "products",
                    localField: "details.product_id",
                    foreignField: "_id",
                    as: "product",
                },
            },
            {
                $unwind: {
                    path: "$product",
                    preserveNullAndEmptyArrays: false,
                },
            },
            {
                $group: {
                    _id: "$product._id",
                    product_name: { $first: "$product.product_name" },
                    product_code: { $first: "$product.product_code" },
                    product_image: { $first: "$product.product_image" },
                    quantity_sold: { $sum: "$details.quantity" },
                    total_sales: { $sum: "$details.total" },
                },
            },
            { $sort: { quantity_sold: -1 } },
            { $limit: parseInt(limit) },
        ]);

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    topProducts,
                    "Top products fetched successfully"
                )
            );
    } catch (error) {
        console.error("Top products error:", error);
        return next(new ApiError(500, error.message));
    }
});

// Get purchase report
const getPurchaseReport = asyncHandler(async (req, res, next) => {
    const { start_date, end_date } = req.query;
    const userId = req.user._id;
    const isAdmin = req.user.role === "admin";

    let dateFilter = {};
    if (start_date && end_date) {
        dateFilter = {
            purchase_date: {
                $gte: new Date(start_date),
                $lte: new Date(end_date),
            },
        };
    }

    // Add user filtering for non-admin users
    if (!isAdmin) {
        dateFilter.created_by = new mongoose.Types.ObjectId(userId);
    }

    try {
        // Get purchases by date
        const purchasesByDate = await Purchase.aggregate([
            { $match: dateFilter },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$purchase_date",
                        },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        // Get purchases by supplier
        const purchasesBySupplier = await Purchase.aggregate([
            { $match: dateFilter },
            {
                $lookup: {
                    from: "suppliers",
                    localField: "supplier_id",
                    foreignField: "_id",
                    as: "supplier",
                },
            },
            {
                $unwind: {
                    path: "$supplier",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "purchasedetails",
                    localField: "_id",
                    foreignField: "purchase_id",
                    as: "details",
                },
            },
            { $unwind: { path: "$details", preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    _id: "$supplier._id",
                    supplier_name: {
                        $first: { $ifNull: ["$supplier.name", "Unknown"] },
                    },
                    shopname: {
                        $first: { $ifNull: ["$supplier.shopname", "N/A"] },
                    },
                    total_purchases: {
                        $sum: { $ifNull: ["$details.total", 0] },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { total_purchases: -1 } },
        ]);

        const report = {
            purchasesByDate,
            purchasesBySupplier,
        };

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    report,
                    "Purchase report fetched successfully"
                )
            );
    } catch (error) {
        console.error("Purchase report error:", error);
        return next(new ApiError(500, error.message));
    }
});
// Get low stock alerts and send email notifications
const getLowStockAlerts = asyncHandler(async (req, res, next) => {
    const { threshold = 10 } = req.query;
    const userId = req.user._id;
    const isAdmin = req.user.role === "admin";

    const userFilter = isAdmin ? {} : { created_by: userId };

    try {
        const lowStockProducts = await Product.find({
            ...userFilter,
            stock: { $lt: parseInt(threshold) },
        })
            .select(
                "product_name product_code stock buying_price selling_price"
            )
            .populate("category_id", "category_name")
            .populate("created_by", "username email")
            .sort({ stock: 1 });

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    lowStockProducts,
                    count: lowStockProducts.length,
                    threshold: parseInt(threshold),
                    automaticEmails: {
                        enabled: true,
                        schedule: "Every Monday at 9:00 AM",
                        timezone: process.env.TIMEZONE || "Asia/Kolkata",
                        note: "Low stock email alerts are sent automatically to all users",
                    },
                },
                "Low stock alerts fetched successfully"
            )
        );
    } catch (error) {
        console.error("Low stock alerts error:", error);
        return next(new ApiError(500, error.message));
    }
});

export {
    getDashboardMetrics,
    getStockReport,
    getSalesReport,
    getTopProducts,
    getPurchaseReport,
    getLowStockAlerts,
};
