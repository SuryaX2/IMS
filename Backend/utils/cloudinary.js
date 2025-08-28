import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload buffer directly to Cloudinary (for Vercel)
const uploadBufferToCloudinary = async (buffer, filename) => {
    try {
        if (!buffer) return null;

        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: "auto",
                    public_id: filename ? path.parse(filename).name : undefined,
                    folder: "ims-uploads", // Optional: organize uploads in folder
                },
                (error, result) => {
                    if (error) {
                        console.error("Cloudinary Upload Error:", error);
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );
            uploadStream.end(buffer);
        });
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        return null;
    }
};

// Original function for local development (when files are saved to disk)
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        // Check if file exists
        if (!fs.existsSync(localFilePath)) {
            console.error(`File not found: ${localFilePath}`);
            return null;
        }

        // Upload the file to cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: "ims-uploads", // Optional: organize uploads in folder
        });

        // Remove the locally saved temporary file
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        // Clean up file if it exists
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        return null;
    }
};

// Function that works in both local and Vercel environments
const uploadToCloudinary = async (file) => {
    try {
        if (!file) return null;

        // If file has buffer property (multer memory storage), use buffer upload
        if (file.buffer) {
            return await uploadBufferToCloudinary(
                file.buffer,
                file.originalname
            );
        }

        // If file has path property (multer disk storage), use file upload
        if (file.path) {
            return await uploadOnCloudinary(file.path);
        }

        // If it's just a file path string
        if (typeof file === "string") {
            return await uploadOnCloudinary(file);
        }

        throw new Error("Invalid file format provided");
    } catch (error) {
        console.error("Upload to Cloudinary failed:", error);
        return null;
    }
};

export { uploadOnCloudinary, uploadBufferToCloudinary, uploadToCloudinary };
