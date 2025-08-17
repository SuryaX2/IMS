import React, { useState, useContext } from "react";
import { Card, Tabs, Badge, Button, Space, Alert } from "antd";
import {
    FileTextOutlined,
    ShoppingCartOutlined,
    InboxOutlined,
    TrophyOutlined,
    AlertOutlined,
    BarChartOutlined,
    MailOutlined,
} from "@ant-design/icons";
import PageHeader from "../components/common/PageHeader";
import StockReport from "../components/reports/StockReport";
import SalesReport from "../components/reports/SalesReport";
import PurchaseReport from "../components/reports/PurchaseReport";
import TopProductsReport from "../components/reports/TopProductsReport";
import AuthContext from "../context/AuthContext";
import { api } from "../api/api";
import toast from "react-hot-toast";

const Reports = () => {
    const [activeTab, setActiveTab] = useState("stock");
    const [sendingAlert, setSendingAlert] = useState(false);
    const { user } = useContext(AuthContext);

    const sendLowStockAlert = async () => {
        try {
            setSendingAlert(true);
            const response = await api.get(
                "/reports/low-stock-alerts?sendEmail=true&threshold=10"
            );

            if (response.data.success) {
                const emailSent = response.data.data.emailSent;
                const alertCount = response.data.data.lowStockProducts.length;

                if (emailSent) {
                    toast.success(
                        `Low stock alert email sent! Found ${alertCount} products with low stock.`
                    );
                } else if (alertCount === 0) {
                    toast.success(
                        "Great! No products are currently low on stock."
                    );
                } else {
                    toast.info(
                        `Found ${alertCount} low stock products, but email could not be sent.`
                    );
                }
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Failed to send low stock alert"
            );
        } finally {
            setSendingAlert(false);
        }
    };

    const tabItems = [
        {
            key: "stock",
            label: (
                <span className="flex items-center">
                    <InboxOutlined className="mr-1" />
                    Stock Report
                </span>
            ),
            children: <StockReport />,
        },
        {
            key: "sales",
            label: (
                <span className="flex items-center">
                    <ShoppingCartOutlined className="mr-1" />
                    Sales Report
                </span>
            ),
            children: <SalesReport />,
        },
        {
            key: "purchases",
            label: (
                <span className="flex items-center">
                    <FileTextOutlined className="mr-1" />
                    Purchase Report
                </span>
            ),
            children: <PurchaseReport />,
        },
        {
            key: "top-products",
            label: (
                <span className="flex items-center">
                    <TrophyOutlined className="mr-1" />
                    Top Products
                </span>
            ),
            children: <TopProductsReport />,
        },
    ];

    const reportDescriptions = {
        stock: "Monitor your inventory levels, track stock status, and identify products that need restocking.",
        sales: "Analyze your sales performance over time, track revenue trends, and identify your best-selling products.",
        purchases:
            "Review your purchasing patterns, supplier performance, and procurement costs analysis.",
        "top-products":
            "Discover your most profitable products and understand customer preferences based on sales data.",
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <PageHeader
                title="Business Reports & Analytics"
                subtitle="Comprehensive insights into your business performance and inventory management"
            />

            {/* Admin Notice */}
            {user?.role === "admin" && (
                <Alert
                    message="Admin View"
                    description="You are viewing reports across all users in the system. Regular users will only see their own data."
                    type="info"
                    showIcon
                    className="mb-6"
                />
            )}

            {/* Quick Actions */}
            <Card className="mb-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">
                            Quick Actions
                        </h3>
                        <p className="text-gray-600">
                            {reportDescriptions[activeTab]}
                        </p>
                    </div>
                    <Space>
                        <Button
                            type="primary"
                            icon={<MailOutlined />}
                            onClick={sendLowStockAlert}
                            loading={sendingAlert}
                            className="bg-orange-500 border-orange-500 hover:bg-orange-600"
                        >
                            Send Low Stock Alert
                        </Button>
                        <Button
                            icon={<BarChartOutlined />}
                            onClick={() => window.print()}
                        >
                            Print Report
                        </Button>
                    </Space>
                </div>
            </Card>

            {/* Reports Tabs */}
            <Card className="shadow-sm">
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={tabItems}
                    size="large"
                    className="custom-tabs"
                    tabBarStyle={{
                        marginBottom: "24px",
                        borderBottom: "2px solid #f0f0f0",
                    }}
                    tabBarExtraContent={
                        <div className="flex items-center space-x-2">
                            <Badge
                                status={
                                    activeTab === "stock"
                                        ? "processing"
                                        : "default"
                                }
                                text={activeTab === "stock" ? "Active" : ""}
                            />
                            {activeTab === "stock" && (
                                <AlertOutlined
                                    className="text-orange-500"
                                    title="Stock monitoring active"
                                />
                            )}
                        </div>
                    }
                />
            </Card>

            {/* Footer Info */}
            <div className="mt-8 text-center text-gray-500 text-sm">
                <p>
                    Reports are generated in real-time based on your latest
                    data.
                    {user?.role === "admin"
                        ? " Admin view shows system-wide data."
                        : " Data is filtered to your account."}
                </p>
                <p className="mt-1">
                    Last updated: {new Date().toLocaleString()}
                </p>
            </div>
        </div>
    );
};

export default Reports;
