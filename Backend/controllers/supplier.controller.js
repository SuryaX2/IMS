import { Supplier } from "../models/supplier.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

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
            createdBy: req.user._id,
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
            const photo = await uploadToCloudinary(req.file);

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
            createdBy: req.user._id, // Associate supplier with the current user
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

const getUserSuppliers = asyncHandler(async (req, res, next) => {
    try {
        const suppliers = await Supplier.getSuppliersByUserId(req.user._id);

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    suppliers,
                    "User suppliers fetched successfully"
                )
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
                    "All suppliers fetched successfully"
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
        // Check if the supplier exists and belongs to the user
        const existingSupplier = await Supplier.findById(id);

        if (!existingSupplier) {
            return next(new ApiError(404, "Supplier not found"));
        }

        // Check if user owns this supplier or is admin
        if (
            existingSupplier.createdBy.toString() !== req.user._id.toString() &&
            req.user.role !== "admin"
        ) {
            return next(
                new ApiError(
                    403,
                    "You don't have permission to update this supplier"
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

        const supplier = await Supplier.findByIdAndUpdate(id, updateData, {
            new: true,
        });

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
        // Check if the supplier exists and belongs to the user
        const existingSupplier = await Supplier.findById(id);

        if (!existingSupplier) {
            return next(new ApiError(404, "Supplier not found"));
        }

        // Check if user owns this supplier or is admin
        if (
            existingSupplier.createdBy.toString() !== req.user._id.toString() &&
            req.user.role !== "admin"
        ) {
            return next(
                new ApiError(
                    403,
                    "You don't have permission to delete this supplier"
                )
            );
        }

        await Supplier.findByIdAndDelete(id);

        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Supplier deleted successfully"));
    } catch (error) {
        return next(new ApiError(500, error.message));
    }
});

export {
    createSupplier,
    getUserSuppliers,
    getAllSuppliers,
    updateSupplier,
    deleteSupplier,
};
