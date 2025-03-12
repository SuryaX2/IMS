import { useState, useEffect, useContext } from "react";
import { Form, Spin, Typography } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthCard from "../../components/auth/AuthCard";
import { OtpInput } from "../../components/auth/FormItems";
import AuthButton from "../../components/auth/AuthButton";
import { api } from "../../api/api";

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
            navigate("/dashboard");
        } else if (user?.isVerified && justVerified) {
            navigate("/dashboard");
        }
    }, [user, navigate, justVerified]);

    // Function to send verification OTP
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

    // Function to verify OTP
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

                // Update user context
                if (setUser) {
                    setUser((prev) => ({ ...prev, isVerified: true }));
                }

                // Redirect to home page after short delay
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

    // Trigger OTP send on component mount if not already sent
    useEffect(() => {
        if (!otpSent && !user?.isVerified) {
            sendVerificationOtp();
        }
    }, []);

    return (
        <AuthLayout>
            <AuthCard
                title="Email Verification"
                subtitle="We've sent a 6-digit code to your email address."
            >
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
                                <OtpInput />

                                <Form.Item>
                                    <AuthButton
                                        loading={verifying}
                                        icon={<CheckCircleOutlined />}
                                    >
                                        Verify Email
                                    </AuthButton>
                                </Form.Item>

                                <div className="flex justify-between mt-4">
                                    <AuthButton
                                        type="link"
                                        onClick={sendVerificationOtp}
                                        disabled={loading}
                                        className="text-blue-500 hover:text-blue-700 font-medium p-0"
                                    >
                                        Resend OTP
                                    </AuthButton>

                                    <AuthButton
                                        type="link"
                                        onClick={() => navigate("/login")}
                                        className="text-blue-500 hover:text-blue-700 font-medium p-0"
                                    >
                                        Back to Login
                                    </AuthButton>
                                </div>
                            </Form>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8">
                                <AuthButton
                                    onClick={() => navigate("/login")}
                                    className="w-1/2"
                                >
                                    Login to continue
                                </AuthButton>
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
            </AuthCard>
        </AuthLayout>
    );
};

export default EmailVerify;
