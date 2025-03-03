import { toast } from "react-hot-toast";
import { api } from "../api/api";

export const userService = {
    // Profile update
    async updateProfile(username) {
        try {
            const response = await api.patch("/users/update-account", {
                username,
            });

            if (response.data.success) {
                toast.success("Profile updated successfully", {
                    position: "top-right",
                    duration: 3000,
                });
            }

            return response.data;
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to update profile",
                {
                    position: "top-right",
                    duration: 4000,
                }
            );
            throw error;
        }
    },

    // Avatar upload
    async updateAvatar(file) {
        const formData = new FormData();
        formData.append("avatar", file);

        try {
            const response = await api.patch("/users/avatar", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data.success) {
                toast.success("Your avatar has been updated successfully");
            }

            return response.data;
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to update avatar",
                {
                    position: "top-right",
                    duration: 4000,
                }
            );
            throw error;
        }
    },

    // Password management
    async sendChangePasswordOtp() {
        try {
            await api.post("/users/send-change-password-otp");
            toast.success("OTP has been sent to your email");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send OTP");
            throw error;
        }
    },

    async verifyOtp(otp) {
        try {
            const response = await api.post(
                "/users/verify-change-password-otp",
                { otp }
            );
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Invalid OTP", {
                position: "top-right",
                duration: 4000,
            });
            throw error;
        }
    },

    async changePassword(oldPassword, newPassword) {
        try {
            const response = await api.post("/users/change-password", {
                oldPassword,
                newPassword,
            });

            if (response.data.success) {
                toast.success("Your password has been changed successfully");
            }

            return response.data;
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to change password",
                {
                    position: "top-right",
                    duration: 4000,
                }
            );
            throw error;
        }
    },
};
