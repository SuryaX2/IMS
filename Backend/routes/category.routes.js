import { Router } from "express";
import {
    createCategory,
    getAllCategories,
    getUserCategories,
    updateCategory,
    deleteCategory,
} from "../controllers/category.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

// Route for all users to get their own categories and create new ones
router.route("/").post(createCategory);
router.route("/user").get(getUserCategories);

// Route for all users to update/delete their own categories
// The controller will check if the user owns the category
router.route("/user/:id").patch(updateCategory).delete(deleteCategory);

// Admin-only routes
router.use(isAdmin); // Apply isAdmin middleware to all routes below
router.route("/admin/all").get(getAllCategories); // Admin can get all categories
router.route("/admin/:id").patch(updateCategory).delete(deleteCategory); // Admin can update/delete any category

export default router;
