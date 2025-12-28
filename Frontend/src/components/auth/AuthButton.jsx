import React from "react";
import { Button } from "antd";
import PropTypes from "prop-types";

const AuthButton = ({
    children,
    loading = false,
    onClick,
    htmlType = "submit",
    icon,
    ...props
}) => {
    return (
        <Button
            type="primary"
            htmlType={htmlType}
            size="large"
            block
            loading={loading}
            onClick={onClick}
            icon={icon}
            className="h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 border-0 shadow-sm hover:shadow-md transition-all duration-200 font-medium"
            {...props}
        >
            {children}
        </Button>
    );
};

AuthButton.propTypes = {
    children: PropTypes.node.isRequired,
    loading: PropTypes.bool,
    onClick: PropTypes.func,
    htmlType: PropTypes.string,
    icon: PropTypes.node,
};

export default AuthButton;