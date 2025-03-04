// models/product.model.js
import mongoose from "mongoose";
import { Category } from "./category.model";
import { Unit } from "./unit.model";

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

export const Product = mongoose.model("Product", productSchema);
