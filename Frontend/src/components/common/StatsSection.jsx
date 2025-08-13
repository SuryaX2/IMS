import React from "react";
import { Row } from "antd";
import { TagsOutlined, AppstoreOutlined } from "@ant-design/icons";
import StatsCard from "./StatsCard";

const StatsSection = ({ categoryStats, unitStats }) => {
    return (
        <Row gutter={[16, 16]} className="mb-0">
            <StatsCard
                title="Total Categories"
                value={categoryStats.total}
                prefix={<TagsOutlined className="text-blue-500" />}
                valueStyle={{ color: "#1890ff" }}
                gradient="from-blue-50 to-blue-100/50"
                borderColor="border-blue-200"
            />
            <StatsCard
                title="Your Categories"
                value={categoryStats.mine}
                prefix={<TagsOutlined className="text-green-500" />}
                valueStyle={{ color: "#52c41a" }}
                gradient="from-green-50 to-green-100/50"
                borderColor="border-green-200"
            />
            <StatsCard
                title="Total Units"
                value={unitStats.total}
                prefix={<AppstoreOutlined className="text-purple-500" />}
                valueStyle={{ color: "#722ed1" }}
                gradient="from-purple-50 to-purple-100/50"
                borderColor="border-purple-200"
            />
            <StatsCard
                title="Your Units"
                value={unitStats.mine}
                prefix={<AppstoreOutlined className="text-orange-500" />}
                valueStyle={{ color: "#fa8c16" }}
                gradient="from-orange-50 to-orange-100/50"
                borderColor="border-orange-200"
            />
        </Row>
    );
};

export default StatsSection;
