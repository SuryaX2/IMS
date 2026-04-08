import { Router } from "express";
import {
    createCategory,
    getAllCategories,
    getUserCategories,
    getAvailableCategories,
    updateCategory,
    deleteCategory,
} from "../controllers/category.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/available").get(getAvailableCategories);

router.route("/").post(createCategory);
router.route("/user").get(getUserCategories);
router.route("/user/:id").patch(updateCategory).delete(deleteCategory);

// Admin-only routes
router.use(isAdmin);
router.route("/admin/all").get(getAllCategories);
router.route("/admin/:id").patch(updateCategory).delete(deleteCategory);

export default router;
