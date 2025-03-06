import { Router } from "express";
import {
    createUnit,
    getAllUnits,
    updateUnit,
    deleteUnit,
} from "../controllers/unit.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/").post(createUnit).get(getAllUnits);

router.route("/:id").patch(updateUnit).delete(deleteUnit);

export default router;
