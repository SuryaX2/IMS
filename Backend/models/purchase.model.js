import mongoose from "mongoose";
import { Supplier } from "./supplier.model";
import { User } from "./user.model";

const purchaseSchema = mongoose.Schema(
    {
        purchase_date: {
            type: Date,
            required: true,
            default: Date.now,
        },
        purchase_no: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            maxlength: 10,
        },
        supplier_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Supplier",
            required: true,
        },
        purchase_status: {
            type: String,
            enum: ["pending", "completed", "returned"],
            default: "pending",
        },
        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        updated_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

// CRUD methods
purchaseSchema.statics.createPurchase = async function (purchaseData) {
    try {
        const purchase = await this.create(purchaseData);
        return purchase;
    } catch (error) {
        throw new Error(error.message);
    }
};

purchaseSchema.statics.getAllPurchases = async function () {
    try {
        const purchases = await this.find({})
            .populate("supplier_id", "name shopname")
            .populate("created_by", "username")
            .sort({ createdAt: -1 });
        return purchases;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const Purchase = mongoose.model("Purchase", purchaseSchema);
