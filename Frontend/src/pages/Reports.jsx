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
    const isMobile = window.innerWidth < 768;

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
                <span
                    className={`flex items-center ${isMobile ? "text-xs" : "text-sm"}`}
                >
                    <InboxOutlined
                        className={`${isMobile ? "mr-1 text-xs" : "mr-1 text-sm"}`}
                    />
                    {isMobile ? "Stock" : "Stock Report"}
                </span>
            ),
            children: <StockReport />,
        },
        {
            key: "sales",
            label: (
                <span
                    className={`flex items-center ${isMobile ? "text-xs" : "text-sm"}`}
                >
                    <ShoppingCartOutlined
                        className={`${isMobile ? "mr-1 text-xs" : "mr-1 text-sm"}`}
                    />
                    {isMobile ? "Sales" : "Sales Report"}
                </span>
            ),
            children: <SalesReport />,
        },
        {
            key: "purchases",
            label: (
                <span
                    className={`flex items-center ${isMobile ? "text-xs" : "text-sm"}`}
                >
                    <FileTextOutlined
                        className={`${isMobile ? "mr-1 text-xs" : "mr-1 text-sm"}`}
                    />
                    {isMobile ? "Purchases" : "Purchase Report"}
                </span>
            ),
            children: <PurchaseReport />,
        },
        {
            key: "top-products",
            label: (
                <span
                    className={`flex items-center ${isMobile ? "text-xs" : "text-sm"}`}
                >
                    <TrophyOutlined
                        className={`${isMobile ? "mr-1 text-xs" : "mr-1 text-sm"}`}
                    />
                    {isMobile ? "Top" : "Top Products"}
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
        <div className="p-3 sm:p-6 max-w-7xl mx-auto">
            <PageHeader
                title={
                    <span className="text-lg sm:text-xl md:text-2xl">
                        {isMobile
                            ? "Reports & Analytics"
                            : "Business Reports & Analytics"}
                    </span>
                }
                subtitle={
                    <span className="text-sm sm:text-base">
                        {isMobile
                            ? "Comprehensive business insights"
                            : "Comprehensive insights into your business performance and inventory management"}
                    </span>
                }
            />

            {/* Admin Notice */}
            {user?.role === "admin" && (
                <Alert
                    message="Admin View"
                    description={
                        isMobile
                            ? "Viewing system-wide data. Regular users see only their own data."
                            : "You are viewing reports across all users in the system. Regular users will only see their own data."
                    }
                    type="info"
                    showIcon
                    className="mb-4 sm:mb-6"
                />
            )}

            {/* Quick Actions */}
            <Card
                className="mb-4 sm:mb-6"
                size={isMobile ? "small" : "default"}
            >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                        <h3
                            className={`font-semibold mb-2 ${
                                isMobile ? "text-base" : "text-lg"
                            }`}
                        >
                            Quick Actions
                        </h3>
                        <p
                            className={`text-gray-600 ${
                                isMobile ? "text-xs" : "text-sm"
                            }`}
                        >
                            {isMobile
                                ? "Business insights and actions"
                                : reportDescriptions[activeTab]}
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
                        <Button
                            type="primary"
                            icon={<MailOutlined />}
                            onClick={sendLowStockAlert}
                            loading={sendingAlert}
                            size={isMobile ? "middle" : "default"}
                        >
                            {isMobile ? "Stock Alert" : "Send Low Stock Alert"}
                        </Button>
                        <Button
                            icon={<BarChartOutlined />}
                            onClick={() => window.print()}
                            size={isMobile ? "middle" : "default"}
                        >
                            {isMobile ? "Print" : "Print Report"}
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Reports Tabs */}
            <Card className="shadow-sm" size={isMobile ? "small" : "default"}>
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={tabItems}
                    size={isMobile ? "default" : "large"}
                    className="custom-tabs"
                    tabBarStyle={{
                        marginBottom: isMobile ? "16px" : "24px",
                        borderBottom: "2px solid #f0f0f0",
                    }}
                    tabPosition={isMobile ? "top" : "top"}
                    tabBarExtraContent={
                        !isMobile ? (
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
                        ) : null
                    }
                />
            </Card>

            {/* Mobile Active Tab Indicator */}
            {isMobile && (
                <Card className="mb-4" size="small">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Badge
                                status={
                                    activeTab === "stock"
                                        ? "processing"
                                        : "default"
                                }
                                text={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace("-", " ")} Report`}
                            />
                            {activeTab === "stock" && (
                                <AlertOutlined
                                    className="text-orange-500"
                                    title="Stock monitoring active"
                                />
                            )}
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 mb-0">
                        {reportDescriptions[activeTab]}
                    </p>
                </Card>
            )}

            {/* Footer Info */}
            <div
                className={`mt-6 sm:mt-8 text-center text-gray-500 ${
                    isMobile ? "text-xs" : "text-sm"
                }`}
            >
                <p className="px-2">
                    Reports are generated in real-time based on your latest
                    data.
                    {user?.role === "admin"
                        ? " Admin view shows system-wide data."
                        : " Data is filtered to your account."}
                </p>
                <p className="mt-1 px-2">
                    Last updated: {new Date().toLocaleString()}
                </p>
            </div>
        </div>
    );
};

export default Reports;
