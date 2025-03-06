// models/product.model.js
import mongoose from "mongoose";
import { Category } from "./category.model.js";
import { Unit } from "./unit.model.js";

const productSchema = mongoose.Schema(
    {
        product_name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50,
        },
        product_code: {
            type: String,
            required: true,
            trim: true,
            maxlength: 5,
        },
        category_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        unit_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Unit",
            required: true,
        },
        buying_price: {
            type: Number,
            required: true,
        },
        selling_price: {
            type: Number,
            required: true,
        },
        stock: {
            type: Number,
            default: 0,
        },
        product_image: {
            type: String,
            required: true,
            default: "default-product.png",
        },
    },
    { timestamps: true }
);

// CRUD methods
productSchema.statics.createProduct = async function (productData) {
    try {
        const product = await this.create(productData);
        return product;
    } catch (error) {
        throw new Error(error.message);
    }
};

productSchema.statics.getAllProducts = async function () {
    try {
        const products = await this.find({})
            .populate("category_id", "category_name")
            .populate("unit_id", "unit_name");
        return products;
    } catch (error) {
        throw new Error(error.message);
    }
};

productSchema.statics.updateStock = async function (
    productId,
    quantity,
    isAddition = true
) {
    try {
        const product = await this.findById(productId);
        if (!product) {
            throw new Error("Product not found");
        }

        if (isAddition) {
            product.stock += quantity;
        } else {
            // Check if there's enough stock before reducing
            if (product.stock < quantity) {
                throw new Error("Not enough stock available");
            }
            product.stock -= quantity;
        }

        await product.save();
        return product;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Get products with categories and units
productSchema.statics.getProductsWithDetails = async function () {
    try {
        const products = await this.aggregate([
            {
                $lookup: {
                    from: "categories",
                    localField: "category_id",
                    foreignField: "_id",
                    as: "category",
                },
            },
            {
                $lookup: {
                    from: "units",
                    localField: "unit_id",
                    foreignField: "_id",
                    as: "unit",
                },
            },
            {
                $unwind: "$category",
            },
            {
                $unwind: "$unit",
            },
            {
                $project: {
                    _id: 1,
                    product_name: 1,
                    product_code: 1,
                    buying_price: 1,
                    selling_price: 1,
                    stock: 1,
                    product_image: 1,
                    category_name: "$category.category_name",
                    unit_name: "$unit.unit_name",
                    createdAt: 1,
                    updatedAt: 1,
                },
            },
        ]);

        return products;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const Product = mongoose.model("Product", productSchema);
