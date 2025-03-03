import React, { useState, useContext, useEffect } from "react";
import {
    Layout,
    Card,
    Form,
    Tabs,
} from "antd";
import { toast } from "react-hot-toast";
import { api } from "../api/api";
import AuthContext from "../context/AuthContext";
import ProfileHeader from "../components/profile/ProfileHeader";
import EditProfileForm from "../components/profile/EditProfileForm";
import AccountInfoTab from "../components/profile/AccountInfoTab";
import PasswordChangeTab from "../components/profile/PasswordChangeTab";
import OtpVerificationModal from "../components/profile/OtpVerificationModal";

const { Content } = Layout;

const ProfilePage = () => {
    const { user, refreshUser } = useContext(AuthContext);
    const [profileForm] = Form.useForm();
    const [passwordForm] = Form.useForm();
    const [otpForm] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [avatarLoading, setAvatarLoading] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [newPasswordData, setNewPasswordData] = useState(null);
    const [activeTab, setActiveTab] = useState("1");
    const [isVerified, setIsVerified] = useState(user?.isVerified || false);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        if (user) {
            profileForm.setFieldsValue({
                username: user.username,
            });
            setIsVerified(user.isVerified || false);
        }
    }, [user, profileForm]);

    const handleProfileUpdate = async (values) => {
        try {
            setLoading(true);
            const response = await api.patch("/users/update-account", {
                username: values.username,
            });

            if (response.data.success) {
                toast.success("Profile updated successfully", {
                    position: "top-right",
                    duration: 3000,
                });
                refreshUser();
                setEditMode(false);
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to update profile",
                {
                    position: "top-right",
                    duration: 4000,
                }
            );
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordRequest = (values) => {
        setNewPasswordData({
            oldPassword: values.oldPassword,
            newPassword: values.password,
        });
        setShowOtpModal(true);
        handleSendOtp();
    };

    const handleSendOtp = async () => {
        try {
            setLoading(true);
            await api.post("/users/send-change-password-otp");
            toast.success("OTP has been sent to your email");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (values) => {
        try {
            setLoading(true);
            const verifyResponse = await api.post(
                "/users/verify-change-password-otp",
                {
                    otp: values.otp,
                }
            );

            if (verifyResponse.data.success) {
                if (newPasswordData) {
                    const response = await api.post("/users/change-password", {
                        oldPassword: newPasswordData.oldPassword,
                        newPassword: newPasswordData.newPassword,
                    });

                    if (response.data.success) {
                        toast.success(
                            "Your password has been changed successfully"
                        );
                        passwordForm.resetFields();
                        setShowOtpModal(false);
                        setNewPasswordData(null);
                        refreshUser();
                    }
                } else {
                    toast.success("Your email has been verified successfully", {
                        position: "top-right",
                        duration: 3000,
                    });
                    setIsVerified(true);
                    refreshUser();
                    setShowOtpModal(false);
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Invalid OTP", {
                position: "top-right",
                duration: 4000,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarUpload = async (info) => {
        if (info.file.status === "uploading") {
            setAvatarLoading(true);
            return;
        }

        if (info.file.originFileObj) {
            const formData = new FormData();
            formData.append("avatar", info.file.originFileObj);

            try {
                const response = await api.patch("/users/avatar", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                if (response.data.success) {
                    toast.success("Your avatar has been updated successfully");
                    refreshUser();
                }
            } catch (error) {
                toast.error(
                    error.response?.data?.message || "Failed to update avatar",
                    {
                        position: "top-right",
                        duration: 4000,
                    }
                );
            } finally {
                setAvatarLoading(false);
            }
        }
    };

    const customUploadRequest = ({ onSuccess }) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 0);
    };

    const handleTabChange = (key) => {
        setActiveTab(key);
    };

    return (
        <Content className="p-6 min-h-screen bg-gradient-to-b from-indigo-50 via-blue-50 to-purple-50">
            <div className="max-w-5xl mx-auto">
                {/* Profile Header Component */}
                <ProfileHeader
                    user={user}
                    isVerified={isVerified}
                    avatarLoading={avatarLoading}
                    handleAvatarUpload={handleAvatarUpload}
                    customUploadRequest={customUploadRequest}
                    setEditMode={setEditMode}
                />

                {/* Profile Content */}
                <Card className="shadow-xl rounded-xl border-0 overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                    {editMode ? (
                        <EditProfileForm
                            profileForm={profileForm}
                            handleProfileUpdate={handleProfileUpdate}
                            loading={loading}
                            setEditMode={setEditMode}
                            user={user}
                        />
                    ) : (
                        <Tabs
                            activeKey={activeTab}
                            onChange={handleTabChange}
                            className="profile-tabs"
                            type="card"
                            size="large"
                            items={[
                                {
                                    key: "1",
                                    label: "Account Information",
                                    children: (
                                        <AccountInfoTab
                                            user={user}
                                            isVerified={isVerified}
                                            handleTabChange={handleTabChange}
                                        />
                                    ),
                                },
                                {
                                    key: "2",
                                    label: "Change Password",
                                    children: (
                                        <PasswordChangeTab
                                            passwordForm={passwordForm}
                                            handlePasswordRequest={
                                                handlePasswordRequest
                                            }
                                            loading={loading}
                                        />
                                    ),
                                },
                            ]}
                        />
                    )}
                </Card>

                {/* OTP Verification Modal Component */}
                <OtpVerificationModal
                    showOtpModal={showOtpModal}
                    setShowOtpModal={setShowOtpModal}
                    otpForm={otpForm}
                    handleVerifyOtp={handleVerifyOtp}
                    handleSendOtp={handleSendOtp}
                    loading={loading}
                    newPasswordData={newPasswordData}
                />
            </div>
        </Content>
    );
};

export default ProfilePage;
