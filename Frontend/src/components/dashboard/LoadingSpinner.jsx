import React from "react";
import { Spin } from "antd";

const LoadingSpinner = ({ tip = "Loading..." }) => {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                padding: "100px",
            }}
        >
            <Spin size="large" tip={tip} />
        </div>
    );
};

export default LoadingSpinner;
