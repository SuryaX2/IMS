import React from "react";
import { Form, Typography } from "antd";
import {
    LockOutlined,
    KeyOutlined,
    SafetyCertificateOutlined,
    CheckCircleOutlined,
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
        <div className="animate-fadeIn w-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12">
            <div className="max-w-6xl mx-auto w-full">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
                    <div className="lg:col-span-2 w-full">
                        <div className="lg:sticky lg:top-8 w-full">
                            <div className="flex items-center gap-3 mb-3 sm:mb-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
                                    <KeyOutlined className="text-white text-lg sm:text-xl" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 m-0 truncate">
                                        Password Security
                                    </h1>
                                </div>
                            </div>
                            <Text className="text-sm sm:text-base text-gray-600 block mb-6 sm:mb-8">
                                Strengthen your account security by updating
                                your password regularly
                            </Text>

                            <div className="space-y-3 sm:space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <CheckCircleOutlined className="text-green-600 text-sm" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <Text className="text-sm font-medium text-gray-900 block mb-1">
                                            Strong Password
                                        </Text>
                                        <Text className="text-xs sm:text-sm text-gray-600">
                                            Use at least 8 characters with a mix
                                            of letters, numbers, and symbols
                                        </Text>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <SafetyCertificateOutlined className="text-blue-600 text-sm" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <Text className="text-sm font-medium text-gray-900 block mb-1">
                                            Email Verification
                                        </Text>
                                        <Text className="text-xs sm:text-sm text-gray-600">
                                            We'll send a one-time code to your
                                            email for additional security
                                        </Text>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <LockOutlined className="text-purple-600 text-sm" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <Text className="text-sm font-medium text-gray-900 block mb-1">
                                            Secure Process
                                        </Text>
                                        <Text className="text-xs sm:text-sm text-gray-600">
                                            Your current password is required to
                                            authorize this change
                                        </Text>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-3 w-full">
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden w-full">
                            <div className="bg-gradient-to-r from-slate-50 to-blue-50/50 px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100">
                                <Text className="text-base sm:text-lg font-semibold text-gray-900 block">
                                    Update Your Password
                                </Text>
                                <Text className="text-xs sm:text-sm text-gray-600 block mt-1">
                                    Enter your current and new password below
                                </Text>
                            </div>

                            <div className="p-4 sm:p-6 md:p-8 w-full">
                                <Form
                                    form={passwordForm}
                                    layout="vertical"
                                    onFinish={handlePasswordRequest}
                                >
                                    <div className="space-y-5 sm:space-y-6">
                                        <div className="bg-slate-50 rounded-lg sm:rounded-xl p-4 sm:p-5 border border-slate-200 w-full">
                                            <div className="flex items-center gap-2 mb-3 sm:mb-4">
                                                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-slate-200 flex items-center justify-center flex-shrink-0">
                                                    <LockOutlined className="text-slate-600 text-xs" />
                                                </div>
                                                <Text className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                                    Current Authentication
                                                </Text>
                                            </div>
                                            <PasswordFormItem
                                                name="oldPassword"
                                                label={
                                                    <span className="text-sm font-medium text-gray-700">
                                                        Current Password
                                                    </span>
                                                }
                                                placeholder="Enter your current password"
                                            />
                                        </div>

                                        <div className="relative">
                                            <div className="absolute left-1/2 -translate-x-1/2 -top-3 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm z-10">
                                                <Text className="text-xs font-medium text-gray-500 whitespace-nowrap">
                                                    New Credentials
                                                </Text>
                                            </div>
                                        </div>

                                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl p-4 sm:p-5 border border-blue-200 w-full">
                                            <div className="flex items-center gap-2 mb-3 sm:mb-4">
                                                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-blue-200 flex items-center justify-center flex-shrink-0">
                                                    <KeyOutlined className="text-blue-700 text-xs" />
                                                </div>
                                                <Text className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
                                                    New Password Setup
                                                </Text>
                                            </div>

                                            <div className="space-y-4">
                                                <PasswordFormItem
                                                    name="password"
                                                    label={
                                                        <span className="text-sm font-medium text-gray-700">
                                                            New Password
                                                        </span>
                                                    }
                                                    placeholder="Create a strong password"
                                                />

                                                <ConfirmPasswordFormItem
                                                    label={
                                                        <span className="text-sm font-medium text-gray-700">
                                                            Confirm New Password
                                                        </span>
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div className="bg-amber-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-amber-200 flex items-start gap-2 sm:gap-3">
                                            <SafetyCertificateOutlined className="text-amber-600 text-sm sm:text-base mt-0.5 flex-shrink-0" />
                                            <Text className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                                                After submitting, you'll receive
                                                a verification code via email.
                                                Keep this tab open to complete
                                                the process.
                                            </Text>
                                        </div>
                                    </div>

                                    <FormDivider />

                                    <Form.Item className="mb-0">
                                        <PrimaryButton
                                            htmlType="submit"
                                            loading={loading}
                                            icon={<LockOutlined />}
                                            block
                                            size="large"
                                            className="h-11 sm:h-12 text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-shadow w-full"
                                        >
                                            Update Password Securely
                                        </PrimaryButton>
                                    </Form.Item>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PasswordChangeTab;
