import React from "react";
import { Row, Col, Card, Statistic } from "antd";
import {
    ClockCircleOutlined,
    CheckCircleOutlined,
    UndoOutlined,
    ShoppingOutlined,
} from "@ant-design/icons";

const PurchaseStats = ({ stats }) => {
    const statsData = [
        {
            title: "Total Purchases",
            value: stats.total,
            color: "#1890ff",
            bgColor: "bg-blue-50",
            iconColor: "text-blue-500",
            icon: <ShoppingOutlined />,
        },
        {
            title: "Pending",
            value: stats.pending,
            color: "#faad14",
            bgColor: "bg-yellow-50",
            iconColor: "text-yellow-500",
            icon: <ClockCircleOutlined />,
        },
        {
            title: "Completed",
            value: stats.completed,
            color: "#52c41a",
            bgColor: "bg-green-50",
            iconColor: "text-green-500",
            icon: <CheckCircleOutlined />,
        },
        {
            title: "Returned",
            value: stats.returned,
            color: "#ff4d4f",
            bgColor: "bg-red-50",
            iconColor: "text-red-500",
            icon: <UndoOutlined />,
        },
    ];

    return (
        <Row gutter={[16, 16]} className="mb-6">
            {statsData.map((stat, index) => (
                <Col key={index} xs={12} sm={12} md={6} lg={6}>
                    <Card
                        className={`${stat.bgColor} border-0 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer`}
                        body={{ padding: "20px" }}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-gray-600 text-sm mb-1">
                                    {stat.title}
                                </div>
                                <div
                                    className="text-2xl font-bold"
                                    style={{ color: stat.color }}
                                >
                                    {stat.value}
                                </div>
                            </div>
                            <div
                                className={`text-3xl ${stat.iconColor} opacity-80`}
                            >
                                {stat.icon}
                            </div>
                        </div>
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

export default PurchaseStats;
