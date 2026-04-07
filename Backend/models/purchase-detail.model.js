import mongoose from "mongoose";
import { Product } from "./product.model.js";

const purchaseDetailSchema = mongoose.Schema(
    {
        purchase_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Purchase",
            required: true,
        },
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        unitcost: {
            type: Number,
            required: true,
        },
        total: {
            type: Number,
            required: true,
        },
        return_processed: {
            type: Boolean,
            default: false,
        },
        return_date: {
            type: Date,
        },
        returned_quantity: {
            type: Number,
            default: 0,
        },
        refund_amount: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

purchaseDetailSchema.statics.bulkCreateDetails = async function (
    details,
    session
) {
    const prepared = details.map((d) => ({
        purchase_id: d.purchase_id,
        product_id: d.product_id,
        quantity: d.quantity,
        unitcost: d.unitcost,
        total: d.quantity * d.unitcost,
    }));

    return this.insertMany(prepared, session ? { session } : {});
};

purchaseDetailSchema.statics.getDetailsByPurchaseId = async function (
    purchaseId
) {
    return this.find({ purchase_id: purchaseId }).populate(
        "product_id",
        "product_name product_code stock"
    );
};

purchaseDetailSchema.statics.getReturnDetailsByPurchaseId = async function (
    purchaseId
) {
    return this.find({
        purchase_id: purchaseId,
        return_processed: true,
    }).populate("product_id", "product_name product_code");
};

purchaseDetailSchema.statics.processAllReturns = async function (
    purchaseId,
    session
) {
    const details = await this.find({ purchase_id: purchaseId }).populate(
        "product_id",
        "product_name stock"
    );

    const returnResults = [];
    let totalRefundAmount = 0;

    for (const detail of details) {
        if (detail.return_processed) {
            returnResults.push({
                product_id: detail.product_id._id,
                purchased_quantity: detail.quantity,
                returned_quantity: detail.returned_quantity,
                refund_amount: detail.refund_amount,
                fully_returned: detail.returned_quantity === detail.quantity,
                skipped: true,
            });
            totalRefundAmount += detail.refund_amount;
            continue;
        }

        const product = detail.product_id;
        const returnableQuantity = Math.min(detail.quantity, product.stock);

        if (returnableQuantity > 0) {
            await Product.findOneAndUpdate(
                { _id: product._id },
                { $inc: { stock: -returnableQuantity } },
                { new: true, session }
            );
        }

        const refundAmount = returnableQuantity * detail.unitcost;
        totalRefundAmount += refundAmount;

        await this.findByIdAndUpdate(
            detail._id,
            {
                return_processed: true,
                return_date: new Date(),
                returned_quantity: returnableQuantity,
                refund_amount: refundAmount,
            },
            { session }
        );

        returnResults.push({
            product_id: product._id,
            purchased_quantity: detail.quantity,
            returned_quantity: returnableQuantity,
            refund_amount: refundAmount,
            fully_returned: returnableQuantity === detail.quantity,
        });
    }

    return {
        total_refund_amount: totalRefundAmount,
        return_details: returnResults,
        return_summary: {
            total_items_processed: returnResults.length,
            fully_returned_items: returnResults.filter((i) => i.fully_returned)
                .length,
            partially_returned_items: returnResults.filter(
                (i) => !i.fully_returned
            ).length,
        },
    };
};

export const PurchaseDetail = mongoose.model(
    "PurchaseDetail",
    purchaseDetailSchema
);
