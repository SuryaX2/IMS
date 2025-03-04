import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import transporter from "../utils/nodemailer.js";

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        return next(
            new ApiError(
                500,
                "Something went wrong while generating referesh and access token"
            )
        );
    }
};

const registerUser = asyncHandler(async (req, res, next) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    const { email, username, password } = req.body;

    if ([email, username, password].some((field) => field?.trim() === "")) {
        return next(new ApiError(400, "All fields are required"));
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (existedUser) {
        return next(
            new ApiError(409, "User with email or username already exists")
        );
    }

    // console.log(req.files);
    const avatarLocalPath = req.files?.avatar[0]?.path;

    if (!avatarLocalPath) {
        return next(new ApiError(400, "Avatar file is required"));
    }
    // console.log(avatarLocalPath);

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    // console.log(avatar);
    // console.log(avatar.url);
    if (!avatar) {
        return next(new ApiError(400, "Avatar file is required"));
    }

    const user = await User.create({
        avatar: avatar.url,
        email,
        password,
        username: username.toLowerCase(),
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        return next(
            new ApiError(500, "Something went wrong while registering the user")
        );
    }

    // Sending Welcome Email
    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: createdUser.email,
        subject: "Welcome to our platform",
        text: `Hello ${createdUser.username}, Welcome to our platform`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
            <h1 style="color: #333; text-align: center;">Welcome, ${createdUser.username}!</h1>
            <p style="font-size: 16px; color: #555; text-align: center;">
                Thank you for joining our platform. We are excited to have you here!
            </p>
            <p style="font-size: 16px; color: #555; text-align: center;">
                Explore our features and make the most of our platform.
            </p>
            <p style="font-size: 16px; color: #555; text-align: center;">
                If you have any questions, feel free to reach out to our support team at 
                <a href="mailto:sekharsurya111@gmail.com" style="color: #4CAF50; text-decoration: none;">sekharsurya111@gmail.com</a>.
            </p>
            <p style="font-size: 16px; color: #555; text-align: center; margin-top: 20px;">
                Regards, <strong> Surya</strong>
            </p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="text-align: center; font-size: 14px; color: #888;">
                &copy; ${new Date().getFullYear()} Surya. All rights reserved.
            </p>
        </div>
        `,
    };

    await transporter.sendMail(mailOptions);

    return res
        .status(201)
        .json(
            new ApiResponse(200, createdUser, "User registered Successfully")
        );
});

const loginUser = asyncHandler(async (req, res, next) => {
    // req body -> data
    // username or email
    // find the user
    // password check
    // access and referesh token
    // send cookie

    const { email, username, password } = req.body;
    console.log(email);

    if (!username && !email) {
        return next(new ApiError(400, "username or email is required"));
    }

    const user = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (!user) {
        return next(new ApiError(404, "User does not exist"));
    }

    const isPasswordValid = await user.matchPassword(password);

    if (!isPasswordValid) {
        return next(new ApiError(401, "Invalid user credentials"));
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
        user._id
    );

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                "User logged In Successfully"
            )
        );
});

const logoutUser = asyncHandler(async (req, res, next) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1, // this removes the field from document
            },
        },
        {
            new: true,
        }
    );

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res, next) => {
    const incomingRefreshToken =
        req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        return next(new ApiError(401, "unauthorized request"));
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken?._id);

        if (!user) {
            return next(new ApiError(401, "Invalid refresh token"));
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            return next(new ApiError(401, "Refresh token is expired or used"));
        }

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        };

        const { accessToken, newRefreshToken } =
            await generateAccessAndRefreshTokens(user._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed"
                )
            );
    } catch (error) {
        return next(
            new ApiError(401, error?.message || "Invalid refresh token")
        );
    }
});

const changeCurrentPassword = asyncHandler(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id);
    const isPasswordCorrect = await user.matchPassword(oldPassword);

    if (!isPasswordCorrect) {
        return next(new ApiError(400, "Invalid old password"));
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res, next) => {
    const { username } = req.body;

    if (!username) {
        return next(new ApiError(400, "All fields are required"));
    }

    // username must be unique
    const existed = await User.findOne({ username: username.toLowerCase() });

    if (existed) {
        return next(new ApiError(409, "Username already exists"));
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                username: username.toLowerCase(),
            },
        },
        { new: true }
    ).select("-password -refreshToken");

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "Account details updated successfully")
        );
});

const updateUserAvatar = asyncHandler(async (req, res, next) => {
    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
        return next(new ApiError(400, "Avatar file is missing"));
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar.url) {
        return next(new ApiError(400, "Error while uploading on avatar"));
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url,
            },
        },
        { new: true }
    ).select("-password");

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Avatar image updated successfully"));
});

const getCurrentUser = asyncHandler(async (req, res, next) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "User fetched successfully"));
});

// Send verification otp to users email
const sendVerifyOtp = asyncHandler(async (req, res, next) => {
    try {
        const userId = req.user._id; // userId is coming from verifyJWT middleware
        const user = await User.findById(userId);

        if (!user) {
            return next(new ApiError(404, "User not found"));
        }

        if (user.isVerified) {
            return next(new ApiError(400, "User is already verified"));
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.verifyOtp = otp;
        user.verifyOtpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save({ validateBeforeSave: false });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Account Verification - Verify your email",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
                    <h2 style="color: #333; text-align: center;">Account Verification</h2>
                    <p style="font-size: 16px; color: #555;">Hi <strong>${user.username}</strong>,</p>
                    <p style="font-size: 16px; color: #555;">Please use the following OTP to verify your email:</p>
                    <div style="text-align: center; margin: 20px 0;">
                        <span style="background-color: #4CAF50; color: white; padding: 12px 24px; border-radius: 5px; font-size: 24px; font-weight: bold; display: inline-block;">
                            ${otp}
                        </span>
                    </div>
                    <p style="font-size: 16px; color: #555;">This OTP is valid for <strong>10 minutes</strong>.</p>
                    <p style="font-size: 16px; color: #555;">If you did not request this, please ignore this email.</p>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    <p style="text-align: center; font-size: 14px; color: #888;">&copy; ${new Date().getFullYear()} Surya. All rights reserved.</p>
                </div>
            `,
        };
        await transporter.sendMail(mailOptions);

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {},
                    "Verification OTP sent to your email successfully"
                )
            );
    } catch (error) {
        return next(new ApiError(500, error.message));
    }
});

// Send verification otp to users email for changing password
const sendChangePasswordOtp = asyncHandler(async (req, res, next) => {
    try {
        const userId = req.user._id; // userId is coming from verifyJWT middleware
        const user = await User.findById(userId);

        if (!user) {
            return next(new ApiError(404, "User not found"));
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.verifyOtp = otp;
        user.verifyOtpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save({ validateBeforeSave: false });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Change Password - Verify your email",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
                    <h2 style="color: #333; text-align: center;">Change Password</h2>
                    <p style="font-size: 16px; color: #555;">Hi <strong>${user.username}</strong>,</p>
                    <p style="font-size: 16px; color: #555;">Please use the following OTP to change your password:</p>
                    <div style="text-align: center; margin: 20px 0;">
                        <span style="background-color: #4CAF50; color: white; padding: 12px 24px; border-radius: 5px; font-size: 24px; font-weight: bold; display: inline-block;">
                            ${otp}
                        </span>
                    </div>
                    <p style="font-size: 16px; color: #555;">This OTP is valid for <strong>10 minutes</strong>.</p>
                    <p style="font-size: 16px; color: #555;">If you did not request this, please ignore this email.</p>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    <p style="text-align: center; font-size: 14px; color: #888;">&copy; ${new Date().getFullYear()} Surya. All rights reserved.</p>
                </div>
            `,
        };
        await transporter.sendMail(mailOptions);

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {},
                    "Verification OTP sent to your email successfully"
                )
            );
    } catch (error) {
        return next(new ApiError(500, error.message));
    }
});

// Verify user email for changing password
const verifyChangePasswordOtp = asyncHandler(async (req, res, next) => {
    const { otp } = req.body;
    const userId = req.user._id; // userId is coming from verifyJWT middleware

    if (!userId || !otp) {
        return next(new ApiError(400, "UserId and OTP are required"));
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return next(new ApiError(404, "User not found"));
        }

        if (user.verifyOtp !== otp || user.verifyOtp === "") {
            return next(new ApiError(400, "Invalid OTP"));
        }

        if (user.verifyOtpExpiry < Date.now()) {
            return next(new ApiError(400, "OTP expired"));
        }

        user.verifyOtp = "";
        user.verifyOtpExpiry = 0;
        await user.save({ validateBeforeSave: false });

        return res.status(200).json(new ApiResponse(200, {}, "OTP verified"));
    } catch (error) {
        return next(new ApiError(400, "Invalid OTP or User"));
    }
});

// Verify user email
const verifyEmail = asyncHandler(async (req, res, next) => {
    const { otp } = req.body;
    const userId = req.user._id; // userId is coming from verifyJWT middleware

    if (!userId || !otp) {
        return next(new ApiError(400, "UserId and OTP are required"));
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return next(new ApiError(404, "User not found"));
        }

        if (user.isVerified) {
            return next(new ApiError(400, "User is already verified"));
        }

        if (user.verifyOtp !== otp || user.verifyOtp === "") {
            return next(new ApiError(400, "Invalid OTP"));
        }

        if (user.verifyOtpExpiry < Date.now()) {
            return next(new ApiError(400, "OTP expired"));
        }

        user.isVerified = true;
        user.verifyOtp = "";
        user.verifyOtpExpiry = 0;
        await user.save({ validateBeforeSave: false });

        return res
            .status(200)
            .json(new ApiResponse(200, {}, "User verified successfully"));
    } catch (error) {
        return next(new ApiError(400, "Invalid OTP or User"));
    }
});

// Check if user is authenticated
const isAuthenticated = asyncHandler(async (req, res, next) => {
    try {
        return res
            .status(200)
            .json(new ApiResponse(200, {}, "User is authenticated"));
    } catch (error) {
        return next(new ApiError(400, error.message));
    }
});

// Send reset otp to users email
const sendResetOtp = asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return next(new ApiError(400, "Email is required"));
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return next(new ApiError(404, "User not found"));
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.resetOtp = otp;
        user.resetOtpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save({ validateBeforeSave: false });

        const mailOptions = {
            to: email,
            subject: "Password Reset OTP",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2 style="color: #333; text-align: center;">Password Reset OTP</h2>
                    <p style="font-size: 16px; color: #555;">Hi <strong>${user.username}</strong>,</p>
                    <p style="font-size: 16px; color: #555;">Please use the following OTP to reset your password:</p>
                    <div style="text-align: center; margin: 20px 0;">
                        <span style="font-size: 24px; font-weight: bold; color: #007BFF;">${otp}</span>
                    </div>
                    <p style="font-size: 16px; color: #555;">This OTP is valid for <strong>10 minutes</strong>.</p>
                    <p style="font-size: 16px; color: #555;">If you did not request this, please ignore this email.</p>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    <p style="text-align: center; font-size: 14px; color: #888;">&copy; ${new Date().getFullYear()} Surya. All rights reserved.</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {},
                    "Password reset OTP sent to your email successfully"
                )
            );
    } catch (error) {
        return next(new ApiError(500, error.message));
    }
});

// Reset user password
const resetPassword = asyncHandler(async (req, res, next) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return next(
            new ApiError(400, "Email, OTP and New Password are required")
        );
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return next(new ApiError(404, "User not found"));
        }

        if (user.resetOtp !== otp || user.resetOtp === "") {
            return next(new ApiError(400, "Invalid OTP"));
        }

        if (user.resetOtpExpiry < Date.now()) {
            return next(new ApiError(400, "OTP expired"));
        }

        user.password = newPassword;
        user.resetOtp = "";
        user.resetOtpExpiry = 0;
        await user.save({ validateBeforeSave: false });

        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Password reset successfully"));
    } catch (error) {
        return next(new ApiError(500, error.message));
    }
});

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    updateAccountDetails,
    updateUserAvatar,
    getCurrentUser,
    sendVerifyOtp,
    verifyEmail,
    isAuthenticated,
    sendResetOtp,
    resetPassword,
    sendChangePasswordOtp,
    verifyChangePasswordOtp,
};
