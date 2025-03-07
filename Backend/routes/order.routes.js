import express from "express";
import {
    createOrder,
    generateInvoice,
    getAllOrders,
    getOrderDetails,
    updateOrderStatus,
} from "../controllers/order.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(verifyJWT); // Apply auth middleware to all routes

router.post("/", createOrder);
router.get("/", getAllOrders);
router.get("/:id/details", getOrderDetails);
router.patch("/:id/status", updateOrderStatus);
router.route("/:id/invoice").get(generateInvoice);

export default router;
