// UserDashboard.jsx
import React, { useState, useEffect, useContext } from "react";
import { Row, Col, Card, Statistic, Table, Tag, Spin } from "antd";
import { Area } from "@ant-design/plots";
import {
    ShoppingOutlined,
    ShoppingCartOutlined,
    DollarOutlined,
    AlertOutlined,
} from "@ant-design/icons";
import AuthContext from "../../context/AuthContext";

const UserDashboard = () => {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);

    // Mock data - in a real app, this would come from API calls
    const [data, setData] = useState({
        totalProducts: 0,
        lowStockItems: 0,
        recentSales: 0,
        recentPurchases: 0,
        transactions: [],
        salesData: [],
    });

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setData({
                totalProducts: 124,
                lowStockItems: 8,
                recentSales: 28,
                recentPurchases: 12,
                transactions: [
                    {
                        id: 1,
                        date: "2025-03-01",
                        type: "sale",
                        product: "Laptop Dell XPS",
                        amount: 1299,
                        status: "completed",
                    },
                    {
                        id: 2,
                        date: "2025-03-02",
                        type: "purchase",
                        product: "HDMI Cables (Bulk)",
                        amount: 145,
                        status: "pending",
                    },
                    {
                        id: 3,
                        date: "2025-03-02",
                        type: "sale",
                        product: "Wireless Mouse",
                        amount: 35,
                        status: "completed",
                    },
                    {
                        id: 4,
                        date: "2025-03-03",
                        type: "sale",
                        product: "USB-C Adapter",
                        amount: 24,
                        status: "completed",
                    },
                    {
                        id: 5,
                        date: "2025-03-03",
                        type: "purchase",
                        product: "Keyboard Inventory",
                        amount: 450,
                        status: "completed",
                    },
                ],
                salesData: [
                    { date: "2025-02-01", sales: 3800 },
                    { date: "2025-02-08", sales: 4200 },
                    { date: "2025-02-15", sales: 3900 },
                    { date: "2025-02-22", sales: 5200 },
                    { date: "2025-03-01", sales: 4800 },
                ],
            });
            setLoading(false);
        }, 1000);
    }, []);

    const columns = [
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            render: (type) => (
                <Tag color={type === "sale" ? "green" : "blue"}>
                    {type.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: "Product",
            dataIndex: "product",
            key: "product",
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            render: (amount) => `$${amount.toFixed(2)}`,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Tag color={status === "completed" ? "green" : "orange"}>
                    {status.toUpperCase()}
                </Tag>
            ),
        },
    ];

    const config = {
        data: data.salesData,
        xField: "date",
        yField: "sales",
        smooth: true,
        areaStyle: {
            fill: "l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff",
        },
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
            <h1 className="text-2xl font-bold mb-6">
                Welcome back, {user?.username}!
            </h1>

            <Row gutter={16} className="mb-6">
                <Col span={6}>
                    <Card bordered={false} className="shadow-sm">
                        <Statistic
                            title="Total Products"
                            value={data.totalProducts}
                            prefix={<ShoppingOutlined />}
                            valueStyle={{ color: "#3f8600" }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false} className="shadow-sm">
                        <Statistic
                            title="Low Stock Items"
                            value={data.lowStockItems}
                            prefix={<AlertOutlined />}
                            valueStyle={{ color: "#cf1322" }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false} className="shadow-sm">
                        <Statistic
                            title="Recent Sales"
                            value={data.recentSales}
                            prefix={<ShoppingCartOutlined />}
                            valueStyle={{ color: "#1890ff" }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false} className="shadow-sm">
                        <Statistic
                            title="Recent Purchases"
                            value={data.recentPurchases}
                            prefix={<DollarOutlined />}
                            valueStyle={{ color: "#722ed1" }}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={16}>
                    <Card
                        title="Sales Trend"
                        bordered={false}
                        className="shadow-sm mb-6"
                    >
                        <Area {...config} height={250} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card
                        title="Low Stock Alert"
                        bordered={false}
                        className="shadow-sm mb-6"
                    >
                        <ul className="space-y-2">
                            <li className="flex justify-between">
                                <span>Wireless Mouse</span>
                                <Tag color="red">2 left</Tag>
                            </li>
                            <li className="flex justify-between">
                                <span>USB-C Cables</span>
                                <Tag color="red">3 left</Tag>
                            </li>
                            <li className="flex justify-between">
                                <span>HDMI Adapters</span>
                                <Tag color="orange">5 left</Tag>
                            </li>
                            <li className="flex justify-between">
                                <span>Laptop Chargers</span>
                                <Tag color="orange">4 left</Tag>
                            </li>
                        </ul>
                    </Card>
                </Col>
            </Row>

            <Card
                title="Recent Transactions"
                bordered={false}
                className="shadow-sm"
            >
                <Table
                    columns={columns}
                    dataSource={data.transactions}
                    rowKey="id"
                    pagination={false}
                />
            </Card>
        </div>
    );
};

export default UserDashboard;
