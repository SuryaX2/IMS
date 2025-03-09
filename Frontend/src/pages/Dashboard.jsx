import React, { useState, useEffect } from "react";
import {
    Card,
    Row,
    Col,
    Statistic,
    Table,
    Spin,
    Alert,
    Typography,
    DatePicker,
    Button,
    Space,
} from "antd";
import { Area, Column } from "@ant-design/plots";
import {
    ShoppingOutlined,
    DollarOutlined,
    ShoppingCartOutlined,
    InboxOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";
import { api } from "../api/api";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState(null);
    const [salesData, setSalesData] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [dateRange, setDateRange] = useState([null, null]);
    const [error, setError] = useState(null);

    const fetchDashboardData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [metricsResponse, salesResponse, topProductsResponse] =
                await Promise.all([
                    api.get("/reports/dashboard"),
                    api.get("/reports/sales", {
                        params: {
                            start_date: dateRange[0]?.format("YYYY-MM-DD"),
                            end_date: dateRange[1]?.format("YYYY-MM-DD"),
                        },
                    }),
                    api.get("/reports/top-products"),
                ]);

            if (metricsResponse.data.success) {
                setMetrics(metricsResponse.data.data);
            }

            if (salesResponse.data.success) {
                const formattedSalesData =
                    salesResponse.data.data.salesByDate.map((item) => ({
                        date: item._id,
                        value: item.total,
                        orders: item.orders,
                    }));
                setSalesData(formattedSalesData);
            }

            if (topProductsResponse.data.success) {
                setTopProducts(topProductsResponse.data.data);
            }
        } catch (err) {
            console.error("Error fetching dashboard data:", err);
            setError("Failed to load dashboard data. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [dateRange]);

    const columns = [
        {
            title: "Product",
            dataIndex: "product_name",
            key: "product_name",
        },
        {
            title: "Code",
            dataIndex: "product_code",
            key: "product_code",
        },
        {
            title: "Quantity Sold",
            dataIndex: "quantity_sold",
            key: "quantity_sold",
            sorter: (a, b) => a.quantity_sold - b.quantity_sold,
        },
        {
            title: "Total Sales",
            dataIndex: "total_sales",
            key: "total_sales",
            render: (value) => `$${value.toFixed(2)}`,
            sorter: (a, b) => a.total_sales - b.total_sales,
        },
    ];

    const lowStockColumns = [
        {
            title: "Product",
            dataIndex: "product_name",
            key: "product_name",
        },
        {
            title: "Stock",
            dataIndex: "stock",
            key: "stock",
            render: (stock) => (
                <Text type={stock === 0 ? "danger" : "warning"}>{stock}</Text>
            ),
        },
    ];

    const areaConfig = {
        data: salesData,
        xField: "date",
        yField: "value",
        seriesField: "",
        xAxis: {
            title: {
                text: "Date",
            },
        },
        yAxis: {
            title: {
                text: "Sales ($)",
            },
        },
        smooth: true,
        areaStyle: {
            fill: "l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff",
        },
    };

    const columnConfig = {
        data: topProducts.slice(0, 5),
        xField: "product_name",
        yField: "quantity_sold",
        label: {
            position: "middle",
            style: {
                fill: "#FFFFFF",
                opacity: 0.6,
            },
        },
        meta: {
            product_name: {
                alias: "Product",
            },
            quantity_sold: {
                alias: "Units Sold",
            },
        },
        color: "#1890ff",
    };

    if (error) {
        return (
            <Alert message="Error" description={error} type="error" showIcon />
        );
    }

    return (
        <div className="dashboard">
            {loading && !metrics ? (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "300px",
                    }}
                >
                    <Spin size="large" />
                </div>
            ) : (
                <>
                    <div style={{ marginBottom: 24 }}>
                        <Space
                            style={{
                                marginBottom: 16,
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <Title level={3}>Dashboard Overview</Title>
                            <Space>
                                <RangePicker onChange={setDateRange} />
                                <Button
                                    type="primary"
                                    onClick={fetchDashboardData}
                                >
                                    Refresh
                                </Button>
                            </Space>
                        </Space>
                        <Row gutter={[16, 16]}>
                            <Col xs={24} sm={12} md={6}>
                                <Card>
                                    <Statistic
                                        title="Total Sales"
                                        value={metrics?.totalSales || 0}
                                        prefix={<DollarOutlined />}
                                        precision={2}
                                        valueStyle={{ color: "#3f8600" }}
                                    />
                                </Card>
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                                <Card>
                                    <Statistic
                                        title="Inventory Value"
                                        value={metrics?.inventoryValue || 0}
                                        prefix={<InboxOutlined />}
                                        precision={2}
                                        valueStyle={{ color: "#1890ff" }}
                                    />
                                </Card>
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                                <Card>
                                    <Statistic
                                        title="Total Products"
                                        value={metrics?.totalProducts || 0}
                                        prefix={<ShoppingOutlined />}
                                        valueStyle={{ color: "#722ed1" }}
                                    />
                                </Card>
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                                <Card>
                                    <Statistic
                                        title="Out of Stock"
                                        value={metrics?.outOfStockCount || 0}
                                        prefix={<ExclamationCircleOutlined />}
                                        valueStyle={{
                                            color:
                                                metrics?.outOfStockCount > 0
                                                    ? "#cf1322"
                                                    : "#52c41a",
                                        }}
                                    />
                                </Card>
                            </Col>
                        </Row>
                    </div>

                    <Row gutter={[16, 16]}>
                        <Col xs={24} lg={16}>
                            <Card title="Sales Trend">
                                {salesData.length > 0 ? (
                                    <Area {...areaConfig} height={300} />
                                ) : (
                                    <div
                                        style={{
                                            height: 300,
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Text type="secondary">
                                            No sales data available for the
                                            selected period
                                        </Text>
                                    </div>
                                )}
                            </Card>
                        </Col>
                        <Col xs={24} lg={8}>
                            <Card
                                title="Low Stock Alert"
                                style={{ height: "100%" }}
                            >
                                <Table
                                    dataSource={metrics?.lowStockProducts || []}
                                    columns={lowStockColumns}
                                    rowKey="_id"
                                    pagination={false}
                                    size="small"
                                />
                            </Card>
                        </Col>
                    </Row>

                    <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                        <Col xs={24} lg={12}>
                            <Card title="Top Selling Products">
                                {topProducts.length > 0 ? (
                                    <Column {...columnConfig} height={300} />
                                ) : (
                                    <div
                                        style={{
                                            height: 300,
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Text type="secondary">
                                            No product data available
                                        </Text>
                                    </div>
                                )}
                            </Card>
                        </Col>
                        <Col xs={24} lg={12}>
                            <Card title="Recent Orders">
                                <Table
                                    dataSource={metrics?.recentOrders || []}
                                    columns={[
                                        {
                                            title: "Order ID",
                                            dataIndex: "_id",
                                            key: "_id",
                                            render: (id) =>
                                                id.substring(id.length - 8),
                                        },
                                        {
                                            title: "Customer",
                                            dataIndex: ["customer_id", "name"],
                                            key: "customer",
                                        },
                                        {
                                            title: "Status",
                                            dataIndex: "order_status",
                                            key: "status",
                                            render: (status) => (
                                                <span
                                                    style={{
                                                        color:
                                                            status ===
                                                            "completed"
                                                                ? "#52c41a"
                                                                : status ===
                                                                    "pending"
                                                                  ? "#faad14"
                                                                  : status ===
                                                                      "cancelled"
                                                                    ? "#f5222d"
                                                                    : "#1890ff",
                                                    }}
                                                >
                                                    {status
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        status.slice(1)}
                                                </span>
                                            ),
                                        },
                                        {
                                            title: "Total",
                                            dataIndex: "total",
                                            key: "total",
                                            render: (total) =>
                                                `$${total.toFixed(2)}`,
                                        },
                                    ]}
                                    rowKey="_id"
                                    pagination={false}
                                    size="small"
                                />
                            </Card>
                        </Col>
                    </Row>
                </>
            )}
        </div>
    );
};

export default Dashboard;
