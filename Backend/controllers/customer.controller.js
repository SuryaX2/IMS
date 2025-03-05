import { Customer } from "../models/customer.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

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
        });

        if (existingCustomer) {
            return next(
                new ApiError(
                    409,
                    "Customer with this email or phone already exists"
                )
            );
        }

        // Handle photo upload
        let photoUrl = "default-customer.png";
        if (req.file) {
            const photoLocalPath = req.file.path;

            if (!photoLocalPath) {
                return next(new ApiError(400, "Photo is required"));
            }

            const photo = await uploadOnCloudinary(photoLocalPath);

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

const getAllCustomers = asyncHandler(async (req, res, next) => {
    try {
        const customers = await Customer.getAllCustomers();

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    customers,
                    "Customers fetched successfully"
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
        // If photo is being updated
        if (req.file) {
            const photoLocalPath = req.file.path;
            const photo = await uploadOnCloudinary(photoLocalPath);

            if (photo) {
                updateData.photo = photo.url;
            }
        }

        const customer = await Customer.findByIdAndUpdate(id, updateData, {
            new: true,
        });

        if (!customer) {
            return next(new ApiError(404, "Customer not found"));
        }

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
        const customer = await Customer.findByIdAndDelete(id);

        if (!customer) {
            return next(new ApiError(404, "Customer not found"));
        }

        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Customer deleted successfully"));
    } catch (error) {
        return next(new ApiError(500, error.message));
    }
});

export { createCustomer, getAllCustomers, updateCustomer, deleteCustomer };
