import React from "react";
import { Card, Row, Col, Statistic } from "antd";
import { UserOutlined } from "@ant-design/icons";

const CustomerStats = ({ stats }) => {
    const statItems = [
        {
            title: "Total Customers",
            value: stats.total,
            color: "#1890ff",
            icon: <UserOutlined />,
        },
        {
            title: "Regular Customers",
            value: stats.regular,
            color: "#52c41a",
        },
        {
            title: "Wholesale Customers",
            value: stats.wholesale,
            color: "#faad14",
        },
        {
            title: "Retail Customers",
            value: stats.retail,
            color: "#f5222d",
        },
    ];

    return (
        <Row gutter={16} className="mb-6">
            {statItems.map((stat, index) => (
                <Col span={6} key={index}>
                    <Card>
                        <Statistic
                            title={stat.title}
                            value={stat.value}
                            valueStyle={{ color: stat.color }}
                            prefix={stat.icon}
                        />
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

export default CustomerStats;
