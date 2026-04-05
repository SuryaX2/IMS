import mongoose from "mongoose";

const orderDetailSchema = mongoose.Schema(
    {
        order_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
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
    },
    { timestamps: true }
);

orderDetailSchema.statics.bulkCreateDetails = async function (
    details,
    session
) {
    const prepared = details.map((d) => ({
        order_id: d.order_id,
        product_id: d.product_id,
        quantity: d.quantity,
        unitcost: d.unitcost,
        total: d.quantity * d.unitcost,
    }));

    return this.insertMany(prepared, session ? { session } : {});
};

orderDetailSchema.statics.getDetailsByOrderId = async function (orderId) {
    return this.find({ order_id: orderId }).populate(
        "product_id",
        "product_name product_code"
    );
};

export const OrderDetail = mongoose.model("OrderDetail", orderDetailSchema);
