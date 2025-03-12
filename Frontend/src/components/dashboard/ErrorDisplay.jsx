import React from "react";
import { Result, Button } from "antd";
import { CloseCircleOutlined, ReloadOutlined } from "@ant-design/icons";

const ErrorDisplay = ({ error, onRetry }) => {
    return (
        <Result
            status="error"
            title="Something went wrong"
            subTitle={error || "An error occurred while loading data"}
            icon={<CloseCircleOutlined className="text-red-500" />}
            extra={
                onRetry ? (
                    <Button
                        type="primary"
                        icon={<ReloadOutlined />}
                        onClick={onRetry}
                    >
                        Try Again
                    </Button>
                ) : null
            }
            className="my-8"
        />
    );
};

export default ErrorDisplay;
