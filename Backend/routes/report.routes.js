import express from "express";
import {
    getDashboardMetrics,
    getStockReport,
    getSalesReport,
    getTopProducts,
    getPurchaseReport,
} from "../controllers/report.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

// Dashboard metrics
router.route("/dashboard").get(getDashboardMetrics);

router.route("/stock").get(getStockReport);
router.route("/sales").get(getSalesReport);
router.route("/purchases").get(getPurchaseReport);
router.route("/top-products").get(getTopProducts);

export default router;
