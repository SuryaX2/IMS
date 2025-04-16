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
        const existingUnit = await Unit.findOne({
            unit_name,
            created_by: req.user._id,
        });

        if (existingUnit) {
            return next(new ApiError(409, "Unit already exists"));
        }

        const unit = await Unit.createUnit({
            unit_name,
            created_by: req.user._id,
        });

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
        let units;

        if (req.user.role === "admin") {
            // Admin can see all units
            units = await Unit.getAllUnits();
        } else {
            // Regular user can only see their units
            units = await Unit.getUnitsByUser(req.user._id);
        }

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
        let unit;

        if (req.user.role === "admin") {
            // Admin can update any unit
            unit = await Unit.findByIdAndUpdate(
                id,
                {
                    unit_name,
                    updated_by: req.user._id,
                },
                { new: true }
            );
        } else {
            // Regular user can only update their own units
            unit = await Unit.findOneAndUpdate(
                {
                    _id: id,
                    created_by: req.user._id,
                },
                {
                    unit_name,
                    updated_by: req.user._id,
                },
                { new: true }
            );
        }

        if (!unit) {
            return next(
                new ApiError(
                    404,
                    "Unit not found or you don't have permission to update it"
                )
            );
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
        let unit;

        if (req.user.role === "admin") {
            // Admin can delete any unit
            unit = await Unit.findByIdAndDelete(id);
        } else {
            // Regular user can only delete their own units
            unit = await Unit.findOneAndDelete({
                _id: id,
                created_by: req.user._id,
            });
        }

        if (!unit) {
            return next(
                new ApiError(
                    404,
                    "Unit not found or you don't have permission to delete it"
                )
            );
        }

        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Unit deleted successfully"));
    } catch (error) {
        return next(new ApiError(500, error.message));
    }
});

export { createUnit, getAllUnits, updateUnit, deleteUnit };
