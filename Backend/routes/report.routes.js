import express from "express";
import {
    getDashboardMetrics,
    getStockReport,
    getSalesReport,
    getTopProducts,
    getPurchaseReport,
    getLowStockAlerts,
    getSalesVsPurchasesReport
} from "../controllers/report.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

// Dashboard metrics
router.route("/dashboard").get(getDashboardMetrics);

// Stock report
router.route("/stock").get(getStockReport);

// Sales report
router.route("/sales").get(getSalesReport);

// Purchase report
router.route("/purchases").get(getPurchaseReport);

// Top products report
router.route("/top-products").get(getTopProducts);

// Low stock alerts with optional email notification
router.route("/low-stock-alerts").get(getLowStockAlerts);

// New endpoint: Sales vs Purchases comparison
router.route("/sales-vs-purchases").get(getSalesVsPurchasesReport);

// Admin-only routes - could be added if needed
// router.route("/admin/all-users-sales").get(isAdmin, getAllUsersSalesReport);

export default router;