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
        <div className="p-4 md:p-8 animate-fadeIn">
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                    <KeyOutlined className="text-blue-500" />
                    <span>Password Security</span>
                </h1>
                <p className="text-gray-600 mt-2">
                    A secure password helps protect your account. You'll need to
                    verify any changes with an OTP.
                </p>
            </div>

            <div className="max-w-lg">
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-3 rounded-full">
                                <SafetyCertificateTwoTone className="text-blue-500 text-xl" />
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
                                    label="Current Password"
                                    placeholder="Enter your current password"
                                />
                            </div>

                            <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                                <PasswordFormItem
                                    name="password"
                                    label="New Password"
                                    placeholder="Enter your new password"
                                />
                            </div>

                            <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                                <ConfirmPasswordFormItem />
                            </div>
                        </div>

                        <FormDivider />

                        <Form.Item>
                            <PrimaryButton
                                htmlType="submit"
                                loading={loading}
                                icon={<LockOutlined />}
                                className="bg-blue-600 hover:bg-blue-700 rounded-lg"
                            >
                                Update Password
                            </PrimaryButton>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default PasswordChangeTab;
