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
    const { threshold = 10, sendEmail = false } = req.query;
    const userId = req.user._id;
    const isAdmin = req.user.role === "admin";

    // Base user filter
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

        // Send email notifications if requested
        if (sendEmail === "true" && lowStockProducts.length > 0) {
            // Get user email
            const user = await User.findById(userId).select("username email");

            if (user && user.email) {
                const productsTable = lowStockProducts
                    .map((product, index) => {
                        // Determine row color based on even/odd index
                        const backgroundColor =
                            index % 2 === 0 ? "#ffffff" : "#f8fafc";
                        return `
                            <tr style="background-color: ${backgroundColor};">
                                <td style="padding: 14px 16px; color: #1e293b; font-weight: 600; font-size: 15px;">${product.product_name}</td>
                                <td style="padding: 14px 16px; color: #475569; font-family: monospace;">${product.product_code}</td>
                                <td style="padding: 14px 16px;">
                                    <span style="background-color: #fee2e2; color: #b91c1c; font-weight: 700; padding: 4px 10px; border-radius: 9999px; font-size: 14px;">
                                        ${product.stock}
                                    </span>
                                </td>
                                <td style="padding: 14px 16px; color: #475569;">${product.category_id?.category_name || "N/A"}</td>
                            </tr>
                        `;
                    })
                    .join("");

                const mailOptions = {
                    from: `Inventory System <${process.env.SENDER_EMAIL}>`,
                    to: user.email,
                    subject: "Low Stock Alert - Action Required",
                    html: `
                    <!DOCTYPE html>
                    <html lang="en">

                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Low Stock Alert</title>
                    </head>

                    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f8fa;">

                        <span style="display:none;font-size:1px;color:#333333;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
                            Heads up! Some of your products are running low on stock.
                        </span>

                        <div style="max-width: 640px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
                            <div style="padding: 32px;">
                                <h1 style="font-size: 28px; font-weight: 800; color: #111827; margin: 0 0 4px 0;">
                                    ⚠️ Low Stock Alert
                                </h1>
                                <p style="font-size: 16px; color: #4b5563; margin: 0 0 24px 0;">
                                    Immediate attention required for the items below.
                                </p>

                                <p style="font-size: 16px; color: #374151; line-height: 1.6; margin-bottom: 24px;">
                                    Hello <strong>${user.username}</strong>, the following products have fallen below the stock threshold:
                                </p>

                                <div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                                    <table style="width: 100%; border-collapse: collapse; text-align: left;">
                                        <thead>
                                            <tr style="background-color: #f9fafb;">
                                                <th style="padding: 12px 16px; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Product</th>
                                                <th style="padding: 12px 16px; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Code</th>
                                                <th style="padding: 12px 16px; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Stock Left</th>
                                                <th style="padding: 12px 16px; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Category</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${productsTable}
                                        </tbody>
                                    </table>
                                </div>

                                <p style="font-size: 16px; color: #374151; line-height: 1.6;">
                                    Timely restocking will prevent any potential sales disruptions.
                                </p>
                                <p style="text-align: center; margin: 32px 0;">

                                    <a href="${process.env.FRONTEND_URL}/products" target="_blank" style="display: inline-block; padding: 14px 32px; font-size: 16px; font-weight: 600; color: #ffffff; background-color: #3b82f6; border-radius: 8px; text-decoration: none; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                        Restock Items Now
                                    </a>
                                </p>
                            </div>

                            <div style="padding: 24px; background-color: #f8fafc; border-top: 1px solid #e5e7eb; text-align: center;">
                                <p style="font-size: 12px; color: #9ca3af; margin: 16px 0 0 0;">
                                    &copy; ${new Date().getFullYear()} InventoryPro. All Rights Reserved.
                                </p>
                            </div>
                        </div>
                    </body>

                    </html>
                `,
                };

                await transporter.sendMail(mailOptions);
            }
        }

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    lowStockProducts,
                    emailSent:
                        sendEmail === "true" && lowStockProducts.length > 0,
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
