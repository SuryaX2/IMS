// customer.controller.js
import { Customer } from "../models/customer.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

const createCustomer = asyncHandler(async (req, res, next) => {
    const {
        name,
        email,
        phone,
        address,
        type,
        store_name,
        account_holder,
        account_number,
    } = req.body;

    if (!name || !email || !phone) {
        return next(new ApiError(400, "Name, email, and phone are required"));
    }

    try {
        const existingCustomer = await Customer.findOne({
            $or: [{ email }, { phone }],
            created_by: req.user._id, // Check only within user's customers
        });

        if (existingCustomer) {
            return next(
                new ApiError(
                    409,
                    "Customer with this email or phone already exists"
                )
            );
        }

        let photoUrl = "default-customer.png";
        if (req.file) {
            const photo = await uploadToCloudinary(req.file);

            if (photo) {
                photoUrl = photo.url;
            }
        }

        const customerData = {
            name,
            email,
            phone,
            address,
            type,
            store_name,
            account_holder,
            account_number,
            photo: photoUrl,
            created_by: req.user._id, // Set the current user as creator
        };

        const customer = await Customer.createCustomer(customerData);

        if (!customer) {
            return next(new ApiError(500, "Failed to create customer"));
        }

        return res
            .status(201)
            .json(
                new ApiResponse(201, customer, "Customer created successfully")
            );
    } catch (error) {
        return next(new ApiError(500, error.message));
    }
});

// Get all customers (admin only)
const getAllCustomers = asyncHandler(async (req, res, next) => {
    try {
        const customers = await Customer.getAllCustomers();

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    customers,
                    "All customers fetched successfully"
                )
            );
    } catch (error) {
        return next(new ApiError(500, error.message));
    }
});

// Get current user's customers
const getUserCustomers = asyncHandler(async (req, res, next) => {
    try {
        const customers = await Customer.getCustomersByUser(req.user._id);

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    customers,
                    "Your customers fetched successfully"
                )
            );
    } catch (error) {
        return next(new ApiError(500, error.message));
    }
});

const updateCustomer = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        // Check if the customer exists
        const existingCustomer = await Customer.findById(id);

        if (!existingCustomer) {
            return next(new ApiError(404, "Customer not found"));
        }

        // Only allow if admin or the creator of the customer
        if (
            req.user.role !== "admin" &&
            existingCustomer.created_by.toString() !== req.user._id.toString()
        ) {
            return next(
                new ApiError(
                    403,
                    "You don't have permission to update this customer"
                )
            );
        }

        // If photo is being updated
        if (req.file) {
            const photo = await uploadToCloudinary(req.file);

            if (photo) {
                updateData.photo = photo.url;
            }
        }

        const customer = await Customer.findByIdAndUpdate(id, updateData, {
            new: true,
        });

        return res
            .status(200)
            .json(
                new ApiResponse(200, customer, "Customer updated successfully")
            );
    } catch (error) {
        return next(new ApiError(500, error.message));
    }
});

const deleteCustomer = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    try {
        // Check if the customer exists
        const existingCustomer = await Customer.findById(id);

        if (!existingCustomer) {
            return next(new ApiError(404, "Customer not found"));
        }

        // Only allow if admin or the creator of the customer
        if (
            req.user.role !== "admin" &&
            existingCustomer.created_by.toString() !== req.user._id.toString()
        ) {
            return next(
                new ApiError(
                    403,
                    "You don't have permission to delete this customer"
                )
            );
        }

        const customer = await Customer.findByIdAndDelete(id);

        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Customer deleted successfully"));
    } catch (error) {
        return next(new ApiError(500, error.message));
    }
});

export {
    createCustomer,
    getAllCustomers,
    getUserCustomers,
    updateCustomer,
    deleteCustomer,
};
