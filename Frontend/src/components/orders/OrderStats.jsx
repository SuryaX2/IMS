import React from "react";
import { Card, Row, Col, Statistic } from "antd";
import {
    ShoppingCartOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    DollarOutlined,
} from "@ant-design/icons";

const OrderStats = ({ stats }) => {
    const statsConfig = [
        {
            title: "Total Orders",
            value: stats.total,
            prefix: <ShoppingCartOutlined className="text-blue-600" />,
            color: "#1890ff",
        },
        {
            title: "Pending Orders",
            value: stats.pending,
            prefix: <ClockCircleOutlined className="text-orange-500" />,
            color: "#fa8c16",
        },
        {
            title: "Completed Orders",
            value: stats.completed,
            prefix: <CheckCircleOutlined className="text-green-500" />,
            color: "#52c41a",
        },
        {
            title: "Total Revenue",
            value: stats.revenue,
            prefix: <DollarOutlined className="text-green-600" />,
            color: "#389e0d",
            precision: 2,
        },
    ];

    return (
        <Row gutter={[12, 12]} className="mb-4 sm:mb-6 sm:gutter-16">
            {statsConfig.map((stat, index) => (
                <Col xs={12} sm={12} md={6} key={index}>
                    <Card className="border-0 shadow-md h-full">
                        <Statistic
                            title={
                                <span className="text-xs sm:text-sm text-gray-600">
                                    {stat.title}
                                </span>
                            }
                            value={stat.value}
                            prefix={
                                <span className="text-lg sm:text-xl">
                                    {stat.prefix}
                                </span>
                            }
                            precision={stat.precision}
                            valueStyle={{
                                color: stat.color,
                                fontSize: "18px",
                                fontWeight: "600",
                            }}
                            className="text-center sm:text-left"
                        />
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

export default OrderStats;
