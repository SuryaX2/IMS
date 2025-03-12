import React from "react";
import { Card, Statistic } from "antd";

const StatCard = ({ title, value, prefix, valueStyle }) => {
    return (
        <Card>
            <Statistic
                title={title}
                value={value || 0}
                prefix={prefix}
                valueStyle={valueStyle || {}}
                precision={title === "Inventory Value" ? 2 : 0}
            />
        </Card>
    );
};

export default StatCard;
