import React from "react";
import { Row, Col, Card, Statistic, Table, Progress, Tag } from "antd";
import {
    UserOutlined,
    ShoppingCartOutlined,
    ShoppingOutlined,
    DollarOutlined,
    ArrowUpOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
    // Sample data for recent users
    const recentUsers = [
        {
            id: 1,
            username: "john_doe",
            email: "john@example.com",
            status: "Active",
            joinDate: "2025-02-28",
        },
        {
            id: 2,
            username: "sarah_smith",
            email: "sarah@example.com",
            status: "Active",
            joinDate: "2025-02-25",
        },
        {
            id: 3,
            username: "mike_johnson",
            email: "mike@example.com",
            status: "Pending",
            joinDate: "2025-02-20",
        },
    ];

    const userColumns = [
        {
            title: "Username",
            dataIndex: "username",
            key: "username",
            render: (text, record) => (
                <Link to={`/users/${record.id}`}>{text}</Link>
            ),
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Join Date",
            dataIndex: "joinDate",
            key: "joinDate",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Tag color={status === "Active" ? "green" : "orange"}>
                    {status}
                </Tag>
            ),
        },
    ];

    // Top selling products
    const topProducts = [
        { name: "Product A", sales: 120, amount: 1200 },
        { name: "Product B", sales: 90, amount: 1800 },
        { name: "Product C", sales: 75, amount: 750 },
        { name: "Product D", sales: 60, amount: 1500 },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                    <Card hoverable>
                        <Statistic
                            title="Total Users"
                            value={128}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: "#1890ff" }}
                        />
                        <div className="mt-2 text-xs text-green-600">
                            <ArrowUpOutlined /> 12% increase
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card hoverable>
                        <Statistic
                            title="Total Products"
                            value={287}
                            prefix={<ShoppingOutlined />}
                            valueStyle={{ color: "#3f8600" }}
                        />
                        <div className="mt-2 text-xs text-green-600">
                            <ArrowUpOutlined /> 8% increase
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card hoverable>
                        <Statistic
                            title="Total Sales"
                            value={562}
                            prefix={<ShoppingCartOutlined />}
                            valueStyle={{ color: "#1890ff" }}
                        />
                        <div className="mt-2 text-xs text-green-600">
                            <ArrowUpOutlined /> 15% increase
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card hoverable>
                        <Statistic
                            title="Revenue"
                            value={45280}
                            prefix={<DollarOutlined />}
                            suffix="$"
                            valueStyle={{ color: "#3f8600" }}
                        />
                        <div className="mt-2 text-xs text-green-600">
                            <ArrowUpOutlined /> 18% increase
                        </div>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} className="mt-6">
                <Col xs={24} lg={14}>
                    <Card title="Recent Users" className="h-full">
                        <Table
                            dataSource={recentUsers}
                            columns={userColumns}
                            rowKey="id"
                            pagination={false}
                            size="small"
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={10}>
                    <Card title="Top Selling Products" className="h-full">
                        {topProducts.map((product, index) => (
                            <div key={index} className="mb-4">
                                <div className="flex justify-between mb-1">
                                    <span className="font-medium">
                                        {product.name}
                                    </span>
                                    <span>${product.amount}</span>
                                </div>
                                <div className="flex justify-between mb-1 text-xs text-gray-500">
                                    <span>{product.sales} units sold</span>
                                    <span>
                                        {Math.round(
                                            (product.sales / 120) * 100
                                        )}
                                        % of top product
                                    </span>
                                </div>
                                <Progress
                                    percent={(product.sales / 120) * 100}
                                    status="active"
                                    showInfo={false}
                                />
                            </div>
                        ))}
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default AdminDashboard;
