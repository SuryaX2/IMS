import React from "react";
import { Card, Empty, Spin } from "antd";
import {
    ShoppingOutlined,
    FileTextOutlined,
    TeamOutlined,
} from "@ant-design/icons";

// Hooks
import useDateRange from "../../hooks/reports/useDateRange";
import useReportData from "../../hooks/reports/useReportData";
import useExportCSV from "../../hooks/reports/useExportCSV";

// Utils
import {
    formatCurrency,
    formatDateForChart,
} from "../../utils/reports/reportUtils";
import {
    createTableConfig,
    getTableProps,
    createTableSummary,
} from "../../utils/reports/tableUtils";
import { EXPORT_CONFIGS } from "../../utils/reports/exportUtils";

// Components
import ReportChart from "../common/reports/ReportChart";
import ReportHeader from "../common/reports/ReportHeader";
import ReportTable from "../common/reports/ReportTable";
import StatisticsCards from "../common/reports/StatisticsCards";

const PurchaseReport = () => {
    const { dateRange, handleDateRangeChange, getAPIParams } = useDateRange();
    const { data: purchaseData, loading } = useReportData(
        "/reports/purchases",
        getAPIParams(),
        [dateRange]
    );
    const { exportCustomCSV } = useExportCSV();

    // Process data safely
    const processedData = {
        purchasesByDate: purchaseData?.purchasesByDate || [],
        purchasesBySupplier: purchaseData?.purchasesBySupplier || [],
    };

    const handleExport = () => {
        exportCustomCSV(
            processedData.purchasesBySupplier,
            EXPORT_CONFIGS.purchases,
            "purchase-report"
        );
    };

    // Chart data
    const chartData = processedData.purchasesByDate.map((item) => ({
        date: formatDateForChart(item._id),
        purchases: item.count || 0,
    }));

    // Calculate statistics
    const totalPurchases = processedData.purchasesBySupplier.reduce(
        (sum, item) => sum + (item.total_purchases || 0),
        0
    );
    const totalOrders = processedData.purchasesBySupplier.reduce(
        (sum, item) => sum + (item.count || 0),
        0
    );
    const averagePurchaseValue =
        totalOrders > 0 ? totalPurchases / totalOrders : 0;

    // Statistics configuration
    const statistics = [
        {
            title: "Total Purchase Value",
            value: totalPurchases,
            prefix: "₹",
            precision: 2,
            valueStyle: { color: "#1890ff" },
            suffix: <ShoppingOutlined />,
        },
        {
            title: "Total Purchase Orders",
            value: totalOrders,
            valueStyle: { color: "#52c41a" },
            suffix: <FileTextOutlined />,
        },
        {
            title: "Average Purchase Value",
            value: averagePurchaseValue,
            prefix: "₹",
            precision: 2,
            valueStyle: { color: "#fa8c16" },
            suffix: <TeamOutlined />,
        },
    ];

    // Chart configuration
    const chartLines = [
        {
            dataKey: "purchases",
            name: "Purchase Orders",
            stroke: "#1890ff",
            strokeWidth: 3,
        },
    ];

    // Table configuration
    const tableConfig = createTableConfig("purchases");

    return (
        <div className="space-y-6">
            <ReportHeader
                dateRange={dateRange}
                onDateChange={handleDateRangeChange}
                onExport={handleExport}
                loading={loading}
                hasData={processedData.purchasesBySupplier.length > 0}
            />

            <Spin spinning={loading}>
                <StatisticsCards statistics={statistics} />

                <ReportChart
                    title="Purchase Trend"
                    data={chartData}
                    chartType="line"
                    lines={chartLines}
                    emptyDescription="No purchase data available for the selected period"
                />

                <Card title="Purchases by Supplier - Detailed View">
                    {processedData.purchasesBySupplier.length > 0 ? (
                        <ReportTable
                            {...getTableProps("purchases")}
                            columns={tableConfig.columns}
                            dataSource={processedData.purchasesBySupplier}
                            loading={loading}
                            summary={(pageData) =>
                                createTableSummary(
                                    pageData,
                                    tableConfig.summaryFields,
                                    "purchases"
                                )
                            }
                        />
                    ) : (
                        <Empty description="No purchase data available for the selected period" />
                    )}
                </Card>
            </Spin>
        </div>
    );
};

export default PurchaseReport;
