import mongoose from "mongoose";

const supplierSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
            maxlength: 15,
        },
        address: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },
        shopname: {
            type: String,
            trim: true,
            maxlength: 50,
        },
        type: {
            type: String,
            trim: true,
            maxlength: 15,
        },
        bank_name: {
            type: String,
            trim: true,
            maxlength: 50,
        },
        account_holder: {
            type: String,
            trim: true,
            maxlength: 50,
        },
        account_number: {
            type: String,
            trim: true,
            maxlength: 50,
        },
        photo: {
            type: String,
            default: "default-supplier.png",
        },
    },
    { timestamps: true }
);

// CRUD methods
supplierSchema.statics.createSupplier = async function (supplierData) {
    try {
        const supplier = await this.create(supplierData);
        return supplier;
    } catch (error) {
        throw new Error(error.message);
    }
};

supplierSchema.statics.getAllSuppliers = async function () {
    try {
        const suppliers = await this.find({});
        return suppliers;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const Supplier = mongoose.model("Supplier", supplierSchema);
