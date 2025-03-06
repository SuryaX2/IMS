import { Unit } from "../models/unit.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createUnit = asyncHandler(async (req, res, next) => {
    const { unit_name } = req.body;

    if (!unit_name) {
        return next(new ApiError(400, "Unit name is required"));
    }

    try {
        const existingUnit = await Unit.findOne({ unit_name });
        if (existingUnit) {
            return next(new ApiError(409, "Unit already exists"));
        }

        const unit = await Unit.createUnit({ unit_name });

        if (!unit) {
            return next(new ApiError(500, "Failed to create unit"));
        }

        return res
            .status(201)
            .json(new ApiResponse(201, unit, "Unit created successfully"));
    } catch (error) {
        return next(new ApiError(500, error.message));
    }
});

const getAllUnits = asyncHandler(async (req, res, next) => {
    try {
        const units = await Unit.getAllUnits();

        return res
            .status(200)
            .json(new ApiResponse(200, units, "Units fetched successfully"));
    } catch (error) {
        return next(new ApiError(500, error.message));
    }
});

const updateUnit = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { unit_name } = req.body;

    if (!unit_name) {
        return next(new ApiError(400, "Unit name is required"));
    }

    try {
        const unit = await Unit.findByIdAndUpdate(
            id,
            { unit_name },
            { new: true }
        );

        if (!unit) {
            return next(new ApiError(404, "Unit not found"));
        }

        return res
            .status(200)
            .json(new ApiResponse(200, unit, "Unit updated successfully"));
    } catch (error) {
        return next(new ApiError(500, error.message));
    }
});

const deleteUnit = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    try {
        const unit = await Unit.findByIdAndDelete(id);

        if (!unit) {
            return next(new ApiError(404, "Unit not found"));
        }

        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Unit deleted successfully"));
    } catch (error) {
        return next(new ApiError(500, error.message));
    }
});

export { createUnit, getAllUnits, updateUnit, deleteUnit };
