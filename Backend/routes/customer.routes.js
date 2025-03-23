import { Router } from "express";
import {
    createCustomer,
    getAllCustomers,
    getUserCustomers,
    updateCustomer,
    deleteCustomer,
} from "../controllers/customer.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

// Regular user routes - only for their own customers
router
    .route("/")
    .post(upload.single("photo"), createCustomer)
    .get(getUserCustomers);

router
    .route("/:id")
    .patch(upload.single("photo"), updateCustomer)
    .delete(deleteCustomer);

// Admin routes - can access all customers
router.route("/all").get(isAdmin, getAllCustomers);

export default router;
