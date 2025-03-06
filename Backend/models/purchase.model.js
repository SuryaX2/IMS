import mongoose from "mongoose";
import { Supplier } from "./supplier.model.js";
import { User } from "./user.model.js";

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

// Get purchase with supplier details and purchase items
purchaseSchema.statics.getPurchaseWithDetails = async function (purchaseId) {
    try {
        const purchase = await this.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(purchaseId) },
            },
            {
                $lookup: {
                    from: "suppliers",
                    localField: "supplier_id",
                    foreignField: "_id",
                    as: "supplier",
                },
            },
            {
                $unwind: "$supplier",
            },
            {
                $lookup: {
                    from: "purchasedetails",
                    localField: "_id",
                    foreignField: "purchase_id",
                    as: "purchaseItems",
                },
            },
            {
                $lookup: {
                    from: "products",
                    localField: "purchaseItems.product_id",
                    foreignField: "_id",
                    as: "products",
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "created_by",
                    foreignField: "_id",
                    as: "creator",
                },
            },
            {
                $unwind: "$creator",
            },
            {
                $project: {
                    _id: 1,
                    purchase_no: 1,
                    purchase_date: 1,
                    purchase_status: 1,
                    supplier_name: "$supplier.name",
                    supplier_shopname: "$supplier.shopname",
                    supplier_phone: "$supplier.phone",
                    created_by: "$creator.username",
                    purchaseItems: {
                        $map: {
                            input: "$purchaseItems",
                            as: "item",
                            in: {
                                product_id: "$$item.product_id",
                                quantity: "$$item.quantity",
                                unitcost: "$$item.unitcost",
                                total: "$$item.total",
                                product_name: {
                                    $arrayElemAt: [
                                        "$products.product_name",
                                        {
                                            $indexOfArray: [
                                                "$products._id",
                                                "$$item.product_id",
                                            ],
                                        },
                                    ],
                                },
                            },
                        },
                    },
                    createdAt: 1,
                    updatedAt: 1,
                },
            },
        ]);

        return purchase[0];
    } catch (error) {
        throw new Error(error.message);
    }
};

export const Purchase = mongoose.model("Purchase", purchaseSchema);
