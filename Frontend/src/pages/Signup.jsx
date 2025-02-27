import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import AvatarUpload from "../components/AvatarUpload";

const Signup = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [avatarFile, setAvatarFile] = useState(null);
    const navigate = useNavigate();

    const handleAvatarChange = (info) => {
        if (info.file.status === "done") {
            setAvatarFile(info.file.originFileObj);
        }
    };

    const onFinish = async (values) => {
        if (!avatarFile) {
            toast.error("Please upload an avatar");
            return;
        }

        try {
            setLoading(true);

            // Create FormData for file upload
            const formData = new FormData();
            formData.append("username", values.username);
            formData.append("email", values.email);
            formData.append("password", values.password);
            formData.append("avatar", avatarFile);

            // Send the form data to the backend
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/users/register`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            
            if (response.success) {
                toast.success(
                    "Your account has been created successfully. Please check your email for confirmation."
              );
              navigate("/login");
            }
        } catch (error) {
            console.log(error);

            const errorMessage =
                error.response?.message ||
                "Something went wrong during signup";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full bg-gray-50">
            {/* Left half - Signup Image */}
            <div
                className="hidden md:block md:w-1/2 bg-cover bg-center"
                style={{
                    backgroundImage: 'url("/Inventory-management-system.webp")',
                    backgroundSize: "contain",
                }}
            ></div>

            {/* Right half - Signup Form */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-sm">
                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-bold text-gray-800">
                            Create Your Account
                        </h2>
                        <p className="text-gray-500 mt-1">
                            Join our platform and get started
                        </p>
                    </div>

                    <Form
                        form={form}
                        name="signup_form"
                        onFinish={onFinish}
                        layout="vertical"
                        requiredMark={false}
                        className="w-full"
                    >
                        <div className="w-32 mx-auto">
                            <AvatarUpload onChange={handleAvatarChange} />
                        </div>

                        <Form.Item
                            name="username"
                            label="Username"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter your username",
                                },
                                {
                                    min: 3,
                                    message:
                                        "Username must be at least 3 characters",
                                },
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined />}
                                placeholder="Username"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter your email",
                                },
                                {
                                    type: "email",
                                    message: "Please enter a valid email",
                                },
                            ]}
                        >
                            <Input
                                prefix={<MailOutlined />}
                                placeholder="Email"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter your password",
                                },
                                {
                                    min: 6,
                                    message:
                                        "Password must be at least 6 characters",
                                },
                            ]}
                            hasFeedback
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Password"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item className="mt-6">
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                block
                                loading={loading}
                                className="h-10"
                            >
                                Sign Up
                            </Button>
                        </Form.Item>
                    </Form>

                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="px-3 bg-white text-gray-500 text-sm">
                                Or
                            </span>
                        </div>
                    </div>

                    <div className="text-center mt-4">
                        <span className="text-gray-600">
                            Already have an account?
                        </span>
                        <button
                            onClick={() => navigate("/login")}
                            className="text-blue-600 font-medium px-2 hover:text-blue-800"
                        >
                            Log in
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
