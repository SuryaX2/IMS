import React from "react";
import { Spin, Typography } from "antd";

const { Text } = Typography;

const LoadingSpinner = ({ tip = "Loading...", height = "75vh" }) => {
    return (
        <div
            className="flex flex-col items-center justify-center"
            style={{ height }}
        >
            <Spin size="large" />
            <Text className="mt-4 text-gray-500">{tip}</Text>
        </div>
    );
};

export default LoadingSpinner;
