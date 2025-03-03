import React from "react";
import { Form, Input } from "antd";
import { LockOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";

export const UsernameFormItem = ({
    required = true,
    disabled = false,
    value,
}) => {
    return (
        <Form.Item
            label={
                <span className="text-indigo-700 font-medium">Username</span>
            }
            name="username"
            rules={
                required
                    ? [
                          {
                              required: true,
                              message: "Please input your username!",
                          },
                      ]
                    : []
            }
        >
            <Input
                prefix={<UserOutlined className="text-indigo-400" />}
                placeholder="Username"
                size="large"
                className="rounded-lg h-12"
                disabled={disabled}
                value={value}
            />
        </Form.Item>
    );
};

export const EmailFormItem = ({ disabled = true, value }) => {
    return (
        <Form.Item
            label={<span className="text-indigo-700 font-medium">Email</span>}
        >
            <Input
                prefix={<MailOutlined className="text-indigo-400" />}
                value={value}
                disabled={disabled}
                className="bg-gray-50 text-gray-500 rounded-lg h-12"
                size="large"
            />
        </Form.Item>
    );
};

export const PasswordFormItem = ({
    name,
    label,
    placeholder,
    required = true,
}) => {
    return (
        <Form.Item
            label={<span className="text-indigo-700 font-medium">{label}</span>}
            name={name}
            rules={[
                {
                    required: required,
                    message: `Please input your ${label.toLowerCase()}!`,
                },
                name === "password" && {
                    min: 6,
                    message: "Password must be at least 6 characters",
                },
            ].filter(Boolean)}
        >
            <Input.Password
                prefix={<LockOutlined className="text-indigo-400" />}
                placeholder={placeholder}
                size="large"
                className="rounded-lg h-12"
            />
        </Form.Item>
    );
};

export const ConfirmPasswordFormItem = () => {
    return (
        <Form.Item
            label={
                <span className="text-indigo-700 font-medium">
                    Confirm New Password
                </span>
            }
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
                {
                    required: true,
                    message: "Please confirm your new password!",
                },
                ({ getFieldValue }) => ({
                    validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                            return Promise.resolve();
                        }
                        return Promise.reject(
                            new Error("The two passwords do not match!")
                        );
                    },
                }),
            ]}
        >
            <Input.Password
                prefix={<LockOutlined className="text-indigo-400" />}
                placeholder="Confirm New Password"
                size="large"
                className="rounded-lg h-12"
            />
        </Form.Item>
    );
};
