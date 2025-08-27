import React, { useState, useContext, useEffect } from "react";
import { Card, Tabs, Badge, Button, Space, Alert, Tooltip } from "antd";
import {
    FileTextOutlined,
    ShoppingCartOutlined,
    InboxOutlined,
    TrophyOutlined,
    AlertOutlined,
    BarChartOutlined,
    MailOutlined,
    ClockCircleOutlined,
    SettingOutlined,
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
    const [triggeringAlert, setTriggeringAlert] = useState(false);
    const [schedulerStatus, setSchedulerStatus] = useState(null);
    const { user } = useContext(AuthContext);
    const isMobile = window.innerWidth < 768;

    // New function for admin to manually trigger alerts (for testing)
    const triggerLowStockAlert = async () => {
        try {
            setTriggeringAlert(true);
            const response = await api.post("/scheduler/trigger-alerts");

            if (response.data.success) {
                const { sent, failed, noLowStock, total } = response.data.data;
                toast.success(
                    `Alert process completed! 📧 Sent: ${sent}, ✅ No low stock: ${noLowStock}, ❌ Failed: ${failed} (Total users: ${total})`
                );
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Failed to trigger low stock alerts"
            );
        } finally {
            setTriggeringAlert(false);
        }
    };

    // Get scheduler status (for admin)
    const getSchedulerStatus = async () => {
        try {
            const response = await api.get("/scheduler/status");
            if (response.data.success) {
                setSchedulerStatus(response.data.data);
            }
        } catch (error) {
            console.error("Failed to get scheduler status:", error);
        }
    };

    // Load scheduler status on component mount for admin
    useEffect(() => {
        if (user?.role === "admin") {
            getSchedulerStatus();
        }
    }, [user]);

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

            {/* Automatic Low Stock Alert Info */}
            <Alert
                message="📧 Automatic Low Stock Alerts"
                description={
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <span className={isMobile ? "text-xs" : "text-sm"}>
                                Low stock email alerts are automatically sent
                                every Monday at 9:00 AM.
                                {user?.role === "admin"
                                    ? " You can manually trigger alerts for testing."
                                    : " Check your email regularly for important stock notifications."}
                            </span>
                            {user?.role === "admin" && (
                                <div className="flex gap-2 items-center">
                                    {schedulerStatus && (
                                        <Badge
                                            status={
                                                schedulerStatus.isRunning
                                                    ? "processing"
                                                    : "error"
                                            }
                                            text={
                                                schedulerStatus.isRunning
                                                    ? "Running"
                                                    : "Stopped"
                                            }
                                        />
                                    )}
                                    <Button
                                        type="link"
                                        icon={<SettingOutlined />}
                                        size="small"
                                        onClick={triggerLowStockAlert}
                                        loading={triggeringAlert}
                                    >
                                        Test Alerts
                                    </Button>
                                </div>
                            )}
                        </div>
                        {schedulerStatus && user?.role === "admin" && (
                            <div className="text-xs text-gray-500">
                                Threshold: {schedulerStatus.threshold} units |
                                Next run:{" "}
                                {schedulerStatus.nextRun
                                    ? new Date(
                                          schedulerStatus.nextRun
                                      ).toLocaleString()
                                    : "Not scheduled"}
                            </div>
                        )}
                    </div>
                }
                type="success"
                showIcon
                icon={<ClockCircleOutlined />}
                className="mb-4 sm:mb-6"
            />

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
                        {user?.role === "admin" && (
                            <Tooltip title="Manually trigger low stock alerts for all users (for testing purposes)">
                                <Button
                                    type="primary"
                                    icon={<AlertOutlined />}
                                    onClick={triggerLowStockAlert}
                                    loading={triggeringAlert}
                                    size={isMobile ? "middle" : "default"}
                                    disabled={
                                        schedulerStatus &&
                                        !schedulerStatus.isRunning
                                    }
                                >
                                    {isMobile
                                        ? "Test Alerts"
                                        : "Trigger Test Alerts"}
                                </Button>
                            </Tooltip>
                        )}
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
                    📧 Low stock alerts automatically sent every Monday at 9:00
                    AM
                </p>
                <p className="mt-1 px-2">
                    Last updated: {new Date().toLocaleString()}
                </p>
            </div>
        </div>
    );
};

export default Reports;
