import React from "react";
import { Alert } from "antd";

const ErrorDisplay = ({ error }) => {
    return <Alert message="Error" description={error} type="error" showIcon />;
};

export default ErrorDisplay;
