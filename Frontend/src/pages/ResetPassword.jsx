import React, { useState } from "react";
import { Card, Form, Input, Button, Steps, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/api.js";
import { KeyOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";

const { Step } = Steps;

const ResetPassword = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const navigate = useNavigate();

    const handleSendOTP = async () => {
        if (!email) {
            message.error("Please enter your email address");
            return;
        }

        try {
            setLoading(true);
            const response = await api.post("/users/send-reset-otp", { email });

            if (response.data.success) {
                message.success("OTP sent to your email");
                setOtpSent(true);
                setCurrentStep(1);
            } else {
                message.error(response.data.message || "Failed to send OTP");
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || "Something went wrong";
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!otp) {
            message.error("Please enter the OTP");
            return;
        }

        if (!newPassword) {
            message.error("Please enter a new password");
            return;
        }

        if (newPassword !== confirmPassword) {
            message.error("Passwords do not match");
            return;
        }

        try {
            setLoading(true);
            const response = await api.post("/users/reset-password", {
                email,
                otp,
                newPassword,
            });

            if (response.data.success) {
                message.success("Password reset successfully");
                navigate("/login");
            } else {
                message.error(
                    response.data.message || "Failed to reset password"
                );
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || "Something went wrong";
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        {
            title: "Email",
            content: (
                <Form layout="vertical">
                    <Form.Item
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: "Please input your email!",
                            },
                            {
                                type: "email",
                                message: "Please enter a valid email address!",
                            },
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined className="text-gray-400" />}
                            type="email"
                            placeholder="Enter your email"
                            size="large"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="rounded-md py-2 bg-gray-100"
                        />
                    </Form.Item>
                    <Button
                        type="primary"
                        onClick={handleSendOTP}
                        loading={loading}
                        className="w-full h-10 bg-blue-500 hover:bg-blue-900 rounded-md"
                        block
                    >
                        Send OTP
                    </Button>
                </Form>
            ),
        },
        {
            title: "Verify",
            content: (
                <Form layout="vertical">
                    <Form.Item
                        name="otp"
                        rules={[
                            {
                                required: true,
                                message: "Please enter the OTP",
                            },
                            {
                                len: 6,
                                message: "OTP must be 6 digits",
                            },
                            {
                                pattern: /^\d+$/,
                                message: "OTP must contain only numbers",
                            },
                        ]}
                    >
                        <Input
                            prefix={<KeyOutlined className="text-gray-400" />}
                            placeholder="Enter OTP"
                            value={otp}
                            size="large"
                            onChange={(e) => setOtp(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "Please input your password!",
                            },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="text-gray-400" />}
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            size="large"
                        />
                    </Form.Item>
                    <Form.Item
                        name="confirm password"
                        rules={[
                            {
                                required: true,
                                message: "Please input your password!",
                            },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="text-gray-400" />}
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            size="large"
                        />
                    </Form.Item>
                    <Button
                        type="primary"
                        onClick={handleResetPassword}
                        loading={loading}
                        block
                        className="w-full h-10 bg-blue-500 hover:bg-blue-900 rounded-md"
                    >
                        Reset Password
                    </Button>
                </Form>
            ),
        },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Image section - half of screen */}
            <div className="hidden md:flex md:w-1/2 justify-center items-center relative">
                <img
                    src="/Inventory-management-system.webp"
                    alt="Forgot Password"
                    className="object-contain h-full w-full"
                />
            </div>

            {/* Form section - half of screen */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-6">
                <Card
                    className="w-full max-w-md rounded-lg bg-gray-100"
                    variant={false}
                >
                    <div className="text-center mb-8">
                        <h2
                            level={2}
                            className="text-5xl font-bold text-gray-800 tracking-wider mb-6"
                        >
                            Reset Password
                        </h2>
                        <p className="text-gray-500 mt-1">
                            {otpSent
                                ? "Enter the OTP sent to your email"
                                : "Enter your email to reset password"}
                        </p>
                    </div>

                    <Steps current={currentStep} className="mb-8">
                        {steps.map((item) => (
                            <Step key={item.title} title={item.title} />
                        ))}
                    </Steps>
                    <div>{steps[currentStep].content}</div>
                    {currentStep === 1 && (
                        <div className="mt-4 text-center">
                            <Button
                                type="link"
                                onClick={handleSendOTP}
                                disabled={loading}
                            >
                                Resend OTP
                            </Button>
                        </div>
                    )}
                    <div className="text-center mt-4">
                        <span className="text-gray-600">
                            Remember your password?{" "}
                        </span>{" "}
                        <Link
                            to="/login"
                            className="text-blue-500 hover:text-blue-700 font-medium"
                        >
                            Log in
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ResetPassword;
