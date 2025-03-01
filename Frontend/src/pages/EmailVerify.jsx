import React, { useState, useEffect, useContext } from "react";
import { Form, Input, Button, Typography, Card, Spin } from "antd";
import { MailOutlined, CheckCircleOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import axios from "axios";

const { Text } = Typography;

const EmailVerify = () => {
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [justVerified, setJustVerified] = useState(false);
    const navigate = useNavigate();
    const { user, setUser } = useContext(AuthContext);

    useEffect(() => {
        // Redirect if user is already verified, but don't show toast if we just verified
        if (user?.isVerified && !justVerified) {
            toast.success("Your email is already verified!");
            navigate("/home");
        } else if (user?.isVerified && justVerified) {
            navigate("/home");
        }
    }, [user, navigate, justVerified]);

    // Function to send verification OTP
    const sendVerificationOtp = async () => {
        setLoading(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/users/send-verify-otp`,
                {},
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = response.data;

            if (data.success) {
                toast.success(data.message);
                setOtpSent(true);
            } else {
                toast.error(data.message || "Failed to send OTP");
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Something went wrong. Please try again."
            );
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Function to verify OTP
    const onFinish = async (values) => {
        setVerifying(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/users/verify-email`,
                { otp: values.otp },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = response.data;

            if (data.success) {
                setJustVerified(true);
                toast.success("Email verified successfully!");

                // Update user context
                if (setUser) {
                    setUser((prev) => ({ ...prev, isVerified: true }));
                }

                // Redirect to home page after short delay
                setTimeout(() => {
                    navigate("/home");
                }, 1500);
            } else {
                toast.error(data.message || "Verification failed");
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Something went wrong. Please try again."
            );
            console.error(error);
        } finally {
            setVerifying(false);
        }
    };

    // Trigger OTP send on component mount if not already sent
    useEffect(() => {
        if (!otpSent && !user?.isVerified) {
            sendVerificationOtp();
        }
    }, []);

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Image section - half of screen */}
            <div className="hidden md:flex md:w-1/2 justify-center items-center relative">
                <img
                    src="/Inventory-management-system.webp"
                    alt="Email verification"
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
                            Email Verification
                        </h2>
                        <p className="text-gray-500 mt-1">
                            We've sent a 6-digit code to your email address.
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-8">
                            <Spin size="large" />
                            <Text className="mt-4">
                                Sending verification code...
                            </Text>
                        </div>
                    ) : (
                        <>
                            {otpSent ? (
                                <Form
                                    name="otp-verification"
                                    onFinish={onFinish}
                                    layout="vertical"
                                >
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
                                                message:
                                                    "OTP must contain only numbers",
                                            },
                                        ]}
                                    >
                                        <Input
                                            size="large"
                                            placeholder="Enter 6-digit OTP"
                                            prefix={
                                                <MailOutlined className="text-gray-400" />
                                            }
                                            className="py-2 bg-gray-100"
                                            maxLength={6}
                                        />
                                    </Form.Item>

                                    <Form.Item>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            size="large"
                                            block
                                            icon={<CheckCircleOutlined />}
                                            loading={verifying}
                                            className="bg-blue-500 hover:bg-blue-900"
                                        >
                                            Verify Email
                                        </Button>
                                    </Form.Item>

                                    <div className="flex justify-between mt-4">
                                        <Button
                                            type="link"
                                            onClick={sendVerificationOtp}
                                            disabled={loading}
                                            className="text-blue-500 hover:text-blue-700 font-medium"
                                        >
                                            Resend OTP
                                        </Button>

                                        <Button
                                            type="link"
                                            onClick={() => navigate("/login")}
                                            className="text-blue-500 hover:text-blue-700 font-medium"
                                        >
                                            Back to Login
                                        </Button>
                                    </div>
                                </Form>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8">
                                    <Button
                                        type="primary"
                                        size="large"
                                        onClick={() => navigate("/login")}
                                        className="bg-blue-500 hover:bg-blue-900 w-1/2"
                                    >
                                        Login to continue
                                    </Button>
                                </div>
                            )}
                        </>
                    )}

                    <div className="mt-6 text-center">
                        <span className="text-sm">
                            Having trouble?{" "}
                            <a
                                href="mailto:sekharsurya111@gmail.com"
                                className="text-blue-500 hover:text-blue-700 font-medium"
                            >
                                Contact Support
                            </a>
                        </span>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default EmailVerify;
