import { Supplier } from "../models/supplier.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createSupplier = asyncHandler(async (req, res, next) => {
    const {
        name,
        email,
        phone,
        address,
        shopname,
        type,
        bank_name,
        account_holder,
        account_number,
    } = req.body;

    if (!name || !email || !phone || !address) {
        return next(
            new ApiError(400, "Name, email, phone, and address are required")
        );
    }

    try {
        const existingSupplier = await Supplier.findOne({
            $or: [{ email }, { phone }],
        });

        if (existingSupplier) {
            return next(
                new ApiError(
                    409,
                    "Supplier with this email or phone already exists"
                )
            );
        }

        // Handle photo upload
        let photoUrl = "default-supplier.png";
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

        const supplierData = {
            name,
            email,
            phone,
            address,
            shopname,
            type,
            bank_name,
            account_holder,
            account_number,
            photo: photoUrl,
        };

        const supplier = await Supplier.createSupplier(supplierData);

        return res
            .status(201)
            .json(
                new ApiResponse(201, supplier, "Supplier created successfully")
            );
    } catch (error) {
        return next(new ApiError(500, error.message));
    }
});

const getAllSuppliers = asyncHandler(async (req, res, next) => {
    try {
        const suppliers = await Supplier.getAllSuppliers();

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    suppliers,
                    "Suppliers fetched successfully"
                )
            );
    } catch (error) {
        return next(new ApiError(500, error.message));
    }
});

const updateSupplier = asyncHandler(async (req, res, next) => {
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

        const supplier = await Supplier.findByIdAndUpdate(id, updateData, {
            new: true,
        });

        if (!supplier) {
            return next(new ApiError(404, "Supplier not found"));
        }

        return res
            .status(200)
            .json(
                new ApiResponse(200, supplier, "Supplier updated successfully")
            );
    } catch (error) {
        return next(new ApiError(500, error.message));
    }
});

const deleteSupplier = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    try {
        const supplier = await Supplier.findByIdAndDelete(id);

        if (!supplier) {
            return next(new ApiError(404, "Supplier not found"));
        }

        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Supplier deleted successfully"));
    } catch (error) {
        return next(new ApiError(500, error.message));
    }
});

export { createSupplier, getAllSuppliers, updateSupplier, deleteSupplier };
