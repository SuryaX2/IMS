import React from "react";
import { Card, Statistic, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

const StatCard = ({
    title,
    value,
    icon,
    prefix,
    suffix,
    precision = 0,
    formatter,
    trend = null, // positive, negative, neutral
    trendValue = null,
    trendIcon = null,
    description = null,
    valueStyle = {},
    className = "",
}) => {
    // Function to determine trend color
    const getTrendColor = () => {
        if (trend === "positive") return "#52c41a";
        if (trend === "negative") return "#f5222d";
        return "#8c8c8c";
    };

    // Get trend indicator text
    const getTrendText = () => {
        if (trendValue === null) return null;
        return `${trendValue > 0 ? "+" : ""}${trendValue}%`;
    };

    return (
        <Card
            className={`rounded-lg border-0 overflow-hidden shadow hover:shadow-md transition-all duration-300 ${className}`}
            bodyStyle={{ padding: "20px 24px" }}
        >
            <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center text-gray-500">
                        <span className="font-medium">{title}</span>
                        {description && (
                            <Tooltip title={description}>
                                <InfoCircleOutlined className="ml-1 text-xs text-gray-400" />
                            </Tooltip>
                        )}
                    </div>
                    {icon && (
                        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary-light bg-opacity-20">
                            {icon}
                        </div>
                    )}
                </div>

                <Statistic
                    value={value}
                    precision={precision}
                    formatter={formatter}
                    prefix={prefix}
                    suffix={suffix}
                    valueStyle={{
                        fontSize: "28px",
                        fontWeight: "bold",
                        ...valueStyle,
                    }}
                />

                {trend && trendValue !== null && (
                    <div className="flex items-center mt-2">
                        {trendIcon}
                        <span
                            style={{
                                color: getTrendColor(),
                                fontWeight: "medium",
                                fontSize: "14px",
                                marginLeft: trendIcon ? "4px" : 0,
                            }}
                        >
                            {getTrendText()}
                        </span>
                        <span className="text-gray-500 text-xs ml-1">
                            vs last period
                        </span>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default StatCard;
