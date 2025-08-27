// Backend/routes/scheduler.routes.js
import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";
import lowStockScheduler from "../utils/lowStockScheduler.js";

const router = express.Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes

// Get scheduler status (admin only)
router.get(
    "/status",
    isAdmin,
    asyncHandler(async (req, res) => {
        const status = lowStockScheduler.getStatus();
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    status,
                    "Scheduler status retrieved successfully"
                )
            );
    })
);

// Manually trigger low stock alerts (admin only)
router.post(
    "/trigger-alerts",
    isAdmin,
    asyncHandler(async (req, res) => {
        const result = await lowStockScheduler.triggerManually();

        if (result.success) {
            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        result.results,
                        "Low stock alerts triggered successfully"
                    )
                );
        } else {
            throw new ApiError(500, result.error || "Failed to trigger alerts");
        }
    })
);

// Update threshold (admin only)
router.put(
    "/threshold",
    isAdmin,
    asyncHandler(async (req, res) => {
        const { threshold } = req.body;

        if (!threshold || threshold < 1) {
            throw new ApiError(400, "Threshold must be a positive number");
        }

        lowStockScheduler.setThreshold(parseInt(threshold));

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    { threshold: parseInt(threshold) },
                    "Threshold updated successfully"
                )
            );
    })
);

// Start scheduler (admin only)
router.post(
    "/start",
    isAdmin,
    asyncHandler(async (req, res) => {
        lowStockScheduler.start();
        return res
            .status(200)
            .json(new ApiResponse(200, null, "Scheduler started successfully"));
    })
);

// Stop scheduler (admin only)
router.post(
    "/stop",
    isAdmin,
    asyncHandler(async (req, res) => {
        lowStockScheduler.stop();
        return res
            .status(200)
            .json(new ApiResponse(200, null, "Scheduler stopped successfully"));
    })
);

export default router;
