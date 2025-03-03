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
    Row,
    Col,
    Badge,
    Tooltip,
} from "antd";
import {
    UserOutlined,
    MailOutlined,
    LockOutlined,
    EditOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    SaveOutlined,
    ClockCircleOutlined,
    IdcardOutlined,
    SecurityScanOutlined,
    CalendarOutlined,
} from "@ant-design/icons";
import { api } from "../api/api";
import toast from "react-hot-toast";
import AuthContext from "../context/AuthContext";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
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
                toast.success("Profile updated successfully");
                refreshUser(); // Refresh user data
                setEditMode(false);
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to update profile"
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
            await api.post("/users/send-change-password-otp");
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
            const verifyResponse = await api.post(
                "/users/verify-change-password-otp",
                {
                    otp: values.otp,
                }
            );

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
                    setShowOtpModal(false);
                }
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
            const response = await api.post("/users/send-change-password-otp");

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
            <div className="max-w-5xl mx-auto">
                {/* Profile Header Card */}
                <Card
                    className="shadow-md rounded-lg overflow-hidden mb-6 border-0"
                    bordered={false}
                >
                    <div className="flex flex-col md:flex-row items-center p-8 gap-8">
                        <div className="relative">
                            <Badge
                                dot={isVerified}
                                color="green"
                                offset={[-4, 4]}
                                title={
                                    isVerified
                                        ? "Verified Account"
                                        : "Unverified Account"
                                }
                            >
                                <Spin spinning={avatarLoading}>
                                    <Avatar
                                        size={128}
                                        src={user?.avatar}
                                        icon={!user?.avatar && <UserOutlined />}
                                        className="border-2 border-blue-500 shadow-lg"
                                    />
                                </Spin>
                            </Badge>
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
                                    className="absolute bottom-0 right-0 bg-blue-500 shadow-md"
                                />
                            </Upload>
                        </div>

                        <div className="text-center md:text-left flex-1">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div>
                                    <Title level={2} className="mb-1">
                                        {user?.username}
                                    </Title>
                                    <div className="flex items-center gap-2 mb-3">
                                        <MailOutlined className="text-gray-500" />
                                        <Text className="text-gray-700">
                                            {user?.email}
                                        </Text>
                                        {isVerified ? (
                                            <Tooltip title="Email Verified">
                                                <CheckCircleOutlined className="text-green-500" />
                                            </Tooltip>
                                        ) : (
                                            <Button
                                                type="link"
                                                danger
                                                size="small"
                                                onClick={sendVerificationEmail}
                                                icon={
                                                    <ExclamationCircleOutlined />
                                                }
                                            >
                                                Verify Email
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    {!editMode && (
                                        <Button
                                            type="primary"
                                            icon={<EditOutlined />}
                                            onClick={() => setEditMode(true)}
                                            className="bg-blue-500"
                                        >
                                            Edit Profile
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <Row gutter={16} className="mt-4">
                                <Col span={12} md={8}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <CalendarOutlined className="text-blue-500" />
                                        <div>
                                            <Text className="text-gray-500 text-xs block">
                                                Member Since
                                            </Text>
                                            <Text className="text-gray-700 font-medium">
                                                {user?.createdAt
                                                    ? new Date(
                                                          user.createdAt
                                                      ).toLocaleDateString()
                                                    : "N/A"}
                                            </Text>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={12} md={8}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <IdcardOutlined className="text-blue-500" />
                                        <div>
                                            <Text className="text-gray-500 text-xs block">
                                                Account Type
                                            </Text>
                                            <Text className="text-gray-700 font-medium">
                                                {user?.role || "Standard User"}
                                            </Text>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={12} md={8}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <SecurityScanOutlined className="text-blue-500" />
                                        <div>
                                            <Text className="text-gray-500 text-xs block">
                                                Account Status
                                            </Text>
                                            <Text
                                                className={`font-medium ${isVerified ? "text-green-600" : "text-red-600"}`}
                                            >
                                                {isVerified
                                                    ? "Verified"
                                                    : "Unverified"}
                                            </Text>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Card>

                {/* Profile Content */}
                <Card className="shadow-md rounded-lg border-0">
                    {editMode ? (
                        <div className="px-6 py-4">
                            <div className="flex justify-between items-center mb-6">
                                <Title level={4}>Edit Profile</Title>
                                <Button
                                    onClick={() => setEditMode(false)}
                                    className="text-gray-500"
                                >
                                    Cancel
                                </Button>
                            </div>
                            <Form
                                form={profileForm}
                                layout="vertical"
                                onFinish={handleProfileUpdate}
                                className="max-w-lg"
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
                                        prefix={
                                            <UserOutlined className="text-gray-400" />
                                        }
                                        placeholder="Username"
                                        size="large"
                                    />
                                </Form.Item>

                                <Form.Item label="Email">
                                    <Input
                                        prefix={
                                            <MailOutlined className="text-gray-400" />
                                        }
                                        value={user?.email}
                                        disabled
                                        className="bg-gray-100 text-gray-500"
                                        size="large"
                                    />
                                    <Text
                                        type="secondary"
                                        className="text-xs mt-1 block"
                                    >
                                        Email cannot be changed for security
                                        reasons
                                    </Text>
                                </Form.Item>

                                <Divider />

                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={loading}
                                        icon={<SaveOutlined />}
                                        className="bg-blue-500 mr-2"
                                        size="large"
                                    >
                                        Save Changes
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setEditMode(false);
                                            profileForm.setFieldsValue({
                                                username: user?.username,
                                            });
                                        }}
                                        size="large"
                                    >
                                        Cancel
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    ) : (
                        <Tabs defaultActiveKey="1" onChange={setActiveTab}>
                            <TabPane tab="Account Information" key="1">
                                <div className="p-6">
                                    <div className="max-w-xl mb-8">
                                        <Title level={4} className="mb-4">
                                            Account Details
                                        </Title>
                                        <Row gutter={[24, 16]}>
                                            <Col span={24} md={12}>
                                                <Text
                                                    type="secondary"
                                                    className="block text-sm"
                                                >
                                                    Username
                                                </Text>
                                                <Text className="text-lg">
                                                    {user?.username}
                                                </Text>
                                            </Col>
                                            <Col span={24} md={12}>
                                                <Text
                                                    type="secondary"
                                                    className="block text-sm"
                                                >
                                                    Email Address
                                                </Text>
                                                <div className="flex items-center gap-2">
                                                    <Text className="text-lg">
                                                        {user?.email}
                                                    </Text>
                                                    {isVerified ? (
                                                        <Tooltip title="Email Verified">
                                                            <CheckCircleOutlined className="text-green-500" />
                                                        </Tooltip>
                                                    ) : (
                                                        <Tooltip title="Email Not Verified">
                                                            <ExclamationCircleOutlined className="text-red-500" />
                                                        </Tooltip>
                                                    )}
                                                </div>
                                            </Col>
                                            <Col span={24} md={12}>
                                                <Text
                                                    type="secondary"
                                                    className="block text-sm"
                                                >
                                                    Account Created
                                                </Text>
                                                <Text className="text-lg">
                                                    {user?.createdAt
                                                        ? new Date(
                                                              user.createdAt
                                                          ).toLocaleDateString()
                                                        : "N/A"}
                                                </Text>
                                            </Col>
                                            <Col span={24} md={12}>
                                                <Text
                                                    type="secondary"
                                                    className="block text-sm"
                                                >
                                                    Account Status
                                                </Text>
                                                <Badge
                                                    status={
                                                        isVerified
                                                            ? "success"
                                                            : "error"
                                                    }
                                                    text={
                                                        <Text
                                                            className={
                                                                isVerified
                                                                    ? "text-green-600"
                                                                    : "text-red-600"
                                                            }
                                                        >
                                                            {isVerified
                                                                ? "Verified"
                                                                : "Unverified"}
                                                        </Text>
                                                    }
                                                />
                                            </Col>
                                        </Row>
                                    </div>

                                    <Divider />

                                    <div className="flex justify-between items-center">
                                        <div>
                                            <Title level={4}>
                                                Security Options
                                            </Title>
                                            <Paragraph type="secondary">
                                                Manage your password and account
                                                security
                                            </Paragraph>
                                        </div>
                                        <Button
                                            type="primary"
                                            onClick={() => setActiveTab("2")}
                                            className="bg-blue-500"
                                        >
                                            Change Password
                                        </Button>
                                    </div>
                                </div>
                            </TabPane>

                            <TabPane tab="Change Password" key="2">
                                <div className="p-6">
                                    <Title level={4} className="mb-4">
                                        Change Your Password
                                    </Title>
                                    <Paragraph
                                        type="secondary"
                                        className="mb-6"
                                    >
                                        A secure password helps protect your
                                        account. You'll need to verify with an
                                        OTP sent to your email.
                                    </Paragraph>

                                    <Form
                                        form={passwordForm}
                                        layout="vertical"
                                        onFinish={handlePasswordRequest}
                                        className="max-w-lg"
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
                                                prefix={
                                                    <LockOutlined className="text-gray-400" />
                                                }
                                                placeholder="Current Password"
                                                size="large"
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
                                                prefix={
                                                    <LockOutlined className="text-gray-400" />
                                                }
                                                placeholder="New Password"
                                                size="large"
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
                                                prefix={
                                                    <LockOutlined className="text-gray-400" />
                                                }
                                                placeholder="Confirm New Password"
                                                size="large"
                                            />
                                        </Form.Item>

                                        <Divider />

                                        <Form.Item>
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                                loading={loading}
                                                icon={<LockOutlined />}
                                                className="bg-blue-500"
                                                size="large"
                                            >
                                                Update Password
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                </div>
                            </TabPane>
                        </Tabs>
                    )}
                </Card>

                {/* OTP Verification Modal */}
                <Modal
                    title={
                        <div className="flex items-center gap-2">
                            <SecurityScanOutlined className="text-blue-500 text-xl" />
                            <span>OTP Verification</span>
                        </div>
                    }
                    open={showOtpModal}
                    onCancel={() => setShowOtpModal(false)}
                    footer={null}
                    centered
                    className="rounded-lg overflow-hidden"
                >
                    <Form
                        form={otpForm}
                        layout="vertical"
                        onFinish={handleVerifyOtp}
                    >
                        <div className="bg-blue-50 p-4 rounded-lg mb-6">
                            <div className="flex items-start gap-3">
                                <ClockCircleOutlined className="text-blue-500 text-xl mt-1" />
                                <div>
                                    <Text
                                        strong
                                        className="text-blue-700 block mb-1"
                                    >
                                        {newPasswordData
                                            ? "Security Verification Required"
                                            : "Email Verification"}
                                    </Text>
                                    <Text className="text-gray-600">
                                        {newPasswordData
                                            ? "To complete your password change, please enter the OTP sent to your email."
                                            : "Please enter the verification code sent to your email."}
                                    </Text>
                                </div>
                            </div>
                        </div>

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
                                placeholder="Enter 6-digit OTP"
                                className="text-center text-lg"
                                maxLength={6}
                                size="large"
                            />
                        </Form.Item>

                        <div className="flex justify-between">
                            <Button
                                onClick={() => handleSendOtp()}
                                className="text-gray-500"
                            >
                                Resend OTP
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                className="bg-blue-500"
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
