import { Router } from "express";
import {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,
} from "../controllers/category.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// Secure all category routes with JWT verification
router
    .route("/")
    .post(verifyJWT, createCategory)
    .get(verifyJWT, getAllCategories);

router
    .route("/:id")
    .patch(verifyJWT, updateCategory)
    .delete(verifyJWT, deleteCategory);

export default router;
