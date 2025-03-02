import { Router } from "express";
import {
    loginUser,
    logoutUser,
    registerUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    sendVerifyOtp,
    verifyEmail,
    isAuthenticated,
    sendResetOtp,
    resetPassword,
    updateAccountDetails,
    updateUserAvatar,
} from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1,
        },
    ]),
    registerUser
);

router.route("/login").post(loginUser);

//secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);

router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)

router.route("/current-user").get(verifyJWT, getCurrentUser);

router.route("/send-verify-otp").post(verifyJWT, sendVerifyOtp);
router.route("/verify-email").post(verifyJWT, verifyEmail);

router.route("/is-auth").post(verifyJWT, isAuthenticated);

router.route("/send-reset-otp").post(sendResetOtp);
router.route("/reset-password").post(resetPassword);

export default router;
