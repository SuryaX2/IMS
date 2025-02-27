import { useState, useEffect } from "react";
import {
    Form,
    Input,
    Button,
    Typography,
    Result,
    Spin,
    Row,
    Col,
    Divider,
} from "antd";
import { KeyOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import loginImage from "/Inventory-management-system.webp";

const EmailVerify = () => {
    const [loading, setLoading] = useState(false);
    const [sendingOtp, setSendingOtp] = useState(false);
    const [verified, setVerified] = useState(false);
    const [user, setUser] = useState(null);
    const [initialLoading, setInitialLoading] = useState(true);
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_BACKEND_URL;

    // Check if user is authenticated and get user info
    useEffect(() => {
        const checkAuth = async () => {
            try {
                setInitialLoading(true);

                // The cookie will be sent automatically with the request
                const response = await axios.get(
                    `${apiUrl}/users/current-user`,
                    {
                        withCredentials: true, // Important: This ensures cookies are sent with the request
                    }
                );

                if (response.data.success) {
                    setUser(response.data.data);

                    // Update user in localStorage with fresh data
                    localStorage.setItem(
                        "user",
                        JSON.stringify(response.data.data)
                    );

                    // If already verified, redirect to home
                    if (response.data.data.isVerified) {
                        navigate("/home");
                    } else {
                        // Send OTP if not verified
                        sendOtp();
                    }
                }
            } catch (error) {
                console.error("Auth check error:", error);
                // Token might be expired or invalid
                localStorage.removeItem("user");
                navigate("/login");
            } finally {
                setInitialLoading(false);
            }
        };

        checkAuth();
    }, []);

    const sendOtp = async () => {
        try {
            setSendingOtp(true);

            const response = await axios.post(
                `${apiUrl}/users/send-verify-otp`,
                {},
                {
                    withCredentials: true,
                }
            );

            if (response.data.statusCode === 200) {
                toast.success("Verification OTP sent to your email!");
            }
        } catch (error) {
            console.error("Send OTP error:", error);
            if (error.response?.status === 401) {
                // Unauthorized - token expired
                localStorage.removeItem("user");
                navigate("/login");
            } else {
                toast.error(
                    error.response?.data?.message ||
                        "Failed to send OTP. Please try again."
                );
            }
        } finally {
            setSendingOtp(false);
        }
    };

    const verifyEmail = async (values) => {
        try {
            setLoading(true);

            const response = await axios.post(
                `${apiUrl}/users/verify-email`,
                { otp: values.otp },
                {
                    withCredentials: true,
                }
            );

            if (response.data.statusCode === 200) {
                toast.success("Email verified successfully!");
                setVerified(true);

                // Fetch updated user data after verification
                const userResponse = await axios.get(
                    `${apiUrl}/users/current-user`,
                    {
                        withCredentials: true,
                    }
                );

                if (userResponse.data.statusCode === 200) {
                    // Update user in localStorage
                    localStorage.setItem(
                        "user",
                        JSON.stringify(userResponse.data.data)
                    );
                }

                // Redirect to home after 2 seconds
                setTimeout(() => {
                    navigate("/home");
                }, 2000);
            }
        } catch (error) {
            console.error("Verify email error:", error);
            if (error.response?.status === 401) {
                // Unauthorized - token expired
                localStorage.removeItem("user");
                navigate("/login");
            } else {
                toast.error(
                    error.response?.data?.message ||
                        "Failed to verify email. Please try again."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spin size="large" tip="Loading..." />
            </div>
        );
    }

    if (!user) {
        navigate("/login");
        return null;
    }

    return (
        <Row className="min-h-screen bg-gray-100">
            {/* Image Section */}
            <Col xs={0} sm={0} md={12} lg={12} xl={12} className="h-screen">
                <div className="h-full w-full overflow-hidden">
                    <img
                        // Replace with your verification image
                        src={loginImage} // Use your actual image: verifyImage
                        alt="Email Verification"
                        className="w-full h-full object-contain"
                    />
                </div>
            </Col>

            {/* Form Section */}
            <Col
                xs={24}
                sm={24}
                md={12}
                lg={12}
                xl={12}
                className="flex items-center justify-center"
            >
                <div className="w-4/5 max-w-md p-6">
                    {verified ? (
                        <Result
                            icon={
                                <CheckCircleOutlined className="text-green-500" />
                            }
                            title="Email Verified Successfully!"
                            subTitle="Your account is now fully activated. Redirecting to home..."
                            extra={[
                                <Button
                                    type="primary"
                                    onClick={() => navigate("/home")}
                                    className="w-full h-10 bg-blue-500 hover:bg-blue-900 rounded-md"
                                    key="home"
                                >
                                    Go to Home
                                </Button>,
                            ]}
                        />
                    ) : (
                        <>
                            <div className="text-center mb-6">
                                <h2 className="text-6xl font-bold text-gray-800 tracking-wider mb-6">
                                    Verify Email
                                </h2>
                                <p className="text-gray-500 mt-1">
                                    We've sent a verification code to{" "}
                                    {user.email}
                                </p>
                            </div>

                            <Form
                                name="verify_email_form"
                                className="w-full"
                                onFinish={verifyEmail}
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
                                    ]}
                                >
                                    <Input
                                        prefix={
                                            <KeyOutlined className="text-gray-400" />
                                        }
                                        placeholder="Enter 6-digit OTP"
                                        size="large"
                                        className="rounded-md py-2 bg-gray-100"
                                    />
                                </Form.Item>

                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={loading}
                                        className="w-full h-10 bg-blue-500 hover:bg-blue-900 rounded-md"
                                    >
                                        Verify Email
                                    </Button>
                                </Form.Item>

                                <Divider plain>Need help?</Divider>

                                <div className="text-center mt-4">
                                    <span className="text-gray-600">
                                        Didn't receive the code?
                                    </span>{" "}
                                    <Button
                                        type="link"
                                        onClick={sendOtp}
                                        loading={sendingOtp}
                                        className="text-blue-500 hover:text-blue-700 font-medium p-0"
                                    >
                                        Resend OTP
                                    </Button>
                                </div>
                            </Form>
                        </>
                    )}
                </div>
            </Col>
        </Row>
    );
};

export default EmailVerify;
