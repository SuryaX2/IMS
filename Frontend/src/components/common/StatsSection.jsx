import React from "react";
import { Row, Col } from "antd";
import { TagsOutlined, AppstoreOutlined } from "@ant-design/icons";
import StatCard from "../dashboard/StatCard";

const StatsSection = ({ categoryStats, unitStats }) => {
    return (
        <Row gutter={[16, 16]} className="mb-0">
            <Col xs={24} sm={12} lg={6}>
                <StatCard
                    title="Total Categories"
                    value={categoryStats.total}
                    icon={
                        <TagsOutlined className="text-xl sm:text-2xl text-blue" />
                    }
                    valueStyle={{ color: "#1890ff" }}
                    className="dashboard-stat-card"
                />
            </Col>
            <Col xs={24} sm={12} lg={6}>
                <StatCard
                    title="Your Categories"
                    value={categoryStats.mine}
                    icon={
                        <TagsOutlined className="text-xl sm:text-2xl text-green" />
                    }
                    valueStyle={{ color: "#52c41a" }}
                    className="dashboard-stat-card"
                />
            </Col>
            <Col xs={24} sm={12} lg={6}>
                <StatCard
                    title="Total Units"
                    value={unitStats.total}
                    icon={
                        <AppstoreOutlined className="text-xl sm:text-2xl text-purple" />
                    }
                    valueStyle={{ color: "#722ed1" }}
                    className="dashboard-stat-card"
                />
            </Col>
            <Col xs={24} sm={12} lg={6}>
                <StatCard
                    title="Your Units"
                    value={unitStats.mine}
                    icon={
                        <AppstoreOutlined className="text-xl sm:text-2xl text-orange" />
                    }
                    valueStyle={{ color: "#fa8c16" }}
                    className="dashboard-stat-card"
                />
            </Col>
        </Row>
    );
};

export default StatsSection;
