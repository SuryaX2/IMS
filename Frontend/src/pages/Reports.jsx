import React from "react";
import { Card, Tabs } from "antd";
import {
    FileTextOutlined,
    ShoppingCartOutlined,
    InboxOutlined,
    BarChartOutlined,
} from "@ant-design/icons";
import PageHeader from "../components/common/PageHeader";
import StockReport from "../components/reports/StockReport";
import SalesReport from "../components/reports/SalesReport";
import PurchaseReport from "../components/reports/PurchaseReport";
import SalesVsPurchasesReport from "../components/reports/SalesVsPurchasesReport";

const Reports = () => {
    const tabItems = [
        {
            key: "stock",
            label: (
                <span>
                    <InboxOutlined />
                    Stock Report
                </span>
            ),
            children: <StockReport />,
        },
        {
            key: "sales",
            label: (
                <span>
                    <ShoppingCartOutlined />
                    Sales Report
                </span>
            ),
            children: <SalesReport />,
        },
        {
            key: "purchases",
            label: (
                <span>
                    <FileTextOutlined />
                    Purchase Report
                </span>
            ),
            children: <PurchaseReport />,
        },
        {
            key: "comparison",
            label: (
                <span>
                    <BarChartOutlined />
                    Sales vs Purchases
                </span>
            ),
            children: <SalesVsPurchasesReport />,
        },
    ];

    return (
        <div className="p-6">
            <PageHeader
                title="Reports"
                subtitle="View comprehensive reports for your business analytics"
            />
            <Card className="mt-6">
                <Tabs
                    defaultActiveKey="stock"
                    items={tabItems}
                    size="large"
                    className="custom-tabs"
                />
            </Card>
        </div>
    );
};

export default Reports;
