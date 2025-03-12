import React, { useState, useEffect } from "react";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatCard from "../components/dashboard/StatCard";
import SalesChart from "../components/dashboard/SalesChart";
import ProductDistribution from "../components/dashboard/ProductDistribution";
import DataTable from "../components/dashboard/DataTable";
import LoadingSpinner from "../components/dashboard/LoadingSpinner";
import ErrorDisplay from "../components/dashboard/ErrorDisplay";
import { api } from "../api/api";
import { Row,Col,Tag } from "antd";
import { DollarOutlined, InboxOutlined, ShoppingCartOutlined, ShoppingOutlined, WarningOutlined } from "@ant-design/icons";

const Dashboard = () => {
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

    // Fetch dashboard data
    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Fetch dashboard metrics
            const dashboardResponse = await api.get("/reports/dashboard");

            // Fetch top products
            const topProductsResponse = await api.get("/reports/top-products");

            // Fetch sales report for trend data
            const currentDate = new Date();
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(currentDate.getDate() - 30);

            const startDate = thirtyDaysAgo.toISOString().split("T")[0];
            const endDate = currentDate.toISOString().split("T")[0];

            const salesReportResponse = await api.get(
                `/reports/sales?start_date=${startDate}&end_date=${endDate}`
            );

            if (dashboardResponse.data.success) {
                const metricsData = dashboardResponse.data.data;
                const topProductsData = topProductsResponse.data.data || [];
                const salesReportData = salesReportResponse.data.data || {};

                // Prepare sales trend data
                const salesTrend = salesReportData.salesByDate || [];

                setDashboardData({
                    ...metricsData,
                    salesData: salesTrend.map((item) => ({
                        date: item._id,
                        sales: item.total,
                    })),
                    topProducts: topProductsData,
                });
            } else {
                setError("Failed to fetch dashboard data");
            }
        } catch (err) {
            console.error("Dashboard data fetch error:", err);
            setError(
                err.response?.data?.message ||
                    "Something went wrong while fetching dashboard data"
            );
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
        },
        {
            title: "Units Sold",
            dataIndex: "quantity_sold",
            key: "quantity_sold",
            sorter: (a, b) => a.quantity_sold - b.quantity_sold,
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
        },
        {
            title: "Current Stock",
            dataIndex: "stock",
            key: "stock",
        },
        {
            title: "Status",
            key: "status",
            render: (_, record) => (
                <Tag color={record.stock === 0 ? "error" : "warning"}>
                    {record.stock === 0 ? "Out of Stock" : "Low Stock"}
                </Tag>
            ),
        },
    ];

    // Recent orders columns
    const recentOrdersColumns = [
        {
            title: "Order Number",
            dataIndex: "order_number",
            key: "order_number",
        },
        {
            title: "Customer",
            key: "customer",
            render: (_, record) =>
                record.customer_id?.name || "Unknown Customer",
        },
        {
            title: "Date",
            key: "date",
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
        <div>
            <Row gutter={[0, 16]}>
                <Col span={24}>
                    <DashboardHeader />
                </Col>
            </Row>

            {/* Key metrics - First Row */}
            <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
                <Col xs={24} sm={12} md={8}>
                    <StatCard
                        title="Total Sales"
                        value={dashboardData.totalSales}
                        prefix={<ShoppingCartOutlined />}
                        valueStyle={{ color: "#3f8600" }}
                    />
                </Col>
                <Col xs={24} sm={12} md={4}>
                    <StatCard
                        title="Total Purchases"
                        value={dashboardData.totalPurchase}
                        prefix={<ShoppingOutlined />}
                        valueStyle={{ color: "#1890ff" }}
                    />
                </Col>
                <Col xs={24} sm={12} md={12}>
                    <StatCard
                        title="Inventory Value"
                        value={dashboardData.inventoryValue}
                        prefix={<DollarOutlined />}
                        valueStyle={{ color: "#722ed1" }}
                    />
                </Col>
            </Row>

            {/* Key metrics - Second Row */}
            <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
                <Col xs={24} sm={8}>
                    <StatCard
                        title="Total Products"
                        value={dashboardData.totalProducts}
                        prefix={<InboxOutlined />}
                    />
                </Col>
                <Col xs={24} sm={8}>
                    <StatCard
                        title="Total Stock"
                        value={dashboardData.totalStock}
                        prefix={<ShoppingOutlined />}
                    />
                </Col>
                <Col xs={24} sm={8}>
                    <StatCard
                        title="Out of Stock Products"
                        value={dashboardData.outOfStockCount}
                        prefix={<WarningOutlined />}
                        valueStyle={{
                            color:
                                dashboardData.outOfStockCount > 0
                                    ? "#cf1322"
                                    : "#3f8600",
                        }}
                    />
                </Col>
            </Row>

            {/* Sales trend chart and product distribution */}
            <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
                <Col xs={24} lg={16}>
                    <SalesChart salesData={dashboardData.salesData} />
                </Col>
                <Col xs={24} lg={8}>
                    <ProductDistribution
                        topProducts={dashboardData.topProducts}
                    />
                </Col>
            </Row>

            {/* Tables section */}
            <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
                <Col xs={24} md={12}>
                    <DataTable
                        title="Top Selling Products"
                        columns={topProductsColumns}
                        dataSource={dashboardData.topProducts}
                        viewAllLink="/reports/top-products"
                    />
                </Col>
                <Col xs={24} md={12}>
                    <DataTable
                        title="Low Stock Alerts"
                        columns={lowStockColumns}
                        dataSource={dashboardData.lowStockProducts}
                        viewAllLink="/reports/low-stock-alerts"
                    />
                </Col>
            </Row>

            {/* Recent orders section */}
            <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
                <Col xs={24}>
                    <DataTable
                        title="Recent Orders"
                        columns={recentOrdersColumns}
                        dataSource={dashboardData.recentOrders}
                        viewAllLink="/orders"
                    />
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
