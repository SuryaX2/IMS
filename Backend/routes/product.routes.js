import { Router } from "express";
import {
    createProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
} from "../controllers/product.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
    .route("/")
    .post(upload.single("product_image"), createProduct)
    .get(getAllProducts);

router
    .route("/:id")
    .patch(upload.single("product_image"), updateProduct)
    .delete(deleteProduct);

export default router;
