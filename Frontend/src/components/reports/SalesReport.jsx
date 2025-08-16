import React from "react";
import { Card, Row, Col, Statistic, Empty, Spin } from "antd";
import {
    DollarOutlined,
    ShoppingCartOutlined,
    RiseOutlined,
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

const SalesReport = () => {
    const { dateRange, handleDateRangeChange, getAPIParams } = useDateRange();
    const { data: salesData, loading } = useReportData(
        "/reports/sales",
        getAPIParams(),
        [dateRange]
    );
    const { exportCustomCSV } = useExportCSV();

    // Process data safely
    const processedData = {
        salesByDate: salesData?.salesByDate || [],
        salesByProduct: salesData?.salesByProduct || [],
        summary: salesData?.summary || { totalSales: 0, totalOrders: 0 },
    };

    const handleExport = () => {
        exportCustomCSV(
            processedData.salesByProduct,
            EXPORT_CONFIGS.sales,
            "sales-report"
        );
    };

    // Chart data
    const chartData = processedData.salesByDate.map((item) => ({
        date: formatDateForChart(item._id),
        sales: item.total || 0,
        orders: item.orders || 0,
    }));

    // Statistics configuration
    const statistics = [
        {
            title: "Total Sales",
            value: processedData.summary.totalSales,
            prefix: "₹",
            precision: 2,
            valueStyle: { color: "#52c41a" },
            suffix: <DollarOutlined />,
        },
        {
            title: "Total Orders",
            value: processedData.summary.totalOrders,
            valueStyle: { color: "#1890ff" },
            suffix: <ShoppingCartOutlined />,
        },
        {
            title: "Average Daily Sales",
            value:
                processedData.salesByDate.length > 0
                    ? processedData.summary.totalSales /
                      processedData.salesByDate.length
                    : 0,
            prefix: "₹",
            precision: 2,
            valueStyle: { color: "#fa8c16" },
            suffix: <RiseOutlined />,
        },
        {
            title: "Average Order Value",
            value:
                processedData.summary.totalOrders > 0
                    ? processedData.summary.totalSales /
                      processedData.summary.totalOrders
                    : 0,
            prefix: "₹",
            precision: 2,
            valueStyle: { color: "#722ed1" },
            suffix: <TeamOutlined />,
        },
    ];

    // Chart configuration
    const chartLines = [
        {
            dataKey: "sales",
            name: "Sales",
            stroke: "#52c41a",
            formatter: (value) => [formatCurrency(value), "Sales"],
        },
        {
            dataKey: "orders",
            name: "Orders",
            stroke: "#1890ff",
            strokeWidth: 2,
        },
    ];

    // Table configuration
    const tableConfig = createTableConfig("sales");

    return (
        <div className="space-y-6">
            <ReportHeader
                dateRange={dateRange}
                onDateChange={handleDateRangeChange}
                onExport={handleExport}
                loading={loading}
                hasData={processedData.salesByProduct.length > 0}
            />

            <Spin spinning={loading}>
                <StatisticsCards statistics={statistics} />

                <ReportChart
                    title="Sales Trend"
                    data={chartData}
                    chartType="line"
                    lines={chartLines}
                    emptyDescription="No sales data available for the selected period"
                />

                <Card title="Sales by Product - Detailed View">
                    {processedData.salesByProduct.length > 0 ? (
                        <ReportTable
                            {...getTableProps("sales")}
                            columns={tableConfig.columns}
                            dataSource={processedData.salesByProduct}
                            loading={loading}
                            summary={(pageData) =>
                                createTableSummary(
                                    pageData,
                                    tableConfig.summaryFields,
                                    "sales"
                                )
                            }
                        />
                    ) : (
                        <Empty description="No sales data available for the selected period" />
                    )}
                </Card>
            </Spin>
        </div>
    );
};

export default SalesReport;
