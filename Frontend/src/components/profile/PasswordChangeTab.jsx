import React from "react";
import { Form, Typography } from "antd";
import {
    LockOutlined,
    KeyOutlined,
    SafetyCertificateTwoTone,
} from "@ant-design/icons";
import { FormDivider, PrimaryButton, GradientCard } from "../common/UI";
import { ConfirmPasswordFormItem, PasswordFormItem } from "../common/FormItems";

const { Text } = Typography;

const PasswordChangeTab = ({
    passwordForm,
    handlePasswordRequest,
    loading,
}) => {
    return (
        <div className="animate-fadeIn">
            {/* Background Header with Gradient */}
            <div
                className="h-36 lg:h-56 w-full relative overflow-hidden rounded-t-2xl"
                style={{
                    background:
                        "linear-gradient(135deg, #2563eb 0%, #4f46e5 35%, #7c3aed 70%, #6366f1 100%)",
                }}
            >
                <div className="absolute inset-0 flex items-center px-8">
                    <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm flex items-center justify-center shadow-lg">
                        <KeyOutlined className="text-white text-xl" />
                    </div>
                    <div className="ml-4">
                        <h1 className="text-2xl md:text-3xl font-bold text-white m-0">
                            Password Security
                        </h1>
                        <Text className="text-white/80">
                            Secure your account with a strong password
                        </Text>
                    </div>
                </div>
                <svg
                    className="absolute bottom-0 left-0 w-full"
                    viewBox="0 0 1440 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M0 50L60 45.7C120 41.3 240 32.7 360 30.8C480 29 600 34 720 38.3C840 42.7 960 46.3 1080 43.3C1200 40.3 1320 30.7 1380 25.8L1440 21V101H1380C1320 101 1200 101 1080 101C960 101 840 101 720 101C600 101 480 101 360 101C240 101 120 101 60 101H0V50Z"
                        fill="white"
                    />
                </svg>
            </div>

            <div className="px-4 md:px-8 pb-8 pt-6">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-full shadow-md">
                                    <SafetyCertificateTwoTone
                                        className="text-white text-xl"
                                        twoToneColor="#ffffff"
                                    />
                                </div>
                                <div>
                                    <Text className="text-lg font-medium text-gray-800">
                                        Update Password
                                    </Text>
                                    <Text className="text-gray-500 block">
                                        Change your current password
                                    </Text>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-xl mb-6 border-l-4 border-blue-500 flex items-start gap-3">
                            <SafetyCertificateTwoTone
                                twoToneColor="#3B82F6"
                                className="text-xl mt-1"
                            />
                            <Text className="text-blue-700">
                                For security reasons, you'll need to enter your
                                current password and verify with a one-time code
                                sent to your email.
                            </Text>
                        </div>

                        <Form
                            form={passwordForm}
                            layout="vertical"
                            onFinish={handlePasswordRequest}
                        >
                            <div className="space-y-4">
                                <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                                    <PasswordFormItem
                                        name="oldPassword"
                                        label={
                                            <div className="flex items-center gap-2">
                                                <div className="bg-blue-100 p-2 rounded-full flex items-center justify-center">
                                                    <LockOutlined className="text-blue-500 text-lg" />
                                                </div>
                                                <span>Current Password</span>
                                            </div>
                                        }
                                        placeholder="Enter your current password"
                                    />
                                </div>

                                <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                                    <PasswordFormItem
                                        name="password"
                                        label={
                                            <div className="flex items-center gap-2">
                                                <div className="bg-green-100 p-2 rounded-full flex items-center justify-center">
                                                    <LockOutlined className="text-green-500 text-lg" />
                                                </div>
                                                <span>New Password</span>
                                            </div>
                                        }
                                        placeholder="Enter your new password"
                                    />
                                </div>

                                <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                                    <ConfirmPasswordFormItem
                                        label={
                                            <div className="flex items-center gap-2">
                                                <div className="bg-green-100 p-2 rounded-full flex items-center justify-center">
                                                    <LockOutlined className="text-green-500 text-lg" />
                                                </div>
                                                <span>
                                                    Confirm New Password
                                                </span>
                                            </div>
                                        }
                                    />
                                </div>
                            </div>

                            <FormDivider />

                            <Form.Item>
                                <PrimaryButton
                                    htmlType="submit"
                                    loading={loading}
                                    icon={<LockOutlined />}
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
                                >
                                    Update Password
                                </PrimaryButton>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PasswordChangeTab;
