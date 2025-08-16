import React from "react";
import { Card, Row, Col, Statistic, Table, Empty } from "antd";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import {
    DollarOutlined,
    ShoppingCartOutlined,
    RiseOutlined,
} from "@ant-design/icons";
import useDateRange from "../../hooks/reports/useDateRange";
import useReportData from "../../hooks/reports/useReportData";
import useExportCSV from "../../hooks/reports/useExportCSV";
import {
    formatCurrency,
    formatDateForChart,
    createStatisticsConfig,
} from "../../utils/reports/reportUtils";
import {
    createTableConfig,
    getTableProps,
    createTableSummary,
} from "../../utils/reports/tableUtils";
import { EXPORT_CONFIGS } from "../../utils/reports/exportUtils";
import ReportChart from "../common/reports/ReportChart";
import ReportHeader from "../common/reports/ReportHeader";

const SalesReport = () => {
    const { dateRange, handleDateRangeChange, getAPIParams } = useDateRange();
    const { data: salesData, loading } = useReportData(
        "/reports/sales",
        getAPIParams(),
        [dateRange]
    );
    const { exportCustomCSV } = useExportCSV();

    const handleExport = () => {
        exportCustomCSV(
            salesData?.salesByProduct || [],
            EXPORT_CONFIGS.sales,
            "sales-report"
        );
    };

    // Process data
    const processedData = {
        salesByDate: salesData?.salesByDate || [],
        salesByProduct: salesData?.salesByProduct || [],
        summary: salesData?.summary || { totalSales: 0, totalOrders: 0 },
    };

    // Chart data
    const chartData = processedData.salesByDate.map((item) => ({
        date: formatDateForChart(item._id),
        sales: item.total,
        orders: item.orders,
    }));

    // Statistics
    const averageSales =
        processedData.salesByDate.length > 0
            ? processedData.summary.totalSales /
              processedData.salesByDate.length
            : 0;

    const statsConfig = [
        {
            key: "totalSales",
            title: "Total Sales",
            value: processedData.summary.totalSales,
            prefix: "₹",
            precision: 2,
            color: "#52c41a",
            iconType: "sales",
        },
        {
            key: "totalOrders",
            title: "Total Orders",
            value: processedData.summary.totalOrders,
            color: "#1890ff",
            iconType: "orders",
        },
        {
            key: "averageSales",
            title: "Average Daily Sales",
            value: averageSales,
            prefix: "₹",
            precision: 2,
            color: "#fa8c16",
            iconType: "average",
        },
        {
            key: "avgOrderValue",
            title: "Average Order Value",
            value:
                processedData.summary.totalOrders > 0
                    ? processedData.summary.totalSales /
                      processedData.summary.totalOrders
                    : 0,
            prefix: "₹",
            precision: 2,
            color: "#722ed1",
        },
    ];

    const statistics = createStatisticsConfig(
        { ...processedData.summary, averageSales },
        statsConfig
    );

    // Table configuration
    const tableConfig = createTableConfig("sales");

    const chartConfig = {
        lines: [
            {
                dataKey: "sales",
                name: "Sales",
                color: "#52c41a",
                formatter: (value) => [formatCurrency(value), "Sales"],
            },
            {
                dataKey: "orders",
                name: "Orders",
                color: "#1890ff",
                strokeWidth: 2,
            },
        ],
    };

    return (
        <div className="space-y-6">
            <ReportHeader
                dateRange={dateRange}
                onDateChange={handleDateRangeChange}
                onExport={handleExport}
                loading={loading}
                hasData={processedData.salesByProduct.length > 0}
            />

            {/* Statistics */}
            <Row gutter={[16, 16]}>
                {statistics.map((stat, index) => (
                    <Col key={index} xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic {...stat} />
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Chart */}
            <ReportChart
                title="Sales Trend"
                data={chartData}
                config={chartConfig}
                loading={loading}
                emptyText="No sales data available for the selected period"
            />

            {/* Table */}
            <Card title="Sales by Product - Detailed View">
                {processedData.salesByProduct.length > 0 ? (
                    <Table
                        {...getTableProps("sales")}
                        columns={tableConfig.columns}
                        dataSource={processedData.salesByProduct}
                        rowKey="_id"
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
        </div>
    );
};

export default SalesReport;
