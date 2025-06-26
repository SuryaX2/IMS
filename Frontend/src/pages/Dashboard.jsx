import React, { useState, useEffect } from "react";
import {
    Card,
    Row,
    Col,
    Tag,
    Divider,
    Typography,
    Tabs,
    Button,
    Badge,
    Tooltip,
    theme,
} from "antd";
import {
    DollarOutlined,
    InboxOutlined,
    ShoppingCartOutlined,
    ShoppingOutlined,
    WarningOutlined,
    AreaChartOutlined,
    PieChartOutlined,
    InfoCircleOutlined,
    CalendarOutlined,
    AppstoreOutlined,
    ReloadOutlined
} from "@ant-design/icons";
import toast from "react-hot-toast";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatCard from "../components/dashboard/StatCard";
import ProductDistribution from "../components/dashboard/ProductDistribution";
import DataTable from "../components/dashboard/DataTable";
import LoadingSpinner from "../components/dashboard/LoadingSpinner";
import ErrorDisplay from "../components/dashboard/ErrorDisplay";
import { api } from "../api/api";
import SalesChart from "../components/dashboard/SalesChart";

const { useToken } = theme;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

const Dashboard = () => {
    const { token } = useToken();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dashboardData, setDashboardData] = useState({
        totalSales: 0,
        totalPurchase: 0,
        inventoryValue: 0,
        totalProducts: 0,
        totalStock: 0,
        outOfStockCount: 0,
        lowStockProducts: [],
        recentOrders: [],
        salesData: [],
        topProducts: [],
    });
    const [timeframe, setTimeframe] = useState("30days");

    useEffect(() => {
        fetchDashboardData();
    }, [timeframe]);

    // Fetch dashboard data from API endpoints
    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Using the API endpoints you provided
            const [
                dashboardResponse,
                topProductsResponse,
                salesReportResponse,
            ] = await Promise.all([
                api.get("/reports/dashboard", { params: { timeframe } }),
                api.get("/reports/top-products", { params: { timeframe } }),
                api.get("/reports/sales", { params: { timeframe } }),
            ]);

            if (dashboardResponse.data.success) {
                const metricsData = dashboardResponse.data.data;
                const topProductsData = topProductsResponse.data.data || [];
                const salesReportData = salesReportResponse.data.data || {};

                setDashboardData({
                    ...metricsData,
                    topProducts: topProductsData,
                    salesData: salesReportData,
                });

                toast.success("Data loaded successfully");
            } else {
                setError("Failed to fetch dashboard data");
                toast.error("Failed to load data");
            }
        } catch (err) {
            console.error("Dashboard data fetch error:", err);
            const errorMessage =
                err.response?.data?.message ||
                "Something went wrong while fetching dashboard data";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Top products table columns
    const topProductsColumns = [
        {
            title: "Product",
            dataIndex: "product_name",
            key: "product_name",
            ellipsis: true,
        },
        {
            title: "Units Sold",
            dataIndex: "quantity_sold",
            key: "quantity_sold",
            sorter: (a, b) => a.quantity_sold - b.quantity_sold,
            responsive: ["md"],
        },
        {
            title: "Total Sales",
            dataIndex: "total_sales",
            key: "total_sales",
            render: (value) => `$${value.toLocaleString()}`,
            sorter: (a, b) => a.total_sales - b.total_sales,
        },
    ];

    // Low stock alerts table columns
    const lowStockColumns = [
        {
            title: "Product",
            dataIndex: "product_name",
            key: "product_name",
            ellipsis: true,
        },
        {
            title: "Stock",
            dataIndex: "stock",
            key: "stock",
            width: 100,
            align: "center",
        },
        {
            title: "Status",
            key: "status",
            width: 120,
            align: "center",
            render: (_, record) => (
                <Tag
                    color={record.stock === 0 ? "error" : "warning"}
                    className="w-full text-center"
                >
                    {record.stock === 0 ? "Out of Stock" : "Low Stock"}
                </Tag>
            ),
        },
    ];

    // Recent orders columns
    const recentOrdersColumns = [
        {
            title: "Order ID",
            dataIndex: "invoice_no",
            key: "invoice_no",
            width: 120,
            render: (value) => `#${value}`,
        },
        {
            title: "Customer",
            key: "customer",
            ellipsis: true,
            render: (_, record) =>
                record.customer_id?.name || "Unknown Customer",
        },
        {
            title: "Date",
            key: "date",
            responsive: ["md"],
            render: (_, record) =>
                new Date(record.createdAt).toLocaleDateString(),
        },
        {
            title: "Total",
            dataIndex: "total",
            key: "total",
            render: (value) => `$${value.toLocaleString()}`,
        },
        {
            title: "Status",
            dataIndex: "order_status",
            key: "order_status",
            render: (status) => {
                let color = "default";
                if (status === "completed") color = "success";
                if (status === "processing") color = "processing";
                if (status === "pending") color = "warning";
                if (status === "cancelled") color = "error";

                return <Tag color={color}>{status.toUpperCase()}</Tag>;
            },
        },
    ];

    const TimeframeSelector = () => (
        <div className="flex items-center space-x-2 mb-4">
            <Text className="text-gray-500 whitespace-nowrap">
                Showing data for:
            </Text>
            <div className="flex bg-gray-100 rounded-lg p-1">
                <Button
                    type={timeframe === "7days" ? "primary" : "text"}
                    size="small"
                    onClick={() => setTimeframe("7days")}
                    className={timeframe !== "7days" ? "text-gray-600" : ""}
                >
                    7 Days
                </Button>
                <Button
                    type={timeframe === "30days" ? "primary" : "text"}
                    size="small"
                    onClick={() => setTimeframe("30days")}
                    className={timeframe !== "30days" ? "text-gray-600" : ""}
                >
                    30 Days
                </Button>
                <Button
                    type={timeframe === "90days" ? "primary" : "text"}
                    size="small"
                    onClick={() => setTimeframe("90days")}
                    className={timeframe !== "90days" ? "text-gray-600" : ""}
                >
                    90 Days
                </Button>
            </div>
        </div>
    );

    if (loading) {
        return <LoadingSpinner tip="Loading dashboard data..." />;
    }

    if (error) {
        return <ErrorDisplay error={error} onRetry={fetchDashboardData} />;
    }

    return (
        <div className="px-4 py-6">
            <DashboardHeader onRefresh={fetchDashboardData} />

            {/* Key metrics cards */}
            <Row gutter={[16, 16]} className="mt-6">
                <Col xs={24} sm={12} md={8}>
                    <StatCard
                        title="Total Sales"
                        value={dashboardData.totalSales}
                        prefix={<ShoppingCartOutlined />}
                        valueStyle={{ color: token.colorSuccess }}
                        icon={
                            <ShoppingCartOutlined className="text-2xl text-success" />
                        }
                        className="dashboard-stat-card"
                        formatter={(value) => `$${value.toLocaleString()}`}
                    />
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <StatCard
                        title="Total Purchases"
                        value={dashboardData.totalPurchase}
                        prefix={<ShoppingOutlined />}
                        valueStyle={{ color: token.colorPrimary }}
                        icon={
                            <ShoppingOutlined className="text-2xl text-primary" />
                        }
                        className="dashboard-stat-card"
                        formatter={(value) => `$${value.toLocaleString()}`}
                    />
                </Col>
                <Col xs={24} sm={24} md={8}>
                    <StatCard
                        title="Inventory Value"
                        value={dashboardData.inventoryValue}
                        prefix={<DollarOutlined />}
                        valueStyle={{ color: token.colorPurple }}
                        icon={
                            <DollarOutlined className="text-2xl text-purple" />
                        }
                        className="dashboard-stat-card"
                        formatter={(value) => `$${value.toLocaleString()}`}
                        precision={2}
                    />
                </Col>
            </Row>

            <Row gutter={[16, 16]} className="mt-4">
                <Col xs={24} sm={8}>
                    <StatCard
                        title="Total Products"
                        value={dashboardData.totalProducts}
                        icon={<InboxOutlined className="text-2xl text-blue" />}
                        className="dashboard-stat-card"
                    />
                </Col>
                <Col xs={24} sm={8}>
                    <StatCard
                        title="Total Stock"
                        value={dashboardData.totalStock}
                        icon={
                            <ShoppingOutlined className="text-2xl text-cyan" />
                        }
                        className="dashboard-stat-card"
                    />
                </Col>
                <Col xs={24} sm={8}>
                    <StatCard
                        title="Out of Stock"
                        value={dashboardData.outOfStockCount}
                        icon={<WarningOutlined className="text-2xl" />}
                        valueStyle={{
                            color:
                                dashboardData.outOfStockCount > 0
                                    ? token.colorError
                                    : token.colorSuccess,
                        }}
                        className="dashboard-stat-card"
                    />
                </Col>
            </Row>

            {/* Enhanced Analytics Section */}
            <Card
                className="mt-8 shadow-md hover:shadow-lg transition-all duration-300"
                title={
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <AreaChartOutlined className="text-blue-500 mr-2 text-xl" />
                            <span className="text-xl font-bold">
                                Analytics Dashboard
                            </span>
                        </div>
                        <TimeframeSelector />
                    </div>
                }
            >
                <Tabs
                    defaultActiveKey="sales"
                    className="dashboard-analytics-tabs"
                    tabBarExtraContent={
                        <Tooltip title="Refresh data">
                            <Button
                                icon={<ReloadOutlined />}
                                onClick={fetchDashboardData}
                                type="text"
                            />
                        </Tooltip>
                    }
                >
                    <TabPane
                        tab={
                            <span>
                                <AreaChartOutlined /> Sales Analysis
                            </span>
                        }
                        key="sales"
                    >
                        <Row gutter={[16, 16]}>
                            <Col xs={24} lg={16}>
                                <Card
                                    className="shadow-sm bg-gradient-to-r from-blue-50 to-white"
                                    bordered={false}
                                >
                                    <SalesChart
                                        salesData={dashboardData.salesData}
                                    />
                                </Card>
                            </Col>
                            <Col xs={24} lg={8}>
                                <ProductDistribution
                                    topProducts={dashboardData.topProducts}
                                />

                                {/* If we have data, show quick insights */}
                                {dashboardData.topProducts &&
                                    dashboardData.topProducts.length > 0 && (
                                        <Card
                                            title={
                                                <div className="flex items-center">
                                                    <InfoCircleOutlined className="text-blue-500 mr-2" />
                                                    <span>Quick Insights</span>
                                                </div>
                                            }
                                            className="mt-4 shadow-sm"
                                            size="small"
                                        >
                                            <div className="space-y-3">
                                                <div>
                                                    <Text strong>
                                                        Top Performer:{" "}
                                                    </Text>
                                                    <Text>
                                                        {
                                                            dashboardData
                                                                .topProducts[0]
                                                                ?.product_name
                                                        }
                                                    </Text>
                                                    <Badge
                                                        count={`${dashboardData.topProducts[0]?.quantity_sold} units`}
                                                        className="ml-2"
                                                        style={{
                                                            backgroundColor:
                                                                "#52c41a",
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <Text strong>
                                                        Most Profitable:{" "}
                                                    </Text>
                                                    <Text>
                                                        {
                                                            dashboardData.topProducts.sort(
                                                                (a, b) =>
                                                                    b.total_sales -
                                                                    a.total_sales
                                                            )[0]?.product_name
                                                        }
                                                    </Text>
                                                    <Badge
                                                        count={`$${dashboardData.topProducts.sort((a, b) => b.total_sales - a.total_sales)[0]?.total_sales.toLocaleString()}`}
                                                        className="ml-2"
                                                        style={{
                                                            backgroundColor:
                                                                "#1890ff",
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </Card>
                                    )}
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane
                        tab={
                            <span>
                                <CalendarOutlined /> Historical Trends
                            </span>
                        }
                        key="trends"
                    >
                        <div className="bg-gray-50 p-6 rounded-lg text-center">
                            <AppstoreOutlined
                                style={{ fontSize: 48 }}
                                className="text-gray-400 mb-4"
                            />
                            <Title level={4}>Historical Trends</Title>
                            <Text className="text-gray-500">
                                Detailed historical trend analysis will be
                                available in a future update.
                            </Text>
                        </div>
                    </TabPane>
                </Tabs>
            </Card>

            <Divider className="my-8">
                <h1 className="text-xl m-0 flex items-center">
                    <PieChartOutlined className="mr-2" /> Reports
                </h1>
            </Divider>

            {/* Tables section */}
            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <DataTable
                        title="Top Selling Products"
                        columns={topProductsColumns}
                        dataSource={dashboardData.topProducts.slice(0, 5)}
                        viewAllLink="/reports/top-products"
                    />
                </Col>
                <Col xs={24} md={12}>
                    <DataTable
                        title="Low Stock Alerts"
                        columns={lowStockColumns}
                        dataSource={dashboardData.lowStockProducts.slice(0, 5)}
                        viewAllLink="/reports/low-stock-alerts"
                    />
                </Col>
            </Row>

            {/* Recent orders section */}
            <Row gutter={[16, 16]} className="mt-4 mb-6">
                <Col xs={24}>
                    <DataTable
                        title="Recent Orders"
                        columns={recentOrdersColumns}
                        dataSource={dashboardData.recentOrders.slice(0, 5)}
                        viewAllLink="/orders"
                    />
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
