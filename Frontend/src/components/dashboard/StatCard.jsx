import React from "react";
import { Card, Statistic } from "antd";

const StatCard = ({
    title,
    value,
    prefix,
    valueStyle,
    className,
    formatter,
    precision = 0,
    icon,
}) => {
    return (
        <Card
            className={`shadow-sm hover:shadow-md transition-shadow ${className}`}
            styles={{ padding: "1.5rem" }}
        >
            <div className="flex items-center justify-between">
                <Statistic
                    title={
                        <span className="text-gray-500 font-medium">
                            {title}
                        </span>
                    }
                    value={value || 0}
                    prefix={prefix}
                    valueStyle={{
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        ...valueStyle,
                    }}
                    precision={precision}
                    formatter={formatter}
                />
                {icon && (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-50">
                        {icon}
                    </div>
                )}
            </div>
        </Card>
    );
};

export default StatCard;
