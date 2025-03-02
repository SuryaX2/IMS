import React from "react";
import { Row, Col, Card, Statistic, Progress, Table, Tag } from "antd";
import {
    ShoppingCartOutlined,
    ShoppingOutlined,
    DollarOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const UserDashboard = () => {
    // Sample data for recent purchases
    const recentPurchases = [
        {
            id: 1,
            product: "Product A",
            quantity: 10,
            price: 100,
            date: "2025-02-28",
            status: "Completed",
        },
        {
            id: 2,
            product: "Product B",
            quantity: 5,
            price: 200,
            date: "2025-02-27",
            status: "Processing",
        },
        {
            id: 3,
            product: "Product C",
            quantity: 2,
            price: 50,
            date: "2025-02-26",
            status: "Completed",
        },
    ];

    const columns = [
        {
            title: "Product",
            dataIndex: "product",
            key: "product",
            render: (text) => <Link to={`/products/${text}`}>{text}</Link>,
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
            key: "quantity",
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price",
            render: (price) => `$${price}`,
        },
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Tag color={status === "Completed" ? "green" : "blue"}>
                    {status}
                </Tag>
            ),
        },
    ];

    // Low stock products
    const lowStockProducts = [
        { name: "Product A", quantity: 5 },
        { name: "Product B", quantity: 3 },
        { name: "Product C", quantity: 7 },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

            <Row gutter={[16, 16]}>
                <Col xs={24} sm={8}>
                    <Card hoverable>
                        <Statistic
                            title="Total Products"
                            value={42}
                            prefix={<ShoppingOutlined />}
                            valueStyle={{ color: "#3f8600" }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card hoverable>
                        <Statistic
                            title="Total Sales"
                            value={15}
                            prefix={<ShoppingCartOutlined />}
                            valueStyle={{ color: "#1890ff" }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card hoverable>
                        <Statistic
                            title="Revenue"
                            value={3250}
                            prefix={<DollarOutlined />}
                            suffix="$"
                            valueStyle={{ color: "#3f8600" }}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} className="mt-6">
                <Col xs={24} md={12}>
                    <Card title="Recent Purchases" className="h-full">
                        <Table
                            dataSource={recentPurchases}
                            columns={columns}
                            rowKey="id"
                            pagination={false}
                            size="small"
                        />
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card title="Low Stock Products" className="h-full">
                        {lowStockProducts.map((product, index) => (
                            <div key={index} className="mb-4">
                                <div className="flex justify-between mb-1">
                                    <span>{product.name}</span>
                                    <span>{product.quantity} items left</span>
                                </div>
                                <Progress
                                    percent={(product.quantity / 10) * 100}
                                    status={
                                        product.quantity < 5
                                            ? "exception"
                                            : "active"
                                    }
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

export default UserDashboard;
