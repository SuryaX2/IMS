import React, { useState, useEffect } from "react";
import {
    Card,
    Row,
    Col,
    Tag,
    Divider,
    Typography,
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
    ReloadOutlined,
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
            ellipsis: {
                showTitle: false,
            },
            render: (text) => (
                <Tooltip placement="topLeft" title={text}>
                    <span className="text-sm font-medium text-gray-800 block max-w-[150px] sm:max-w-[200px] truncate">
                        {text}
                    </span>
                </Tooltip>
            ),
        },
        {
            title: "Units",
            dataIndex: "quantity_sold",
            key: "quantity_sold",
            width: 80,
            align: "center",
            sorter: (a, b) => a.quantity_sold - b.quantity_sold,
            render: (value) => (
                <Badge
                    count={value}
                    className="font-medium"
                    style={{
                        backgroundColor: "#1890ff",
                        fontSize: "11px",
                    }}
                />
            ),
        },
        {
            title: "Sales",
            dataIndex: "total_sales",
            key: "total_sales",
            width: 100,
            align: "right",
            render: (value) => (
                <span className="font-semibold text-green-600">
                    ${value.toLocaleString()}
                </span>
            ),
            sorter: (a, b) => a.total_sales - b.total_sales,
        },
    ];

    // Low stock alerts table columns
    const lowStockColumns = [
        {
            title: "Product",
            dataIndex: "product_name",
            key: "product_name",
            ellipsis: {
                showTitle: false,
            },
            render: (text) => (
                <Tooltip placement="topLeft" title={text}>
                    <span className="text-sm font-medium text-gray-800 block max-w-[150px] sm:max-w-[200px] truncate">
                        {text}
                    </span>
                </Tooltip>
            ),
        },
        {
            title: "Stock",
            dataIndex: "stock",
            key: "stock",
            width: 70,
            align: "center",
            render: (value) => (
                <span
                    className={`font-bold ${value === 0 ? "text-red-600" : "text-orange-600"}`}
                >
                    {value}
                </span>
            ),
        },
        {
            title: "Status",
            key: "status",
            width: 90,
            align: "center",
            render: (_, record) => (
                <Tag
                    color={record.stock === 0 ? "error" : "warning"}
                    className="text-xs font-medium"
                >
                    {record.stock === 0 ? "Out" : "Low"}
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
            width: 100,
            render: (value) => (
                <span className="font-mono text-blue-600 font-medium">
                    #{value}
                </span>
            ),
        },
        {
            title: "Customer",
            key: "customer",
            ellipsis: {
                showTitle: false,
            },
            render: (_, record) => {
                const customerName =
                    record.customer_id?.name || "Unknown Customer";
                return (
                    <Tooltip placement="topLeft" title={customerName}>
                        <span className="text-sm font-medium text-gray-800 block max-w-[150px] sm:max-w-[200px] truncate">
                            {customerName}
                        </span>
                    </Tooltip>
                );
            },
        },
        {
            title: "Date",
            key: "date",
            width: 100,
            responsive: ["md"],
            render: (_, record) => (
                <span className="text-sm text-gray-600">
                    {new Date(record.createdAt).toLocaleDateString()}
                </span>
            ),
        },
        {
            title: "Total",
            dataIndex: "total",
            key: "total",
            width: 100,
            align: "right",
            render: (value) => (
                <span className="font-semibold text-green-600">
                    ${value.toLocaleString()}
                </span>
            ),
        },
        {
            title: "Status",
            dataIndex: "order_status",
            key: "order_status",
            width: 100,
            align: "center",
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

    if (loading) {
        return <LoadingSpinner tip="Loading dashboard data..." />;
    }

    if (error) {
        return <ErrorDisplay error={error} onRetry={fetchDashboardData} />;
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="px-3 sm:px-6 py-4 sm:py-8">
                <DashboardHeader onRefresh={fetchDashboardData} />

                {/* Key metrics cards */}
                <div className="mt-6 sm:mt-8">
                    <Row gutter={[16, 16]} className="sm:gutter-24">
                        <Col xs={24} sm={12} lg={8}>
                            <StatCard
                                title="Total Sales"
                                value={dashboardData.totalSales}
                                prefix={<ShoppingCartOutlined />}
                                valueStyle={{ color: token.colorSuccess }}
                                icon={
                                    <ShoppingCartOutlined className="text-xl sm:text-2xl text-success" />
                                }
                                className="dashboard-stat-card"
                                formatter={(value) =>
                                    `₹${value.toLocaleString()}`
                                }
                            />
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <StatCard
                                title="Total Purchases"
                                value={dashboardData.totalPurchase}
                                prefix={<ShoppingOutlined />}
                                valueStyle={{ color: token.colorPrimary }}
                                icon={
                                    <ShoppingOutlined className="text-xl sm:text-2xl text-primary" />
                                }
                                className="dashboard-stat-card"
                                formatter={(value) =>
                                    `₹${value.toLocaleString()}`
                                }
                            />
                        </Col>
                        <Col xs={24} sm={24} lg={8}>
                            <StatCard
                                title="Inventory Value"
                                value={dashboardData.inventoryValue}
                                prefix={<DollarOutlined />}
                                valueStyle={{ color: token.colorPurple }}
                                icon={
                                    <DollarOutlined className="text-xl sm:text-2xl text-purple" />
                                }
                                className="dashboard-stat-card"
                                formatter={(value) =>
                                    `₹${value.toLocaleString()}`
                                }
                                precision={2}
                            />
                        </Col>
                    </Row>

                    <Row
                        gutter={[16, 16]}
                        className="mt-4 sm:mt-6 sm:gutter-24"
                    >
                        <Col xs={24} sm={8}>
                            <StatCard
                                title="Total Products"
                                value={dashboardData.totalProducts}
                                icon={
                                    <InboxOutlined className="text-xl sm:text-2xl text-blue" />
                                }
                                className="dashboard-stat-card"
                            />
                        </Col>
                        <Col xs={24} sm={8}>
                            <StatCard
                                title="Total Stock"
                                value={dashboardData.totalStock}
                                icon={
                                    <ShoppingOutlined className="text-xl sm:text-2xl text-cyan" />
                                }
                                className="dashboard-stat-card"
                            />
                        </Col>
                        <Col xs={24} sm={8}>
                            <StatCard
                                title="Out of Stock"
                                value={dashboardData.outOfStockCount}
                                icon={
                                    <WarningOutlined className="text-xl sm:text-2xl" />
                                }
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
                </div>

                {/* Analytics Section */}
                <div className="mt-8 sm:mt-10">
                    <div className="mb-4 sm:mb-6">
                        <Divider orientation="center">
                            <Text className="text-lg sm:text-2xl font-bold text-gray-800">
                                <AreaChartOutlined className="mr-2" />
                                Analytics & Insights
                            </Text>
                        </Divider>
                    </div>

                    <Row
                        gutter={[16, 16]}
                        className="mb-8 sm:mb-10 sm:gutter-24"
                    >
                        <Col xs={24} xl={16}>
                            <div className="bg-white rounded-xl shadow-lg border border-gray-100 h-full">
                                <SalesChart
                                    salesData={dashboardData.salesData}
                                />
                            </div>
                        </Col>
                        <Col xs={24} xl={8}>
                            <div className="h-full flex flex-col space-y-4 sm:space-y-6">
                                <div className="flex-1 shadow-lg">
                                    <ProductDistribution
                                        topProducts={dashboardData.topProducts}
                                    />
                                </div>

                                {/* Quick Insights */}
                                {dashboardData.topProducts &&
                                    dashboardData.topProducts.length > 0 && (
                                        <Card
                                            title={
                                                <div className="flex items-center">
                                                    <InfoCircleOutlined className="text-blue-500 mr-2" />
                                                    <span className="text-sm sm:text-base font-semibold">
                                                        Quick Insights
                                                    </span>
                                                </div>
                                            }
                                            className="shadow-lg border border-gray-100 rounded-xl"
                                            bodyStyle={{ padding: "12px 16px" }}
                                            headStyle={{
                                                borderBottom:
                                                    "1px solid #f0f0f0",
                                                padding: "10px 16px",
                                                backgroundColor: "#fafafa",
                                            }}
                                        >
                                            <div className="space-y-3">
                                                <div className="p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                                                    <Text
                                                        strong
                                                        className="text-green-700 text-xs sm:text-sm"
                                                    >
                                                        Top Performer
                                                    </Text>
                                                    <div className="mt-1">
                                                        <Text className="text-xs sm:text-sm font-medium text-gray-800 block">
                                                            {
                                                                dashboardData
                                                                    .topProducts[0]
                                                                    ?.product_name
                                                            }
                                                        </Text>
                                                        <Badge
                                                            count={`${dashboardData.topProducts[0]?.quantity_sold} units`}
                                                            className="mt-1"
                                                            style={{
                                                                backgroundColor:
                                                                    "#52c41a",
                                                                fontSize:
                                                                    "10px",
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                                                    <Text
                                                        strong
                                                        className="text-blue-700 text-xs sm:text-sm"
                                                    >
                                                        Most Profitable
                                                    </Text>
                                                    <div className="mt-1">
                                                        <Text className="text-xs sm:text-sm font-medium text-gray-800 block">
                                                            {
                                                                dashboardData.topProducts.sort(
                                                                    (a, b) =>
                                                                        b.total_sales -
                                                                        a.total_sales
                                                                )[0]
                                                                    ?.product_name
                                                            }
                                                        </Text>
                                                        <Badge
                                                            count={`$${dashboardData.topProducts.sort((a, b) => b.total_sales - a.total_sales)[0]?.total_sales.toLocaleString()}`}
                                                            className="mt-1"
                                                            style={{
                                                                backgroundColor:
                                                                    "#1890ff",
                                                                fontSize:
                                                                    "10px",
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    )}
                            </div>
                        </Col>
                    </Row>
                </div>

                {/* Reports Section */}
                <div className="mt-10 sm:mt-12">
                    <Divider orientation="center" className="mb-6 sm:mb-8">
                        <Text className="text-lg sm:text-2xl font-bold text-gray-800">
                            <PieChartOutlined className="mr-2" />
                            Reports & Alerts
                        </Text>
                    </Divider>

                    {/* First row: Top Products and Low Stock - Equal height */}
                    <Row
                        gutter={[16, 16]}
                        className="mb-4 sm:mb-6 sm:gutter-24"
                    >
                        <Col xs={24} lg={12}>
                            <div className="h-full shadow-lg">
                                <DataTable
                                    title="Top Selling Products"
                                    columns={topProductsColumns}
                                    dataSource={dashboardData.topProducts.slice(
                                        0,
                                        5
                                    )}
                                    viewAllLink="/reports/top-products"
                                    pagination={{ pageSize: 5, size: "small" }}
                                />
                            </div>
                        </Col>
                        <Col xs={24} lg={12}>
                            <div className="h-full shadow-lg">
                                <DataTable
                                    title="Low Stock Alerts"
                                    columns={lowStockColumns}
                                    dataSource={dashboardData.lowStockProducts.slice(
                                        0,
                                        5
                                    )}
                                    viewAllLink="/reports/low-stock-alerts"
                                    pagination={{ pageSize: 5, size: "small" }}
                                />
                            </div>
                        </Col>
                    </Row>

                    {/* Second row: Recent Orders (full width) */}
                    <Row gutter={[16, 16]} className="sm:gutter-24">
                        <Col xs={24}>
                            <div className="min-h-0 h-full shadow-lg">
                                <DataTable
                                    title="Recent Orders"
                                    columns={recentOrdersColumns}
                                    dataSource={dashboardData.recentOrders.slice(
                                        0,
                                        8
                                    )}
                                    viewAllLink="/orders"
                                    pagination={{ pageSize: 8, size: "small" }}
                                />
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
