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
        const existingCategory = await Category.findOne({ category_name });
        if (existingCategory) {
            return next(new ApiError(409, "Category already exists"));
        }

        const category = await Category.createCategory({ category_name });

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
                    "Categories fetched successfully"
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
        const category = await Category.findByIdAndUpdate(
            id,
            { category_name },
            { new: true }
        );

        if (!category) {
            return next(new ApiError(404, "Category not found"));
        }

        return res
            .status(200)
            .json(
                new ApiResponse(200, category, "Category updated successfully")
            );
    } catch (error) {
        return next(new ApiError(500, error.message));
    }
});

const deleteCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    try {
        const category = await Category.findByIdAndDelete(id);

        if (!category) {
            return next(new ApiError(404, "Category not found"));
        }

        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Category deleted successfully"));
    } catch (error) {
        return next(new ApiError(500, error.message));
    }
});

export { createCategory, getAllCategories, updateCategory, deleteCategory };
