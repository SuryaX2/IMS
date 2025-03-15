import mongoose from "mongoose";

const customerSchema = mongoose.Schema(
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
            trim: true,
            maxlength: 100,
        },
        type: {
            type: String,
            trim: true,
            maxlength: 15,
            default: "regular",
        },
        store_name: {
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
            required: true,
            default: "default-customer.png",
        },
        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

// CRUD methods
customerSchema.statics.createCustomer = async function (customerData) {
    try {
        const customer = await this.create(customerData);
        return customer;
    } catch (error) {
        throw new Error(error.message);
    }
};

customerSchema.statics.getAllCustomers = async function () {
    try {
        const customers = await this.find({});
        return customers;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Get customers by user
customerSchema.statics.getCustomersByUser = async function (userId) {
    try {
        const customers = await this.find({ created_by: userId });
        return customers;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const Customer = mongoose.model("Customer", customerSchema);
