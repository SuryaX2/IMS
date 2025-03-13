import React, { useMemo } from "react";
import { Card, Empty, Typography, Spin } from "antd";
import {
    LineChartOutlined,
    CalendarOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
} from "@ant-design/icons";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

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
                date: item._id, // Use the date string directly
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

    // Custom tooltip for the Recharts component
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-200 shadow-md rounded">
                    <p className="text-gray-600 font-medium">{label}</p>
                    <p className="text-blue-600 font-bold">
                        ${Number(payload[0].value).toLocaleString()}
                    </p>
                </div>
            );
        }
        return null;
    };

    // Format dollar values
    const formatDollar = (value) => `$${Number(value).toLocaleString()}`;

    // Get summary data directly from the API response if available
    const summaryData = useMemo(() => {
        if (salesData && salesData.summary) {
            return salesData.summary;
        }
        return {
            totalSales,
            totalOrders,
        };
    }, [salesData, totalSales, totalOrders]);

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
                                ${summaryData.totalSales.toLocaleString()}
                            </Title>
                        </div>

                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg shadow-sm">
                            <Text type="secondary" className="text-sm">
                                Orders
                            </Text>
                            <Title level={3} className="m-0 text-gray-700">
                                {summaryData.totalOrders}
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
                                    <ArrowUpOutlined
                                        style={{ marginRight: 8 }}
                                        className="text-green-600"
                                    />
                                ) : trend < 0 ? (
                                    <ArrowDownOutlined
                                        style={{ marginRight: 8 }}
                                        className="text-red-600"
                                    />
                                ) : null}
                                {trend > 0 ? "+" : ""}
                                {trend.toFixed(1)}%
                            </Title>
                        </div>
                    </div>

                    <div style={{ height: 350, width: "100%" }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={chartData}
                                margin={{
                                    top: 10,
                                    right: 30,
                                    left: 0,
                                    bottom: 0,
                                }}
                            >
                                <defs>
                                    <linearGradient
                                        id="colorSales"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="#1890ff"
                                            stopOpacity={0.1}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="#1890ff"
                                            stopOpacity={0.01}
                                        />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tickMargin={10}
                                    tick={{ fill: "#6b7280", fontSize: 12 }}
                                />
                                <YAxis
                                    tickFormatter={formatDollar}
                                    axisLine={false}
                                    tickLine={false}
                                    tickMargin={10}
                                    tick={{ fill: "#6b7280", fontSize: 12 }}
                                />
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="#e5e7eb"
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="sales"
                                    stroke="#1890ff"
                                    strokeWidth={2.5}
                                    fillOpacity={1}
                                    fill="url(#colorSales)"
                                    activeDot={{
                                        r: 6,
                                        strokeWidth: 2,
                                        stroke: "#fff",
                                        fill: "#1890ff",
                                    }}
                                    dot={{
                                        r: 4,
                                        strokeWidth: 2,
                                        stroke: "#1890ff",
                                        fill: "#fff",
                                    }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="text-xs text-gray-500 mt-4 text-right">
                        Average sales per day: ${averageSales.toLocaleString()}
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
