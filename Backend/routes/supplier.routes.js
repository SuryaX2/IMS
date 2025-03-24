import { Router } from "express";
import {
    createSupplier,
    getUserSuppliers,
    getAllSuppliers,
    updateSupplier,
    deleteSupplier,
} from "../controllers/supplier.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

// Regular user routes
router
    .route("/")
    .post(upload.single("photo"), createSupplier)
    .get(getUserSuppliers);

router
    .route("/:id")
    .patch(upload.single("photo"), updateSupplier)
    .delete(deleteSupplier);

// Admin only routes
router.route("/all").get(isAdmin, getAllSuppliers);

export default router;
