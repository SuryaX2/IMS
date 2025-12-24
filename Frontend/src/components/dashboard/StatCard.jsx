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
    trend = null,
    trendValue = null,
    trendIcon = null,
    description = null,
    valueStyle = {},
    className = "",
}) => {
    const getTrendColor = () => {
        if (trend === "positive") return "#10b981";
        if (trend === "negative") return "#ef4444";
        return "#6b7280";
    };

    const getTrendText = () => {
        if (trendValue === null) return null;
        return `${trendValue > 0 ? "+" : ""}${trendValue}%`;
    };

    return (
        <Card
            className={`border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 ${className}`}
            bodyStyle={{ padding: 0 }}
            styles={{ body: { padding: 0 } }}
        >
            <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                        <span className="text-sm font-medium text-gray-600 truncate">
                            {title}
                        </span>
                        {description && (
                            <Tooltip title={description}>
                                <InfoCircleOutlined className="text-xs text-gray-400 flex-shrink-0" />
                            </Tooltip>
                        )}
                    </div>
                    {icon && (
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex-shrink-0">
                            <span className="text-blue-600 text-lg">
                                {icon}
                            </span>
                        </div>
                    )}
                </div>

                <div className="mb-3">
                    <Statistic
                        value={value}
                        precision={precision}
                        formatter={formatter}
                        prefix={prefix}
                        suffix={suffix}
                        valueStyle={{
                            fontSize: "32px",
                            fontWeight: "700",
                            color: "#111827",
                            lineHeight: "1.2",
                            ...valueStyle,
                        }}
                    />
                </div>

                {trend && trendValue !== null && (
                    <div className="flex items-center gap-1">
                        {trendIcon && (
                            <span className="flex-shrink-0">{trendIcon}</span>
                        )}
                        <span
                            className="text-sm font-semibold"
                            style={{ color: getTrendColor() }}
                        >
                            {getTrendText()}
                        </span>
                        <span className="text-xs text-gray-500 ml-0.5">
                            vs last period
                        </span>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default StatCard;
