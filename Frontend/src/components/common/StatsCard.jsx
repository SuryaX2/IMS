import React from "react";
import { Card, Statistic, Col } from "antd";

const StatsCard = ({ title, value, prefix, valueStyle, span = 6 }) => {
    return (
        <Col xs={24} sm={12} md={span}>
            <Card>
                <Statistic
                    title={title}
                    value={value}
                    prefix={prefix}
                    valueStyle={valueStyle}
                />
            </Card>
        </Col>
    );
};

export default StatsCard;
