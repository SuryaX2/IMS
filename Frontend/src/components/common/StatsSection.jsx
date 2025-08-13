import React from "react";
import { Row } from "antd";
import { TagsOutlined, AppstoreOutlined } from "@ant-design/icons";
import StatsCard from "./StatsCard";

const StatsSection = ({ categoryStats, unitStats }) => {
    return (
        <Row gutter={[16, 16]} className="mb-6">
            <StatsCard
                title="Total Categories"
                value={categoryStats.total}
                prefix={<TagsOutlined className="text-blue-500" />}
                valueStyle={{ color: "#1890ff" }}
            />
            <StatsCard
                title="Your Categories"
                value={categoryStats.mine}
                prefix={<TagsOutlined className="text-green-500" />}
                valueStyle={{ color: "#52c41a" }}
            />
            <StatsCard
                title="Total Units"
                value={unitStats.total}
                prefix={<AppstoreOutlined className="text-purple-500" />}
                valueStyle={{ color: "#722ed1" }}
            />
            <StatsCard
                title="Your Units"
                value={unitStats.mine}
                prefix={<AppstoreOutlined className="text-orange-500" />}
                valueStyle={{ color: "#fa8c16" }}
            />
        </Row>
    );
};

export default StatsSection;
