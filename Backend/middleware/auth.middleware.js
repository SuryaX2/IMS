import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        // Check multiple sources for token
        let token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "") ||
            req.body?.accessToken ||
            req.query?.accessToken;

        console.log("Token sources:", {
            cookies: !!req.cookies?.accessToken,
            authorization: !!req.header("Authorization"),
            body: !!req.body?.accessToken,
            query: !!req.query?.accessToken,
            foundToken: !!token,
        });

        if (!token) {
            return next(
                new ApiError(401, "Unauthorized request - No token provided")
            );
        }

        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        } catch (jwtError) {
            console.error("JWT verification failed:", jwtError.message);
            return next(
                new ApiError(401, `Invalid Access Token: ${jwtError.message}`)
            );
        }

        const user = await User.findById(decodedToken?._id).select(
            "-password -refreshToken"
        );

        if (!user) {
            return next(
                new ApiError(401, "Invalid Access Token - User not found")
            );
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        return next(
            new ApiError(401, error?.message || "Invalid access token")
        );
    }
});
