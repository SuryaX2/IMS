import React from "react";
import { Card, Statistic, Row, Col } from "antd";
import {
    UserOutlined,
    ShopOutlined,
    ProductFilled,
    UsergroupAddOutlined,
} from "@ant-design/icons";

const SupplierStats = ({ stats }) => {
    const statCards = [
        {
            title: "Individual",
            value: stats.individual,
            icon: <UserOutlined />,
            color: "#722ed1",
        },
        {
            title: "Wholesale",
            value: stats.wholesale,
            icon: <ProductFilled />,
            color: "#1890ff",
        },
        {
            title: "Retail",
            value: stats.retail,
            icon: <UsergroupAddOutlined />,
            color: "#52c41a",
        },
        {
            title: "Companies",
            value: stats.company,
            icon: <ShopOutlined />,
            color: "#fa8c16",
        },
    ];

    return (
        <Row gutter={[16, 16]} className="mb-6">
            {statCards.map((stat, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                    <Card>
                        <Statistic
                            title={stat.title}
                            value={stat.value}
                            prefix={stat.icon}
                            valueStyle={{ color: stat.color }}
                        />
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

export default SupplierStats;
