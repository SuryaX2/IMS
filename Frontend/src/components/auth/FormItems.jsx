import React from "react";
import { Form, Input } from "antd";
import {
    UserOutlined,
    LockOutlined,
    MailOutlined,
    KeyOutlined,
} from "@ant-design/icons";
import PropTypes from "prop-types";

export const EmailInput = ({ name = "email", required = true, ...props }) => (
    <Form.Item
        name={name}
        rules={[
            {
                required,
                message: "Please input your email!",
            },
            {
                type: "email",
                message: "Please enter a valid email address!",
            },
        ]}
        {...props}
    >
        <Input
            prefix={<MailOutlined className="text-slate-400" />}
            placeholder="Email"
            size="large"
            className="rounded-xl border-slate-200 hover:border-indigo-400 focus:border-indigo-500 bg-white transition-colors"
        />
    </Form.Item>
);

export const PasswordInput = ({
    name = "password",
    placeholder = "Password",
    required = true,
    hasFeedback = false,
    ...props
}) => (
    <Form.Item
        name={name}
        rules={[
            {
                required,
                message: "Please input your password!",
            },
            {
                min: 6,
                message: "Password must be at least 6 characters",
            },
        ]}
        hasFeedback={hasFeedback}
        {...props}
    >
        <Input.Password
            prefix={<LockOutlined className="text-slate-400" />}
            placeholder={placeholder}
            size="large"
            className="rounded-xl border-slate-200 hover:border-indigo-400 focus:border-indigo-500 bg-white transition-colors"
        />
    </Form.Item>
);

export const UsernameInput = ({
    name = "username",
    required = true,
    ...props
}) => (
    <Form.Item
        name={name}
        rules={[
            {
                required,
                message: "Please enter your username",
            },
            {
                min: 3,
                message: "Username must be at least 3 characters",
            },
        ]}
        {...props}
    >
        <Input
            prefix={<UserOutlined className="text-slate-400" />}
            placeholder="Username"
            size="large"
            className="rounded-xl border-slate-200 hover:border-indigo-400 focus:border-indigo-500 bg-white transition-colors"
        />
    </Form.Item>
);

export const OtpInput = ({ name = "otp", required = true, ...props }) => (
    <Form.Item
        name={name}
        rules={[
            {
                required,
                message: "Please enter the OTP",
            },
            {
                len: 6,
                message: "OTP must be 6 digits",
            },
            {
                pattern: /^\d+$/,
                message: "OTP must contain only numbers",
            },
        ]}
        {...props}
    >
        <Input
            prefix={<KeyOutlined className="text-slate-400" />}
            placeholder="Enter 6-digit OTP"
            size="large"
            className="rounded-xl border-slate-200 hover:border-indigo-400 focus:border-indigo-500 bg-white transition-colors"
            maxLength={6}
        />
    </Form.Item>
);

const inputPropTypes = {
    name: PropTypes.string,
    required: PropTypes.bool,
};

EmailInput.propTypes = inputPropTypes;

PasswordInput.propTypes = {
    ...inputPropTypes,
    placeholder: PropTypes.string,
    hasFeedback: PropTypes.bool,
};

UsernameInput.propTypes = inputPropTypes;

OtpInput.propTypes = inputPropTypes;