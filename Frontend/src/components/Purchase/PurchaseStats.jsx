import React from "react";
import { Row, Col, Card, Statistic } from "antd";
import {
    ClockCircleOutlined,
    CheckCircleOutlined,
    UndoOutlined,
    ShoppingOutlined,
} from "@ant-design/icons";
import StatCard from "../dashboard/StatCard";

const PurchaseStats = ({ stats }) => {
    const statsData = [
        {
            title: "Purchases",
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
            <Col xs={24} sm={12} md={6}>
                <StatCard
                    title="Purchases"
                    value={stats.total}
                    icon={
                        <ShoppingOutlined className="text-xl sm:text-2xl text-blue" />
                    }
                    valueStyle={{ color: "#1890ff" }}
                    className="dashboard-stat-card"
                />
            </Col>
            <Col xs={24} sm={12} md={6}>
                <StatCard
                    title="Pending"
                    value={stats.pending}
                    icon={
                        <ClockCircleOutlined className="text-xl sm:text-2xl text-yellow" />
                    }
                    valueStyle={{ color: "#faad14" }}
                    className="dashboard-stat-card"
                />
            </Col>
            <Col xs={24} sm={12} md={6}>
                <StatCard
                    title="Completed"
                    value={stats.completed}
                    icon={
                        <CheckCircleOutlined className="text-xl sm:text-2xl text-green" />
                    }
                    valueStyle={{ color: "#52c41a" }}
                    className="dashboard-stat-card"
                />
            </Col>
            <Col xs={24} sm={12} md={6}>
                <StatCard
                    title="Returned"
                    value={stats.returned}
                    icon={
                        <UndoOutlined className="text-xl sm:text-2xl text-red" />
                    }
                    valueStyle={{ color: "#ff4d4f" }}
                    className="dashboard-stat-card"
                />
            </Col>
        </Row>
    );
};

export default PurchaseStats;
