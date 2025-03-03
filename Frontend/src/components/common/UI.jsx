import React from "react";
import { Button, Divider } from "antd";

export const GradientCard = ({ children, className }) => {
    return (
        <div
            className={`bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl shadow-lg p-6 border border-indigo-100 hover:shadow-xl transition-all duration-300 ${className || ""}`}
        >
            {children}
        </div>
    );
};

export const PrimaryButton = ({
    children,
    icon,
    loading,
    onClick,
    htmlType = "button",
    className = "",
}) => {
    return (
        <Button
            type="primary"
            htmlType={htmlType}
            loading={loading}
            icon={icon}
            onClick={onClick}
            className={`bg-indigo-600 hover:bg-indigo-700 border-0 rounded-full shadow-lg h-12 px-6 ${className}`}
            size="large"
        >
            {children}
        </Button>
    );
};

export const SecondaryButton = ({
    children,
    icon,
    onClick,
    className = "",
}) => {
    return (
        <Button
            type="default"
            onClick={onClick}
            icon={icon}
            className={`text-indigo-700 hover:text-indigo-800 border-indigo-300 hover:border-indigo-500 rounded-full shadow-md h-12 hover:scale-105 transition-all duration-300 ${className}`}
            size="large"
        >
            {children}
        </Button>
    );
};

export const FormDivider = () => {
    return <Divider className="border-indigo-100" />;
};
