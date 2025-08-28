import { Product } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

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
        // Check if product code already exists for this user
        const existingProduct = await Product.findOne({
            product_code,
            created_by: req.user._id,
        });

        if (existingProduct) {
            return next(
                new ApiError(409, "Product with this code already exists")
            );
        }

        let productImageUrl = "default-product.png";
        if (req.file) {
            const image = await uploadToCloudinary(req.file);

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
            created_by: req.user._id, // Set the current user as creator
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
    const { search, category, min_stock, max_stock, sort_by, sort_order } =
        req.query;

    // Build filter object - start with filtering by user unless admin
    let filter = {};

    // If not admin, only show products created by this user
    if (req.user.role !== "admin") {
        filter.created_by = req.user._id;
    }

    if (search) {
        filter.$or = [
            { product_name: { $regex: search, $options: "i" } },
            { product_code: { $regex: search, $options: "i" } },
        ];
    }

    if (category) {
        filter.category_id = category;
    }

    // Stock range filter
    if (min_stock || max_stock) {
        filter.stock = {};
        if (min_stock) filter.stock.$gte = parseInt(min_stock);
        if (max_stock) filter.stock.$lte = parseInt(max_stock);
    }

    // Build sort options
    let sortOptions = {};
    if (sort_by) {
        sortOptions[sort_by] = sort_order === "desc" ? -1 : 1;
    } else {
        sortOptions = { createdAt: -1 };
    }

    try {
        const products = await Product.find(filter)
            .populate("category_id", "category_name")
            .populate("unit_id", "unit_name")
            .populate("created_by", "username") // Add user info
            .sort(sortOptions);

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
        // Find the product first to check ownership
        const existingProduct = await Product.findById(id);

        if (!existingProduct) {
            return next(new ApiError(404, "Product not found"));
        }

        // Check if user owns this product or is admin
        if (
            req.user.role !== "admin" &&
            existingProduct.created_by.toString() !== req.user._id.toString()
        ) {
            return next(
                new ApiError(
                    403,
                    "You don't have permission to update this product"
                )
            );
        }

        // If product image is being updated
        if (req.file) {
            const image = await uploadToCloudinary(req.file);

            if (image) {
                updateData.product_image = image.url;
            }
        }

        // Add updated_by field
        updateData.updated_by = req.user._id;

        const product = await Product.findByIdAndUpdate(id, updateData, {
            new: true,
        });

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
        // Find the product first to check ownership
        const existingProduct = await Product.findById(id);

        if (!existingProduct) {
            return next(new ApiError(404, "Product not found"));
        }

        // Check if user owns this product or is admin
        if (
            req.user.role !== "admin" &&
            existingProduct.created_by.toString() !== req.user._id.toString()
        ) {
            return next(
                new ApiError(
                    403,
                    "You don't have permission to delete this product"
                )
            );
        }

        // Delete the product
        await Product.findByIdAndDelete(id);

        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Product deleted successfully"));
    } catch (error) {
        return next(new ApiError(500, error.message));
    }
});

// New admin-only endpoint to get all products
const getAllProductsAdmin = asyncHandler(async (req, res, next) => {
    try {
        const products = await Product.getProductsWithDetails();

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    products,
                    "All products fetched successfully"
                )
            );
    } catch (error) {
        return next(new ApiError(500, error.message));
    }
});

export {
    createProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
    getAllProductsAdmin,
};
