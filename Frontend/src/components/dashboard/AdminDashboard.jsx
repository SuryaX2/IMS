// AdminDashboard.jsx
import React, { useState, useEffect, useContext } from "react";
import {
    Row,
    Col,
    Card,
    Statistic,
    Table,
    Tag,
    Spin,
    Progress,
    Button,
} from "antd";
import {
    UserOutlined,
    ShoppingOutlined,
    DollarOutlined,
    LineChartOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import { Pie, Column } from "@ant-design/plots";
import AuthContext from "../../context/AuthContext";

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);

    // Mock data - in a real app, this would come from API calls
    const [data, setData] = useState({
        totalUsers: 0,
        totalProducts: 0,
        totalRevenue: 0,
        totalExpenses: 0,
        topProducts: [],
        recentUsers: [],
        categoryData: [],
        monthlySales: [],
    });

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setData({
                totalUsers: 48,
                totalProducts: 235,
                totalRevenue: 28500,
                totalExpenses: 12400,
                topProducts: [
                    {
                        id: 1,
                        name: "Dell XPS Laptop",
                        sold: 24,
                        revenue: 31200,
                    },
                    { id: 2, name: "Wireless Mouse", sold: 86, revenue: 3010 },
                    { id: 3, name: "USB-C Adapter", sold: 72, revenue: 1728 },
                    {
                        id: 4,
                        name: "Mechanical Keyboard",
                        sold: 35,
                        revenue: 4200,
                    },
                    {
                        id: 5,
                        name: "Wireless Earbuds",
                        sold: 62,
                        revenue: 6820,
                    },
                ],
                recentUsers: [
                    {
                        id: 1,
                        username: "john_doe",
                        email: "john@example.com",
                        date: "2025-03-01",
                        status: "active",
                    },
                    {
                        id: 2,
                        username: "sarah_smith",
                        email: "sarah@example.com",
                        date: "2025-03-01",
                        status: "active",
                    },
                    {
                        id: 3,
                        username: "mike_jones",
                        email: "mike@example.com",
                        date: "2025-02-28",
                        status: "inactive",
                    },
                ],
                categoryData: [
                    { category: "Electronics", value: 42 },
                    { category: "Accessories", value: 28 },
                    { category: "Storage", value: 15 },
                    { category: "Networking", value: 10 },
                    { category: "Other", value: 5 },
                ],
                monthlySales: [
                    { month: "Jan", sales: 18000 },
                    { month: "Feb", sales: 22000 },
                    { month: "Mar", sales: 28500 },
                ],
            });
            setLoading(false);
        }, 1000);
    }, []);

    const productColumns = [
        {
            title: "Product Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Units Sold",
            dataIndex: "sold",
            key: "sold",
        },
        {
            title: "Revenue",
            dataIndex: "revenue",
            key: "revenue",
            render: (revenue) => `$${revenue.toFixed(2)}`,
        },
    ];

    const userColumns = [
        {
            title: "Username",
            dataIndex: "username",
            key: "username",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Join Date",
            dataIndex: "date",
            key: "date",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Tag color={status === "active" ? "green" : "red"}>
                    {status.toUpperCase()}
                </Tag>
            ),
        },
    ];

    const pieConfig = {
        data: data.categoryData,
        angleField: "value",
        colorField: "category",
        radius: 0.8,
        label: {
            type: "outer",
            content: "{name}: {percentage}",
        },
        interactions: [{ type: "element-active" }],
    };

    const columnConfig = {
        data: data.monthlySales,
        xField: "month",
        yField: "sales",
        label: {
            position: "middle",
            style: {
                fill: "#FFFFFF",
                opacity: 0.6,
            },
        },
        color: "#1890ff",
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spin size="large" tip="Loading dashboard..." />
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <Button type="primary" icon={<PlusOutlined />}>
                    Add New Product
                </Button>
            </div>

            <Row gutter={16} className="mb-6">
                <Col span={6}>
                    <Card bordered={false} className="shadow-sm">
                        <Statistic
                            title="Total Users"
                            value={data.totalUsers}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: "#1890ff" }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false} className="shadow-sm">
                        <Statistic
                            title="Total Products"
                            value={data.totalProducts}
                            prefix={<ShoppingOutlined />}
                            valueStyle={{ color: "#52c41a" }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false} className="shadow-sm">
                        <Statistic
                            title="Total Revenue"
                            value={data.totalRevenue}
                            prefix={<DollarOutlined />}
                            suffix="USD"
                            valueStyle={{ color: "#3f8600" }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false} className="shadow-sm">
                        <Statistic
                            title="Total Expenses"
                            value={data.totalExpenses}
                            prefix={<DollarOutlined />}
                            suffix="USD"
                            valueStyle={{ color: "#cf1322" }}
                        />
                        <div className="mt-2">
                            <Progress
                                percent={Math.round(
                                    (data.totalExpenses / data.totalRevenue) *
                                        100
                                )}
                                size="small"
                                status="active"
                            />
                        </div>
                    </Card>
                </Col>
            </Row>

            <Row gutter={16} className="mb-6">
                <Col span={12}>
                    <Card
                        title="Monthly Sales"
                        bordered={false}
                        className="shadow-sm"
                    >
                        <Column {...columnConfig} height={250} />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card
                        title="Product Categories"
                        bordered={false}
                        className="shadow-sm"
                    >
                        <Pie {...pieConfig} height={250} />
                    </Card>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={14}>
                    <Card
                        title="Top Selling Products"
                        bordered={false}
                        className="shadow-sm mb-6"
                    >
                        <Table
                            columns={productColumns}
                            dataSource={data.topProducts}
                            rowKey="id"
                            pagination={false}
                        />
                    </Card>
                </Col>
                <Col span={10}>
                    <Card
                        title="Recent User Registrations"
                        bordered={false}
                        className="shadow-sm mb-6"
                    >
                        <Table
                            columns={userColumns}
                            dataSource={data.recentUsers}
                            rowKey="id"
                            pagination={false}
                        />
                    </Card>
                </Col>
            </Row>

            <Card
                title="Inventory Health"
                bordered={false}
                className="shadow-sm"
            >
                <Row gutter={16}>
                    <Col span={8}>
                        <Card title="Stock Level" bordered={false}>
                            <Progress type="circle" percent={78} />
                            <p className="mt-2 text-center">
                                Good stock levels
                            </p>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card title="Low Stock Items" bordered={false}>
                            <Progress
                                type="circle"
                                percent={12}
                                status="exception"
                            />
                            <p className="mt-2 text-center">
                                28 items need reordering
                            </p>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card title="Order Fulfillment" bordered={false}>
                            <Progress
                                type="circle"
                                percent={94}
                                strokeColor="#52c41a"
                            />
                            <p className="mt-2 text-center">
                                High fulfillment rate
                            </p>
                        </Card>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default AdminDashboard;
