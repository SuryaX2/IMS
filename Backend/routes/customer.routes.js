import { Router } from "express";
import {
    createCustomer,
    getAllCustomers,
    updateCustomer,
    deleteCustomer,
} from "../controllers/customer.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
    .route("/")
    .post(upload.single("photo"), createCustomer)
    .get(getAllCustomers);

router
    .route("/:id")
    .patch(upload.single("photo"), updateCustomer)
    .delete(deleteCustomer);

export default router;
