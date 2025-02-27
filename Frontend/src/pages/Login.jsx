import { useState } from "react";
import { Form, Input, Button, Divider, Row, Col, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import loginImage from "/Inventory-management-system.webp";
import axios from "axios";

const { Title, Text } = Typography;

const Login = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        const { email, password } = values;
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/users/login`,
                values,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.data;

            if (data.success) {
                toast.success(data.message || "Login successful!");
                navigate("/email-verify");
            } else {
                toast.error(data.message || "Login failed");
            }
        } catch (error) {
            console.log(error.response); // Check full response structure
            console.log(error.response.data); // Check data field
            console.log(error.response.data?.message || "No message found");

            const errorMessage = error.response.data.message || "Something went wrong during login";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Row className="min-h-screen bg-gray-100">
            {/* Image Section */}
            <Col xs={0} sm={0} md={12} lg={12} xl={12} className="h-screen">
                <div className="h-full w-full overflow-hidden">
                    <img
                        src={loginImage}
                        alt="Login"
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
                    <div className="text-center mb-6">
                        <h2 className="text-6xl font-bold text-gray-800 tracking-wider mb-6">
                            Login
                        </h2>
                        <p className="text-gray-500 mt-1">
                            Sign in to continue to your account
                        </p>
                    </div>

                    <Form
                        name="login-form"
                        className="w-full"
                        onFinish={onFinish}
                        layout="vertical"
                    >
                        <Form.Item
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your email!",
                                },
                                {
                                    type: "email",
                                    message:
                                        "Please enter a valid email address!",
                                },
                            ]}
                        >
                            <Input
                                prefix={
                                    <UserOutlined className="text-gray-400" />
                                }
                                placeholder="Email"
                                size="large"
                                className="rounded-md py-2 bg-gray-100"
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
                                prefix={
                                    <LockOutlined className="text-gray-400" />
                                }
                                placeholder="Password"
                                size="large"
                                className="rounded-md py-2 bg-gray-100"
                            />
                        </Form.Item>

                        <Form.Item className="mb-2">
                            <div className="flex justify-end">
                                <Link
                                    to="/reset-password"
                                    className="text-blue-500 hover:text-blue-700 font-medium"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                className="w-full h-10 bg-blue-500 hover:bg-blue-900 rounded-md"
                            >
                                Sign In
                            </Button>
                        </Form.Item>

                        <Divider plain>Or</Divider>

                        <div className="text-center mt-4">
                            <span className="text-gray-600">
                                Don't have an account?
                            </span>{" "}
                            <Link
                                to="/signup"
                                className="text-blue-500 hover:text-blue-700 font-medium"
                            >
                                Sign up
                            </Link>
                        </div>
                    </Form>
                </div>
            </Col>
        </Row>
    );
};

export default Login;
