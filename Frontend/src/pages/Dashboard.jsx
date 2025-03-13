import React, { useState, useEffect } from "react";
import { Card, Row, Col, Tag, Divider, Typography, theme } from "antd";
import {
    DollarOutlined,
    InboxOutlined,
    ShoppingCartOutlined,
    ShoppingOutlined,
    WarningOutlined,
    AreaChartOutlined,
    PieChartOutlined,
} from "@ant-design/icons";
import toast from "react-hot-toast";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatCard from "../components/dashboard/StatCard";
import ProductDistribution from "../components/dashboard/ProductDistribution";
import DataTable from "../components/dashboard/DataTable";
import LoadingSpinner from "../components/dashboard/LoadingSpinner";
import ErrorDisplay from "../components/dashboard/ErrorDisplay";
import { api } from "../api/api";
import SalesChart from "../components/dashboard/SalesChart/.";

const { useToken } = theme;

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

    useEffect(() => {
        fetchDashboardData();
    }, []);

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
                api.get("/reports/dashboard"),
                api.get("/reports/top-products"),
                api.get("/reports/sales"),
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

    if (loading) {
        return <LoadingSpinner tip="Loading dashboard data..." />;
    }

    if (error) {
        return <ErrorDisplay error={error} />;
    }

    return (
        <div className="px-4 py-6">
            <DashboardHeader />

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

            <Divider className="my-8">
                <h1 className="text-xl m-0 flex items-center">
                    <AreaChartOutlined className="mr-2" /> Analytics
                </h1>
            </Divider>

            {/* Sales trend chart and product distribution */}
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={16}>
                    <SalesChart salesData={dashboardData.salesData} />
                </Col>
                <Col xs={24} lg={8}>
                    <ProductDistribution
                        topProducts={dashboardData.topProducts}
                    />
                </Col>
            </Row>

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
