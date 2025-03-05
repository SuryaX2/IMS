import { Router } from "express";
import {
    createSupplier,
    getAllSuppliers,
    updateSupplier,
    deleteSupplier,
} from "../controllers/supplier.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
    .route("/")
    .post(upload.single("photo"), createSupplier)
    .get(getAllSuppliers);

router
    .route("/:id")
    .patch(upload.single("photo"), updateSupplier)
    .delete(deleteSupplier);

export default router;
