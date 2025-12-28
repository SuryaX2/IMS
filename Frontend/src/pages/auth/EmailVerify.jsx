import { useState, useEffect, useContext } from "react";
import { Form, Spin, Typography } from "antd";
import {
    CheckCircleOutlined,
    MailOutlined,
    ArrowLeftOutlined,
} from "@ant-design/icons";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthCard from "../../components/auth/AuthCard";
import { OtpInput } from "../../components/auth/FormItems";
import AuthButton from "../../components/auth/AuthButton";
import { api } from "../../api/api";

const { Text, Title } = Typography;

const EmailVerify = () => {
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [justVerified, setJustVerified] = useState(false);
    const navigate = useNavigate();
    const { user, setUser } = useContext(AuthContext);

    useEffect(() => {
        if (user?.isVerified && !justVerified) {
            toast.success("Your email is already verified!");
            navigate("/dashboard");
        } else if (user?.isVerified && justVerified) {
            navigate("/dashboard");
        }
    }, [user, navigate, justVerified]);

    const sendVerificationOtp = async () => {
        setLoading(true);
        try {
            const response = await api.post(
                `/users/send-verify-otp`,
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

    const onFinish = async (values) => {
        setVerifying(true);
        try {
            const response = await api.post(
                `/users/verify-email`,
                {
                    otp: values.otp,
                },
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

                if (setUser) {
                    setUser((prev) => ({ ...prev, isVerified: true }));
                }

                setTimeout(() => {
                    navigate("/dashboard");
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

    useEffect(() => {
        if (!otpSent && !user?.isVerified) {
            sendVerificationOtp();
        }
    }, []);

    return (
        <AuthLayout>
            <AuthCard
                title={"Verify Your Email"}
                subtitle={"Enter the 6-digit code sent to your email"}
            >
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Spin size="large" />
                        <Text className="mt-4 text-gray-600">
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
                                <div className="mb-8">
                                    <OtpInput />
                                </div>

                                <Form.Item className="mb-6">
                                    <AuthButton
                                        loading={verifying}
                                        icon={<CheckCircleOutlined />}
                                        className="w-full h-11"
                                    >
                                        Verify Email
                                    </AuthButton>
                                </Form.Item>

                                <div className="flex items-center justify-center gap-6 text-sm">
                                    <button
                                        type="button"
                                        onClick={sendVerificationOtp}
                                        disabled={loading}
                                        className="text-blue-600 hover:text-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Resend Code
                                    </button>
                                    <span className="text-gray-300">|</span>
                                    <button
                                        type="button"
                                        onClick={() => navigate("/login")}
                                        className="text-gray-600 hover:text-gray-800 font-medium transition-colors inline-flex items-center gap-1"
                                    >
                                        <ArrowLeftOutlined className="text-xs" />
                                        Back to Login
                                    </button>
                                </div>
                            </Form>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8">
                                <AuthButton
                                    onClick={() => navigate("/login")}
                                    className="w-full max-w-xs h-11"
                                >
                                    Login to Continue
                                </AuthButton>
                            </div>
                        )}
                    </>
                )}

                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                    <Text className="text-sm text-gray-500">
                        Need help?{" "}
                        <a
                            href="mailto:sekharsurya111@gmail.com"
                            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                        >
                            Contact Support
                        </a>
                    </Text>
                </div>
            </AuthCard>
        </AuthLayout>
    );
};

export default EmailVerify;
