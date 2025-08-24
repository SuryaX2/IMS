import React from "react";
import { Card, Statistic, Row, Col } from "antd";
import {
    UserOutlined,
    ShopOutlined,
    UsergroupAddOutlined,
    ProductOutlined,
} from "@ant-design/icons";
import StatCard from "../dashboard/StatCard";

const SupplierStats = ({ stats }) => {
    return (
        <Row gutter={[16, 16]} className="mb-6">
            <Col xs={24} sm={12} lg={6}>
                <StatCard
                    title="Individual"
                    value={stats.individual}
                    icon={
                        <UserOutlined className="text-xl sm:text-2xl text-purple" />
                    }
                    valueStyle={{ color: "#722ed1" }}
                    className="dashboard-stat-card"
                />
            </Col>
            <Col xs={24} sm={12} lg={6}>
                <StatCard
                    title="Wholesale"
                    value={stats.wholesale}
                    icon={
                        <ProductOutlined className="text-xl sm:text-2xl text-blue" />
                    }
                    valueStyle={{ color: "#1890ff" }}
                    className="dashboard-stat-card"
                />
            </Col>
            <Col xs={24} sm={12} lg={6}>
                <StatCard
                    title="Retail"
                    value={stats.retail}
                    icon={
                        <UsergroupAddOutlined className="text-xl sm:text-2xl text-green" />
                    }
                    valueStyle={{ color: "#52c41a" }}
                    className="dashboard-stat-card"
                />
            </Col>
            <Col xs={24} sm={12} lg={6}>
                <StatCard
                    title="Companies"
                    value={stats.company}
                    icon={
                        <ShopOutlined className="text-xl sm:text-2xl text-orange" />
                    }
                    valueStyle={{ color: "#fa8c16" }}
                    className="dashboard-stat-card"
                />
            </Col>
        </Row>
    );
};

export default SupplierStats;
