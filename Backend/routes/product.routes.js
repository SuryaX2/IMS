import { Router } from "express";
import {
    createProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
    getAllProductsAdmin,
} from "../controllers/product.controller.js";
import { bulkUploadProducts } from "../controllers/product.bulk.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";
import { upload, csvUpload } from "../middleware/multer.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/bulk-upload").post(csvUpload.single("file"), bulkUploadProducts);

router
    .route("/")
    .post(upload.single("product_image"), createProduct)
    .get(getAllProducts);

router
    .route("/:id")
    .patch(upload.single("product_image"), updateProduct)
    .delete(deleteProduct);

// Admin route
router.route("/all").get(isAdmin, getAllProductsAdmin);

export default router;
