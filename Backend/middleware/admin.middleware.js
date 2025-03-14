import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Middleware to check if user is admin
export const isAdmin = asyncHandler(async (req, _, next) => {
    try {
        if (!req.user) {
            return next(new ApiError(401, "Unauthorized request"));
        }
        if (req.user.role !== "admin") {
            return next(
                new ApiError(403, "Access denied. Admin privileges required")
            );
        }
        next();
    } catch (error) {
        return next(
            new ApiError(500, error?.message || "Something went wrong")
        );
    }
});
