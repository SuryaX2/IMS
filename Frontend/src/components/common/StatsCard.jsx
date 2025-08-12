import React from "react";
import { Card, Statistic } from "antd";

const StatsCard = ({ title, value, prefix, color = "#1890ff" }) => {
    return (
        <Card>
            <Statistic
                title={title}
                value={value}
                prefix={prefix}
                valueStyle={{ color }}
            />
        </Card>
    );
};

export default StatsCard;
