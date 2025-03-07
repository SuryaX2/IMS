import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { Purchase } from "../models/purchase.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Get dashboard metrics (total sales, inventory value, low stock)
const getDashboardMetrics = asyncHandler(async (req, res, next) => {
    try {
        // Get total sales (sum of all orders)
        const salesData = await Order.aggregate([
            { $match: { order_status: { $ne: "cancelled" } } },
            { $group: { _id: null, totalSales: { $sum: "$total" } } },
        ]);

        // Get total purchase value
        const purchaseData = await Purchase.aggregate([
            {
                $lookup: {
                    from: "purchasedetails",
                    localField: "_id",
                    foreignField: "purchase_id",
                    as: "details",
                },
            },
            { $unwind: "$details" },
            {
                $group: {
                    _id: null,
                    totalPurchase: { $sum: "$details.total" },
                },
            },
        ]);

        // Get inventory value and count
        const inventoryData = await Product.aggregate([
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
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("customer_id", "name");

        // Get low stock products (stock < 10)
        const lowStockProducts = await Product.find({ stock: { $lt: 10 } })
            .select("product_name stock")
            .sort({ stock: 1 })
            .limit(10);

        // Get out of stock products
        const outOfStockCount = await Product.countDocuments({ stock: 0 });

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
        return next(new ApiError(500, error.message));
    }
});

// Get stock report
const getStockReport = asyncHandler(async (req, res, next) => {
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
                $lookup: {
                    from: "units",
                    localField: "unit_id",
                    foreignField: "_id",
                    as: "unit",
                },
            },
            { $unwind: "$category" },
            { $unwind: "$unit" },
            {
                $project: {
                    product_name: 1,
                    product_code: 1,
                    category_name: "$category.category_name",
                    unit_name: "$unit.unit_name",
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
        return next(new ApiError(500, error.message));
    }
});

// Get sales report
const getSalesReport = asyncHandler(async (req, res, next) => {
    const { start_date, end_date } = req.query;

    let dateFilter = {};
    if (start_date && end_date) {
        dateFilter = {
            order_date: {
                $gte: new Date(start_date),
                $lte: new Date(end_date),
            },
        };
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
            { $unwind: "$details" },
            {
                $lookup: {
                    from: "products",
                    localField: "details.product_id",
                    foreignField: "_id",
                    as: "product",
                },
            },
            { $unwind: "$product" },
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
        return next(new ApiError(500, error.message));
    }
});

// Get top selling products
const getTopProducts = asyncHandler(async (req, res, next) => {
    const { limit = 10 } = req.query;

    try {
        const topProducts = await Order.aggregate([
            { $match: { order_status: { $ne: "cancelled" } } },
            {
                $lookup: {
                    from: "orderdetails",
                    localField: "_id",
                    foreignField: "order_id",
                    as: "details",
                },
            },
            { $unwind: "$details" },
            {
                $lookup: {
                    from: "products",
                    localField: "details.product_id",
                    foreignField: "_id",
                    as: "product",
                },
            },
            { $unwind: "$product" },
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
        return next(new ApiError(500, error.message));
    }
});

// Get purchase report
const getPurchaseReport = asyncHandler(async (req, res, next) => {
    const { start_date, end_date } = req.query;

    let dateFilter = {};
    if (start_date && end_date) {
        dateFilter = {
            purchase_date: {
                $gte: new Date(start_date),
                $lte: new Date(end_date),
            },
        };
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
            { $unwind: "$supplier" },
            {
                $lookup: {
                    from: "purchasedetails",
                    localField: "_id",
                    foreignField: "purchase_id",
                    as: "details",
                },
            },
            { $unwind: "$details" },
            {
                $group: {
                    _id: "$supplier._id",
                    supplier_name: { $first: "$supplier.name" },
                    shopname: { $first: "$supplier.shopname" },
                    total_purchases: { $sum: "$details.total" },
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
        return next(new ApiError(500, error.message));
    }
});

// Get low stock alerts
const getLowStockAlerts = asyncHandler(async (req, res, next) => {
    const { threshold = 10 } = req.query;

    try {
        const lowStockProducts = await Product.find({
            stock: { $lt: parseInt(threshold) },
        })
            .select(
                "product_name product_code stock buying_price selling_price"
            )
            .populate("category_id", "category_name")
            .sort({ stock: 1 });

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    lowStockProducts,
                    "Low stock alerts fetched successfully"
                )
            );
    } catch (error) {
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
