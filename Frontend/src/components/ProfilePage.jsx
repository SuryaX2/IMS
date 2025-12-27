import React, { useState, useContext, useEffect } from "react";
import { Layout, Card, Form, Tabs } from "antd";
import { toast } from "react-hot-toast";
import AuthContext from "../context/AuthContext";
import { userService } from "../services/userService";

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
    const [activeTab, setActiveTab] = useState("1");
    const [editMode, setEditMode] = useState(false);

    const [isVerified, setIsVerified] = useState(user?.isVerified || false);
    const [newPasswordData, setNewPasswordData] = useState(null);

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
            await userService.updateProfile(values.username);
            refreshUser();
            setEditMode(false);
        } catch (error) {
            console.error("Profile update error:", error);
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
            try {
                await userService.updateAvatar(info.file.originFileObj);
                refreshUser();
            } catch (error) {
                console.error("Avatar upload error:", error);
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
            await userService.sendChangePasswordOtp();
        } catch (error) {
            console.error("Send OTP error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (values) => {
        try {
            setLoading(true);
            const verifyResponse = await userService.verifyOtp(values.otp);

            if (verifyResponse.success) {
                if (newPasswordData) {
                    await userService.changePassword(
                        newPasswordData.oldPassword,
                        newPasswordData.newPassword
                    );
                    passwordForm.resetFields();
                    setShowOtpModal(false);
                    setNewPasswordData(null);
                    refreshUser();
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
            console.error("Verify OTP error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (key) => {
        setActiveTab(key);
    };

    return (
        <Content className="min-h-screen bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                <Card className="border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <ProfileHeader
                        user={user}
                        isVerified={isVerified}
                        avatarLoading={avatarLoading}
                        handleAvatarUpload={handleAvatarUpload}
                        customUploadRequest={customUploadRequest}
                        setEditMode={setEditMode}
                    />

                    <div className="border-t border-gray-100">
                        {editMode ? (
                            <div className="p-6 sm:p-8">
                                <EditProfileForm
                                    profileForm={profileForm}
                                    handleProfileUpdate={handleProfileUpdate}
                                    loading={loading}
                                    setEditMode={setEditMode}
                                    user={user}
                                />
                            </div>
                        ) : (
                            <Tabs
                                activeKey={activeTab}
                                onChange={handleTabChange}
                                size="large"
                                items={[
                                    {
                                        key: "1",
                                        label: "Account Information",
                                        children: (
                                            <AccountInfoTab
                                                user={user}
                                                isVerified={isVerified}
                                                handleTabChange={
                                                    handleTabChange
                                                }
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
                    </div>
                </Card>
            </div>

            <OtpVerificationModal
                showOtpModal={showOtpModal}
                setShowOtpModal={setShowOtpModal}
                otpForm={otpForm}
                handleVerifyOtp={handleVerifyOtp}
                handleSendOtp={handleSendOtp}
                loading={loading}
                newPasswordData={newPasswordData}
            />
        </Content>
    );
};

export default ProfilePage;
