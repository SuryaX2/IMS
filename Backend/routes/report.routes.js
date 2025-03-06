import express from "express";
import {
    getStockReport,
    getSalesReport,
    getTopSellingProducts,
} from "../controllers/report.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.get("/stock", getStockReport);
router.get("/sales", getSalesReport);
router.get("/top-products", getTopSellingProducts);

export default router;
