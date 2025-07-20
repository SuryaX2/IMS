import React from "react";
import { Card, Row, Col, Statistic } from "antd";
import {
    UserOutlined,
    TeamOutlined,
    ShopOutlined,
    AppstoreOutlined,
} from "@ant-design/icons";

const CustomerStats = ({ stats }) => {
    const statItems = [
        {
            title: "Total Customers",
            value: stats.total,
            color: "#1890ff",
            icon: <UserOutlined style={{ fontSize: "20px" }} />,
            bgGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        },
        {
            title: "Regular Customers",
            value: stats.regular,
            color: "#52c41a",
            icon: <TeamOutlined style={{ fontSize: "20px" }} />,
            bgGradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
        },
        {
            title: "Wholesale Customers",
            value: stats.wholesale,
            color: "#faad14",
            icon: <AppstoreOutlined style={{ fontSize: "20px" }} />,
            bgGradient: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
        },
        {
            title: "Retail Customers",
            value: stats.retail,
            color: "#f5222d",
            icon: <ShopOutlined style={{ fontSize: "20px" }} />,
            bgGradient: "linear-gradient(135deg, #000428 0%, #004e92 80%)",
        },
    ];

    return (
        <Row gutter={[16, 16]} className="mb-6">
            {statItems.map((stat, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                    <Card
                        className="h-full shadow-md hover:shadow-lg transition-all duration-300 border-0"
                        bodyStyle={{
                            padding: "24px",
                            background: stat.bgGradient,
                            borderRadius: "8px",
                        }}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <Statistic
                                    title={
                                        <span className="text-white text-sm font-medium opacity-90">
                                            {stat.title}
                                        </span>
                                    }
                                    value={stat.value}
                                    valueStyle={{
                                        color: "white",
                                        fontSize: "28px",
                                        fontWeight: "bold",
                                    }}
                                />
                            </div>
                            <div className="text-white opacity-80">
                                {stat.icon}
                            </div>
                        </div>
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

export default CustomerStats;
