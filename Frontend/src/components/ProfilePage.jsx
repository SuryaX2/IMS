import React, { useState, useContext, useEffect } from "react";
import {
    Layout,
    Card,
    Avatar,
    Typography,
    Button,
    Tabs,
    Form,
    Input,
    Divider,
    Upload,
    Modal,
    Spin,
    notification,
} from "antd";
import {
    UserOutlined,
    MailOutlined,
    LockOutlined,
    EditOutlined,
    UploadOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";
import { api } from "../api/api";
import toast from "react-hot-toast";
import AuthContext from "../context/AuthContext";

const { Content } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

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
    const [verificationSent, setVerificationSent] = useState(false);

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
                toast.success("Profile updated successfully");
                refreshUser(); // Refresh user data
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to update profile"
            );
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (values) => {
        try {
            setLoading(true);
            // First verify the old password
            const response = await api.post("/users/change-password", {
                oldPassword: values.oldPassword,
                newPassword: values.password,
            });

            if (response.data.success) {
                toast.success("Password changed successfully");
                passwordForm.resetFields();
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to change password"
            );
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordRequest = (values) => {
        // Store password data and show OTP modal
        setNewPasswordData({
            oldPassword: values.oldPassword,
            newPassword: values.password,
        });
        setShowOtpModal(true);

        // Send OTP to email
        handleSendOtp();
    };

    const handleSendOtp = async () => {
        try {
            setLoading(true);
            await api.post("/users/send-verify-otp");
            toast.success("OTP sent to your email");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (values) => {
        try {
            setLoading(true);

            // First verify OTP
            const verifyResponse = await api.post("/users/verify-email", {
                otp: values.otp,
            });

            if (verifyResponse.data.success) {
                // If OTP verification successful, change password
                if (newPasswordData) {
                    const response = await api.post("/users/change-password", {
                        oldPassword: newPasswordData.oldPassword,
                        newPassword: newPasswordData.newPassword,
                    });

                    if (response.data.success) {
                        toast.success("Password changed successfully");
                        passwordForm.resetFields();
                        setShowOtpModal(false);
                        setNewPasswordData(null);
                        refreshUser();
                    }
                } else {
                    // Just for email verification
                    toast.success("Email verified successfully");
                    setIsVerified(true);
                    refreshUser();
                }
                setShowOtpModal(false);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Invalid OTP");
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
                    toast.success("Avatar updated successfully");
                    refreshUser();
                }
            } catch (error) {
                toast.error(
                    error.response?.data?.message || "Failed to update avatar"
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

    const sendVerificationEmail = async () => {
        try {
            setLoading(true);
            const response = await api.post("/users/send-verify-otp");

            if (response.data.success) {
                toast.success("Verification OTP sent to your email");
                setVerificationSent(true);
                setShowOtpModal(true);
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Failed to send verification email"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Content className="p-6 min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto">
                <Card
                    className="shadow-md rounded-lg overflow-hidden mb-6"
                    bordered={false}
                >
                    <div className="flex flex-col md:flex-row items-center p-4 md:p-6 gap-6">
                        <div className="relative">
                            <Spin spinning={avatarLoading}>
                                <Avatar
                                    size={120}
                                    src={user?.avatar}
                                    icon={!user?.avatar && <UserOutlined />}
                                    className="border-2 border-blue-500"
                                />
                            </Spin>
                            <Upload
                                name="avatar"
                                showUploadList={false}
                                customRequest={customUploadRequest}
                                onChange={handleAvatarUpload}
                            >
                                <Button
                                    type="primary"
                                    shape="circle"
                                    icon={<EditOutlined />}
                                    size="small"
                                    className="absolute bottom-0 right-0 bg-blue-500"
                                />
                            </Upload>
                        </div>

                        <div className="text-center md:text-left">
                            <Title level={3}>{user?.username}</Title>
                            <div className="flex items-center gap-2 mb-2">
                                <MailOutlined className="text-gray-500" />
                                <Text className="text-gray-700">
                                    {user?.email}
                                </Text>
                                {isVerified ? (
                                    <CheckCircleOutlined
                                        className="text-green-500"
                                        title="Verified"
                                    />
                                ) : (
                                    <Button
                                        type="link"
                                        danger
                                        size="small"
                                        onClick={sendVerificationEmail}
                                        icon={<ExclamationCircleOutlined />}
                                    >
                                        Verify Email
                                    </Button>
                                )}
                            </div>
                            <Text type="secondary">
                                Account created:{" "}
                                {user?.createdAt
                                    ? new Date(
                                          user.createdAt
                                      ).toLocaleDateString()
                                    : "N/A"}
                            </Text>
                        </div>
                    </div>
                </Card>

                <Card className="shadow-md rounded-lg">
                    <Tabs defaultActiveKey="1" onChange={setActiveTab}>
                        <TabPane tab="Edit Profile" key="1">
                            <Form
                                form={profileForm}
                                layout="vertical"
                                onFinish={handleProfileUpdate}
                                className="max-w-lg mx-auto py-4"
                            >
                                <Form.Item
                                    label="Username"
                                    name="username"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please input your username!",
                                        },
                                    ]}
                                >
                                    <Input
                                        prefix={<UserOutlined />}
                                        placeholder="Username"
                                    />
                                </Form.Item>

                                <Form.Item label="Email">
                                    <Input
                                        prefix={<MailOutlined />}
                                        value={user?.email}
                                        disabled
                                        className="bg-gray-100 text-gray-500"
                                    />
                                    <Text
                                        type="secondary"
                                        className="text-xs mt-1"
                                    >
                                        Email cannot be changed for security
                                        reasons
                                    </Text>
                                </Form.Item>

                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={loading}
                                        className="w-full bg-blue-500 hover:bg-blue-600"
                                    >
                                        Update Profile
                                    </Button>
                                </Form.Item>
                            </Form>
                        </TabPane>

                        <TabPane tab="Change Password" key="2">
                            <Form
                                form={passwordForm}
                                layout="vertical"
                                onFinish={handlePasswordRequest}
                                className="max-w-lg mx-auto py-4"
                            >
                                <Form.Item
                                    label="Current Password"
                                    name="oldPassword"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please input your current password!",
                                        },
                                    ]}
                                >
                                    <Input.Password
                                        prefix={<LockOutlined />}
                                        placeholder="Current Password"
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="New Password"
                                    name="password"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please input your new password!",
                                        },
                                        {
                                            min: 6,
                                            message:
                                                "Password must be at least 6 characters",
                                        },
                                    ]}
                                >
                                    <Input.Password
                                        prefix={<LockOutlined />}
                                        placeholder="New Password"
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Confirm New Password"
                                    name="confirmPassword"
                                    dependencies={["password"]}
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please confirm your new password!",
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (
                                                    !value ||
                                                    getFieldValue(
                                                        "password"
                                                    ) === value
                                                ) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(
                                                    new Error(
                                                        "The two passwords do not match!"
                                                    )
                                                );
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password
                                        prefix={<LockOutlined />}
                                        placeholder="Confirm New Password"
                                    />
                                </Form.Item>

                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={loading}
                                        className="w-full bg-blue-500 hover:bg-blue-600"
                                    >
                                        Change Password
                                    </Button>
                                </Form.Item>
                            </Form>
                        </TabPane>
                    </Tabs>
                </Card>

                {/* OTP Verification Modal */}
                <Modal
                    title="OTP Verification"
                    open={showOtpModal}
                    onCancel={() => setShowOtpModal(false)}
                    footer={null}
                >
                    <Form
                        form={otpForm}
                        layout="vertical"
                        onFinish={handleVerifyOtp}
                    >
                        <p className="mb-4 text-gray-600">
                            {newPasswordData
                                ? "To complete your password change, please enter the OTP sent to your email."
                                : "Please enter the verification code sent to your email."}
                        </p>

                        <Form.Item
                            name="otp"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input the OTP!",
                                },
                            ]}
                        >
                            <Input
                                placeholder="Enter OTP"
                                className="text-center text-lg"
                                maxLength={6}
                            />
                        </Form.Item>

                        <div className="flex justify-between">
                            <Button onClick={() => handleSendOtp()}>
                                Resend OTP
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                            >
                                Verify
                            </Button>
                        </div>
                    </Form>
                </Modal>
            </div>
        </Content>
    );
};

export default ProfilePage;
