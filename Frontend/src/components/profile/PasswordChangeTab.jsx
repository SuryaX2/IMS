import React from "react";
import { Form, Input, Button, Divider, Typography } from "antd";
import { LockOutlined } from "@ant-design/icons";

const { Text } = Typography;

const PasswordChangeTab = ({
    passwordForm,
    handlePasswordRequest,
    loading,
}) => {
    return (
        <div className="p-6">
            <h1 className="mb-4 text-3xl font-bold text-indigo-800">
                Change Your Password
            </h1>
            <p className="mb-6 text-gray-600">
                A secure password helps protect your account. You'll need to
                verify with an OTP sent to your email.
            </p>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 max-w-lg">
                <Form
                    form={passwordForm}
                    layout="vertical"
                    onFinish={handlePasswordRequest}
                >
                    <Form.Item
                        label="Current Password"
                        name="oldPassword"
                        rules={[
                            {
                                required: true,
                                message: "Please input your current password!",
                            },
                        ]}
                    >
                        <Input.Password
                            prefix={
                                <LockOutlined className="text-indigo-400" />
                            }
                            placeholder="Current Password"
                            size="large"
                            className="rounded-lg"
                        />
                    </Form.Item>

                    <Form.Item
                        label="New Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "Please input your new password!",
                            },
                            {
                                min: 6,
                                message:
                                    "Password must be at least 6 characters",
                            },
                        ]}
                    >
                        <Input.Password
                            prefix={
                                <LockOutlined className="text-indigo-400" />
                            }
                            placeholder="New Password"
                            size="large"
                            className="rounded-lg"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Confirm New Password"
                        name="confirmPassword"
                        dependencies={["password"]}
                        rules={[
                            {
                                required: true,
                                message: "Please confirm your new password!",
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (
                                        !value ||
                                        getFieldValue("password") === value
                                    ) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(
                                        new Error(
                                            "The two passwords do not match!"
                                        )
                                    );
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            prefix={
                                <LockOutlined className="text-indigo-400" />
                            }
                            placeholder="Confirm New Password"
                            size="large"
                            className="rounded-lg"
                        />
                    </Form.Item>

                    <Divider />

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            icon={<LockOutlined />}
                            className="bg-indigo-600 hover:bg-indigo-700 border-0 rounded-lg shadow"
                            size="large"
                        >
                            Update Password
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default PasswordChangeTab;
