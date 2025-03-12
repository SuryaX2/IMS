import React, { useMemo } from "react";
import { Card, Empty, Typography, Spin } from "antd";
import { Area } from "@ant-design/plots";
import { LineChartOutlined, CalendarOutlined } from "@ant-design/icons";
const { Text, Title } = Typography;

const SalesChart = ({ salesData = {}, loading = false }) => {
    // Extract the salesByDate array from the backend data structure
    const salesByDate = useMemo(() => {
        // Handle different data formats that might be passed from Dashboard
        if (Array.isArray(salesData)) {
            return salesData; // If salesData is already an array
        } else if (
            salesData?.salesByDate &&
            Array.isArray(salesData.salesByDate)
        ) {
            return salesData.salesByDate; // If salesData contains salesByDate array
        }
        return []; // Default empty array if no valid data
    }, [salesData]);

    // Transform data for the chart (backend sends _id as date and total as sales value)
    const chartData = useMemo(
        () =>
            salesByDate.map((item) => ({
                date: item._id,
                sales: item.total,
                orders: item.orders || 0, // Ensure orders has a default value
            })),
        [salesByDate]
    );

    const hasSalesData = chartData && chartData.length > 0;

    // Calculate metrics for the summary cards
    const totalSales = useMemo(
        () =>
            hasSalesData
                ? chartData.reduce((sum, item) => sum + item.sales, 0)
                : 0,
        [chartData, hasSalesData]
    );

    const totalOrders = useMemo(
        () =>
            hasSalesData
                ? chartData.reduce((sum, item) => sum + (item.orders || 0), 0)
                : 0,
        [chartData, hasSalesData]
    );

    const averageSales = useMemo(
        () =>
            hasSalesData && chartData.length > 0
                ? totalSales / chartData.length
                : 0,
        [totalSales, chartData, hasSalesData]
    );

    // Calculate trend by comparing first and last parts of the data
    const trend = useMemo(() => {
        if (!hasSalesData || chartData.length < 2) return 0;

        const splitPoint = Math.floor(chartData.length / 2);
        const firstHalf = chartData.slice(0, splitPoint);
        const secondHalf = chartData.slice(splitPoint);

        const firstHalfTotal = firstHalf.reduce(
            (sum, item) => sum + item.sales,
            0
        );
        const secondHalfTotal = secondHalf.reduce(
            (sum, item) => sum + item.sales,
            0
        );

        if (firstHalfTotal === 0) return secondHalfTotal > 0 ? 100 : 0;
        return ((secondHalfTotal - firstHalfTotal) / firstHalfTotal) * 100;
    }, [chartData, hasSalesData]);

    // Area chart configuration
    const areaConfig = {
        data: chartData,
        xField: "date",
        yField: "sales",
        seriesField: "type",
        xAxis: {
            type: "time",
            tickCount: 5,
            label: {
                formatter: (v) => {
                    const date = new Date(v);
                    return `${date.getDate()}/${date.getMonth() + 1}`;
                },
            },
        },
        yAxis: {
            label: {
                formatter: (v) => `$${Number(v).toLocaleString()}`,
            },
        },
        smooth: true,
        areaStyle: () => ({
            fill: "l(270) 0:rgba(24,144,255,0.0) 0.5:rgba(24,144,255,0.2) 1:rgba(24,144,255,0.4)",
        }),
        line: {
            color: "#1890ff",
            size: 2.5,
        },
        point: {
            size: 3,
            shape: "circle",
            style: {
                fill: "#fff",
                stroke: "#1890ff",
                lineWidth: 2,
            },
        },
        meta: {
            sales: {
                alias: "Sales Amount",
                formatter: (v) => `$${Number(v).toLocaleString()}`,
            },
            date: {
                alias: "Date",
            },
        },
        tooltip: {
            showMarkers: true,
            formatter: (data) => {
                const date = new Date(data.date);
                const formattedDate = date.toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                });

                return {
                    name: "Sales",
                    value: `$${Number(data.sales).toLocaleString()}`,
                    title: formattedDate,
                };
            },
        },
        animation: {
            appear: {
                animation: "wave-in",
                duration: 1500,
            },
        },
    };

    return (
        <Card
            title={
                <div className="flex items-center">
                    <LineChartOutlined
                        style={{ color: "#1890ff", marginRight: 8 }}
                    />
                    <span>Sales Trend</span>
                </div>
            }
            extra={
                <a
                    href="/reports/sales"
                    className="text-blue-500 hover:text-blue-700 flex items-center"
                >
                    <CalendarOutlined style={{ marginRight: 4 }} /> View Full
                    Report
                </a>
            }
            className="shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200"
            styles={{ padding: "12px 24px" }}
            loading={loading}
        >
            {loading ? (
                <div className="flex justify-center items-center h-80">
                    <Spin size="large" />
                </div>
            ) : hasSalesData ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 mt-2">
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg shadow-sm">
                            <Text type="secondary" className="text-sm">
                                Total Sales
                            </Text>
                            <Title level={3} className="m-0 text-blue-700">
                                ${totalSales.toLocaleString()}
                            </Title>
                        </div>

                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg shadow-sm">
                            <Text type="secondary" className="text-sm">
                                Orders
                            </Text>
                            <Title level={3} className="m-0 text-gray-700">
                                {totalOrders}
                            </Title>
                        </div>

                        <div
                            className={`bg-gradient-to-r ${
                                trend > 0
                                    ? "from-green-50 to-green-100"
                                    : trend < 0
                                      ? "from-red-50 to-red-100"
                                      : "from-gray-50 to-gray-100"
                            } p-4 rounded-lg shadow-sm`}
                        >
                            <Text type="secondary" className="text-sm">
                                Trend
                            </Text>
                            <Title
                                level={3}
                                className={`m-0 flex items-center ${
                                    trend > 0
                                        ? "text-green-600"
                                        : trend < 0
                                          ? "text-red-600"
                                          : "text-gray-600"
                                }`}
                            >
                                {trend > 0 ? (
                                    <LineChartOutlined
                                        style={{ marginRight: 8 }}
                                    />
                                ) : trend < 0 ? (
                                    <LineChartOutlined
                                        style={{ marginRight: 8 }}
                                    />
                                ) : null}
                                {trend > 0 ? "+" : ""}
                                {trend.toFixed(1)}%
                            </Title>
                        </div>
                    </div>

                    <div style={{ height: 350 }}>
                        <Area {...areaConfig} />
                    </div>

                    <div className="text-xs text-gray-500 mt-4 text-right">
                        Average daily sales: ${averageSales.toLocaleString()}
                    </div>
                </>
            ) : (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                        <div className="text-center p-8">
                            <Title
                                level={5}
                                className="text-gray-500 mt-0 mb-2"
                            >
                                No Sales Data Available
                            </Title>
                            <p className="text-gray-400">
                                Sales data will appear here once you have
                                recorded orders. Start by creating an order to
                                see your sales trend.
                            </p>
                        </div>
                    }
                />
            )}
        </Card>
    );
};

export default SalesChart;
