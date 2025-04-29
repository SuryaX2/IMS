import express from "express";
import {
    createOrder,
    generateInvoice,
    getAllOrders,
    getAllOrdersAdmin,
    getOrderDetails,
    updateOrderStatus,
} from "../controllers/order.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

router.use(verifyJWT); // Apply auth middleware to all routes

// User routes - filtered by user ID
router.post("/", createOrder);
router.get("/", getAllOrders);
router.get("/:id/details", getOrderDetails);
router.patch("/:id/status", updateOrderStatus);
router.route("/:id/invoice").get(generateInvoice);

// Admin-only routes
router.get("/all", isAdmin, getAllOrdersAdmin);

export default router;
