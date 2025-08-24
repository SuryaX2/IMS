import React from "react";
import { Card, Row, Col, Statistic } from "antd";
import {
    ShoppingCartOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    DollarOutlined,
} from "@ant-design/icons";
import StatCard from "../dashboard/StatCard";

const OrderStats = ({ stats }) => {
    return (
        <div className="mb-8">
            <Row gutter={[16, 16]} className="mb-4 sm:mb-6 sm:gutter-24">
                <Col xs={24} sm={12} lg={6}>
                    <StatCard
                        title="Total Orders"
                        value={stats.total}
                        icon={
                            <ShoppingCartOutlined className="text-xl sm:text-2xl text-blue" />
                        }
                        valueStyle={{ color: "#1890ff" }}
                        className="dashboard-stat-card"
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StatCard
                        title="Pending Orders"
                        value={stats.pending}
                        icon={
                            <ClockCircleOutlined className="text-xl sm:text-2xl text-orange" />
                        }
                        valueStyle={{ color: "#fa8c16" }}
                        className="dashboard-stat-card"
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StatCard
                        title="Completed Orders"
                        value={stats.completed}
                        icon={
                            <CheckCircleOutlined className="text-xl sm:text-2xl text-green" />
                        }
                        valueStyle={{ color: "#52c41a" }}
                        className="dashboard-stat-card"
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StatCard
                        title="Total Revenue"
                        value={stats.revenue}
                        icon={
                            <DollarOutlined className="text-xl sm:text-2xl text-green" />
                        }
                        valueStyle={{ color: "#389e0d" }}
                        className="dashboard-stat-card"
                        formatter={(value) => `₹${value.toLocaleString()}`}
                        lg
                        precision={2}
                    />
                </Col>
            </Row>
        </div>
    );
};

export default OrderStats;
