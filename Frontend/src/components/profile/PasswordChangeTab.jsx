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
            <h1 className="mb-2 text-2xl md:text-3xl font-bold text-indigo-800 flex items-center">
                <KeyOutlined className="mr-2 text-indigo-600" />
                <span>Change Your Password</span>
            </h1>
            <p className="mb-6 text-gray-600">
                A secure password helps protect your account. You'll need to
                verify with an OTP sent to your email.
            </p>

            <GradientCard className="max-w-lg">
                <div className="bg-indigo-100 p-4 rounded-xl mb-6 border-l-4 border-indigo-500 flex items-start gap-3">
                    <SafetyCertificateTwoTone className="text-indigo-600 text-xl mt-1" />
                    <Text className="text-indigo-700">
                        For security reasons, you'll need to enter your current
                        password and verify with a one-time code sent to your
                        email.
                    </Text>
                </div>

                <Form
                    form={passwordForm}
                    layout="vertical"
                    onFinish={handlePasswordRequest}
                >
                    <PasswordFormItem
                        name="oldPassword"
                        label="Current Password"
                        placeholder="Current Password"
                    />
                    <PasswordFormItem
                        name="password"
                        label="New Password"
                        placeholder="New Password"
                    />
                    <ConfirmPasswordFormItem />

                    <FormDivider />

                    <Form.Item>
                        <PrimaryButton
                            htmlType="submit"
                            loading={loading}
                            icon={<LockOutlined />}
                        >
                            Update Password
                        </PrimaryButton>
                    </Form.Item>
                </Form>
            </GradientCard>
        </div>
    );
};

export default PasswordChangeTab;
