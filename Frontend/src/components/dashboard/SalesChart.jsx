import React, { useMemo } from "react";
import { Empty, Typography, Spin } from "antd";
import {
    LineChartOutlined,
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
                <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg">
                    <p className="text-gray-600 font-medium text-xs sm:text-sm">
                        {label}
                    </p>
                    <p className="text-blue-600 font-bold text-sm sm:text-base">
                        ${Number(payload[0].value).toLocaleString()}
                    </p>
                </div>
            );
        }
        return null;
    };

    // Format dollar values
    const formatDollar = (value) => `${Number(value).toLocaleString()}`;

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
        <div className="h-full p-3 sm:p-6 bg-white rounded-xl border border-gray-100">
            <div className="flex items-center mb-4 sm:mb-6">
                <LineChartOutlined className="text-blue-600 mr-2 sm:mr-3 text-lg sm:text-xl" />
                <h1 className="m-0 text-gray-800 font-bold text-lg sm:text-xl">
                    Sales Performance
                </h1>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-60 sm:h-80">
                    <Spin size="large" />
                </div>
            ) : hasSalesData ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 sm:p-4 rounded-xl shadow-sm border border-blue-100">
                            <Text className="text-blue-700 text-xs sm:text-sm font-medium">
                                Total Sales
                            </Text>
                            <Title
                                level={4}
                                className="m-0 text-blue-800 mt-1 text-lg sm:text-xl"
                            >
                                ${summaryData.totalSales.toLocaleString()}
                            </Title>
                        </div>

                        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-3 sm:p-4 rounded-xl shadow-sm border border-indigo-100">
                            <Text className="text-indigo-700 text-xs sm:text-sm font-medium">
                                Total Orders
                            </Text>
                            <Title
                                level={4}
                                className="m-0 text-indigo-800 mt-1 text-lg sm:text-xl"
                            >
                                {summaryData.totalOrders}
                            </Title>
                        </div>

                        <div
                            className={`bg-gradient-to-br ${
                                trend > 0
                                    ? "from-green-50 to-green-100 border-green-100"
                                    : trend < 0
                                      ? "from-red-50 to-red-100 border-red-100"
                                      : "from-gray-50 to-gray-100 border-gray-100"
                            } p-3 sm:p-4 rounded-xl shadow-sm border`}
                        >
                            <Text
                                className={`${
                                    trend > 0
                                        ? "text-green-700"
                                        : trend < 0
                                          ? "text-red-700"
                                          : "text-gray-700"
                                } text-xs sm:text-sm font-medium`}
                            >
                                Growth Trend
                            </Text>
                            <Title
                                level={4}
                                className={`m-0 flex items-center mt-1 text-lg sm:text-xl ${
                                    trend > 0
                                        ? "text-green-800"
                                        : trend < 0
                                          ? "text-red-800"
                                          : "text-gray-800"
                                }`}
                            >
                                {trend > 0 ? (
                                    <ArrowUpOutlined className="mr-1 sm:mr-2 text-green-600 text-sm" />
                                ) : trend < 0 ? (
                                    <ArrowDownOutlined className="mr-1 sm:mr-2 text-red-600 text-sm" />
                                ) : null}
                                {trend > 0 ? "+" : ""}
                                {trend.toFixed(1)}%
                            </Title>
                        </div>
                    </div>

                    <div
                        className="bg-white rounded-xl border border-gray-100 p-2 sm:p-4"
                        style={{
                            height: window.innerWidth < 768 ? "300px" : "400px",
                        }}
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={chartData}
                                margin={{
                                    top: 10,
                                    right: window.innerWidth < 768 ? 10 : 30,
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
                                            stopOpacity={0.15}
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
                                    tick={{
                                        fill: "#6b7280",
                                        fontSize:
                                            window.innerWidth < 768 ? 9 : 11,
                                    }}
                                    interval={window.innerWidth < 768 ? 1 : 0}
                                />
                                <YAxis
                                    tickFormatter={formatDollar}
                                    axisLine={false}
                                    tickLine={false}
                                    tickMargin={10}
                                    tick={{
                                        fill: "#6b7280",
                                        fontSize:
                                            window.innerWidth < 768 ? 9 : 11,
                                    }}
                                    width={window.innerWidth < 768 ? 50 : 60}
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
                                    strokeWidth={
                                        window.innerWidth < 768 ? 2 : 2.5
                                    }
                                    fillOpacity={1}
                                    fill="url(#colorSales)"
                                    activeDot={{
                                        r: window.innerWidth < 768 ? 4 : 6,
                                        strokeWidth: 2,
                                        stroke: "#fff",
                                        fill: "#1890ff",
                                    }}
                                    dot={{
                                        r: window.innerWidth < 768 ? 2 : 3,
                                        strokeWidth: 2,
                                        stroke: "#1890ff",
                                        fill: "#fff",
                                    }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="text-xs text-gray-500 mt-2 sm:mt-3 text-right">
                        Average daily sales: ${averageSales.toLocaleString()}
                    </div>
                </>
            ) : (
                <div className="h-full flex items-center justify-center">
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={
                            <div className="text-center">
                                <Title
                                    level={5}
                                    className="text-gray-500 mt-0 mb-2 text-sm sm:text-base"
                                >
                                    No Sales Data Available
                                </Title>
                                <p className="text-xs sm:text-sm text-gray-400 mb-0">
                                    Sales data will appear here once you have
                                    recorded orders.
                                </p>
                            </div>
                        }
                    />
                </div>
            )}
        </div>
    );
};

export default SalesChart;
