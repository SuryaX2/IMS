import { Router } from "express";
import {
    createUnit,
    getAllUnits,
    updateUnit,
    deleteUnit,
} from "../controllers/unit.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

// Regular user routes
router.route("/").post(createUnit).get(getAllUnits); // This will now return only the user's units by default

router.route("/:id").patch(updateUnit).delete(deleteUnit);

// Admin only routes
router.route("/all").get(isAdmin, getAllUnits); // This will get all units for admin

export default router;
