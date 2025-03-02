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
            className="bg-blue-500 hover:bg-blue-900 h-10 rounded-md"
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
