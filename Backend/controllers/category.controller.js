import { Category } from "../models/category.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createCategory = asyncHandler(async (req, res, next) => {
    const { category_name } = req.body;

    if (!category_name) {
        return next(new ApiError(400, "Category name is required"));
    }

    try {
        const existingCategory = await Category.findOne({
            category_name,
            created_by: req.user._id,
        });

        if (existingCategory) {
            return next(new ApiError(409, "Category already exists"));
        }

        const categoryData = {
            category_name,
            created_by: req.user._id,
        };

        const category = await Category.createCategory(categoryData);

        return res
            .status(201)
            .json(
                new ApiResponse(201, category, "Category created successfully")
            );
    } catch (error) {
        return next(new ApiError(500, error.message));
    }
});

const getAllCategories = asyncHandler(async (req, res, next) => {
    try {
        const categories = await Category.getAllCategories();

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    categories,
                    "All categories fetched successfully"
                )
            );
    } catch (error) {
        return next(new ApiError(500, error.message));
    }
});

const getUserCategories = asyncHandler(async (req, res, next) => {
    try {
        const categories = await Category.getCategoriesByUser(req.user._id);

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    categories,
                    "User categories fetched successfully"
                )
            );
    } catch (error) {
        return next(new ApiError(500, error.message));
    }
});

const updateCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { category_name } = req.body;

    if (!category_name) {
        return next(new ApiError(400, "Category name is required"));
    }

    try {
        // Find the category first to check permissions
        const category = await Category.findById(id);

        if (!category) {
            return next(new ApiError(404, "Category not found"));
        }

        // Check if the user is the creator (admin check happens in middleware)
        if (
            !req.user.role === "admin" &&
            !category.created_by.equals(req.user._id)
        ) {
            return next(
                new ApiError(
                    403,
                    "You don't have permission to update this category"
                )
            );
        }

        // Update the category
        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            {
                category_name,
                updated_by: req.user._id,
            },
            { new: true }
        );

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    updatedCategory,
                    "Category updated successfully"
                )
            );
    } catch (error) {
        return next(new ApiError(500, error.message));
    }
});

const deleteCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    try {
        // Find the category first to check permissions
        const category = await Category.findById(id);

        if (!category) {
            return next(new ApiError(404, "Category not found"));
        }

        // Check if the user is the creator (admin check happens in middleware)
        if (
            !req.user.role === "admin" &&
            !category.created_by.equals(req.user._id)
        ) {
            return next(
                new ApiError(
                    403,
                    "You don't have permission to delete this category"
                )
            );
        }

        // Delete the category
        await Category.findByIdAndDelete(id);

        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Category deleted successfully"));
    } catch (error) {
        return next(new ApiError(500, error.message));
    }
});

export {
    createCategory,
    getAllCategories,
    getUserCategories,
    updateCategory,
    deleteCategory,
};
