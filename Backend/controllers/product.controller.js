import { Product } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createProduct = asyncHandler(async (req, res, next) => {
    const {
        product_name,
        product_code,
        category_id,
        unit_id,
        buying_price,
        selling_price,
    } = req.body;

    if (
        !product_name ||
        !product_code ||
        !category_id ||
        !unit_id ||
        !buying_price ||
        !selling_price
    ) {
        return next(new ApiError(400, "All product details are required"));
    }

    try {
        const existingProduct = await Product.findOne({ product_code });
        if (existingProduct) {
            return next(
                new ApiError(409, "Product with this code already exists")
            );
        }

        let productImageUrl = "default-product.png";
        if (req.file) {
            const imageLocalPath = req.file.path;

            if (!imageLocalPath) {
                return next(new ApiError(400, "Photo is required"));
            }

            const image = await uploadOnCloudinary(imageLocalPath);

            if (image) {
                productImageUrl = image.url;
            }
        }

        const productData = {
            product_name,
            product_code,
            category_id,
            unit_id,
            buying_price,
            selling_price,
            product_image: productImageUrl,
            stock: 0, // Initial stock set to 0
        };

        const product = await Product.createProduct(productData);

        if (!product) {
            return next(new ApiError(500, "Failed to create product"));
        }

        return res
            .status(201)
            .json(
                new ApiResponse(201, product, "Product created successfully")
            );
    } catch (error) {
        return next(new ApiError(500, error.message));
    }
});

const getAllProducts = asyncHandler(async (req, res, next) => {
    try {
        const products = await Product.getAllProducts();

        return res
            .status(200)
            .json(
                new ApiResponse(200, products, "Products fetched successfully")
            );
    } catch (error) {
        return next(new ApiError(500, error.message));
    }
});

const updateProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        // If product image is being updated
        if (req.file) {
            const imageLocalPath = req.file.path;
            const image = await uploadOnCloudinary(imageLocalPath);

            if (image) {
                updateData.product_image = image.url;
            }
        }

        const product = await Product.findByIdAndUpdate(id, updateData, {
            new: true,
        });

        if (!product) {
            return next(new ApiError(404, "Product not found"));
        }

        return res
            .status(200)
            .json(
                new ApiResponse(200, product, "Product updated successfully")
            );
    } catch (error) {
        return next(new ApiError(500, error.message));
    }
});

const deleteProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    try {
        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return next(new ApiError(404, "Product not found"));
        }

        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Product deleted successfully"));
    } catch (error) {
        return next(new ApiError(500, error.message));
    }
});

export { createProduct, getAllProducts, updateProduct, deleteProduct };
