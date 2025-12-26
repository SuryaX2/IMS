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
    const salesByDate = useMemo(() => {
        if (Array.isArray(salesData)) {
            return salesData;
        } else if (
            salesData?.salesByDate &&
            Array.isArray(salesData.salesByDate)
        ) {
            return salesData.salesByDate;
        }
        return [];
    }, [salesData]);

    const chartData = useMemo(
        () =>
            salesByDate.map((item) => ({
                date: item._id,
                sales: item.total,
                orders: item.orders || 0,
            })),
        [salesByDate]
    );

    const hasSalesData = chartData && chartData.length > 0;

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

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white px-3 py-2 border border-gray-200 shadow-md rounded-lg">
                    <p className="text-gray-500 text-xs font-medium mb-0.5">
                        {label}
                    </p>
                    <p className="text-blue-600 font-semibold text-sm mb-0">
                        ${Number(payload[0].value).toLocaleString()}
                    </p>
                </div>
            );
        }
        return null;
    };

    const formatDollar = (value) => `$${Number(value).toLocaleString()}`;

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
        <section className="h-full bg-white rounded-lg border border-gray-200 shadow-sm">
            <header className="px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <LineChartOutlined className="text-blue-600 text-lg" />
                    <h2 className="m-0 text-gray-900 font-semibold text-base">
                        Sales Performance
                    </h2>
                </div>
            </header>

            {loading ? (
                <div className="flex justify-center items-center h-96">
                    <Spin size="large" />
                </div>
            ) : hasSalesData ? (
                <div className="p-5">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                        <div className="bg-blue-50 px-4 py-3 rounded-lg border border-blue-100">
                            <Text className="text-blue-700 text-xs font-medium uppercase tracking-wide">
                                Total Sales
                            </Text>
                            <div className="text-blue-900 text-2xl font-bold mt-1">
                                ${summaryData.totalSales.toLocaleString()}
                            </div>
                        </div>

                        <div className="bg-indigo-50 px-4 py-3 rounded-lg border border-indigo-100">
                            <Text className="text-indigo-700 text-xs font-medium uppercase tracking-wide">
                                Total Orders
                            </Text>
                            <div className="text-indigo-900 text-2xl font-bold mt-1">
                                {summaryData.totalOrders}
                            </div>
                        </div>

                        <div
                            className={`px-4 py-3 rounded-lg border ${
                                trend > 0
                                    ? "bg-emerald-50 border-emerald-100"
                                    : trend < 0
                                      ? "bg-rose-50 border-rose-100"
                                      : "bg-gray-50 border-gray-100"
                            }`}
                        >
                            <Text
                                className={`text-xs font-medium uppercase tracking-wide ${
                                    trend > 0
                                        ? "text-emerald-700"
                                        : trend < 0
                                          ? "text-rose-700"
                                          : "text-gray-700"
                                }`}
                            >
                                Growth Trend
                            </Text>
                            <div
                                className={`flex items-center text-2xl font-bold mt-1 ${
                                    trend > 0
                                        ? "text-emerald-900"
                                        : trend < 0
                                          ? "text-rose-900"
                                          : "text-gray-900"
                                }`}
                            >
                                {trend > 0 ? (
                                    <ArrowUpOutlined className="mr-1.5 text-emerald-600 text-base" />
                                ) : trend < 0 ? (
                                    <ArrowDownOutlined className="mr-1.5 text-rose-600 text-base" />
                                ) : null}
                                {trend > 0 ? "+" : ""}
                                {trend.toFixed(1)}%
                            </div>
                        </div>
                    </div>

                    <div
                        className="bg-gray-50 rounded-lg border border-gray-200 p-4"
                        style={{
                            height: window.innerWidth < 768 ? "320px" : "535px",
                        }}
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={chartData}
                                margin={{
                                    top: 5,
                                    right: window.innerWidth < 768 ? 5 : 20,
                                    left: window.innerWidth < 768 ? -20 : -10,
                                    bottom: 5,
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
                                            stopColor="#2563eb"
                                            stopOpacity={0.2}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="#2563eb"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="#e5e7eb"
                                />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tickMargin={12}
                                    tick={{
                                        fill: "#6b7280",
                                        fontSize:
                                            window.innerWidth < 768 ? 10 : 12,
                                    }}
                                    interval={window.innerWidth < 768 ? 1 : 0}
                                />
                                <YAxis
                                    tickFormatter={formatDollar}
                                    axisLine={false}
                                    tickLine={false}
                                    tickMargin={8}
                                    tick={{
                                        fill: "#6b7280",
                                        fontSize:
                                            window.innerWidth < 768 ? 10 : 12,
                                    }}
                                    width={window.innerWidth < 768 ? 55 : 65}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="sales"
                                    stroke="#2563eb"
                                    strokeWidth={2.5}
                                    fillOpacity={1}
                                    fill="url(#colorSales)"
                                    activeDot={{
                                        r: window.innerWidth < 768 ? 5 : 6,
                                        strokeWidth: 2,
                                        stroke: "#fff",
                                        fill: "#2563eb",
                                    }}
                                    dot={false}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                        <span className="text-xs text-gray-500">
                            Average daily sales
                        </span>
                        <span className="text-sm font-semibold text-gray-700">
                            ${averageSales.toLocaleString()}
                        </span>
                    </div>
                </div>
            ) : (
                <div className="h-96 flex items-center justify-center">
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={
                            <div className="text-center">
                                <div className="text-gray-600 font-medium text-sm mb-1">
                                    No Sales Data Available
                                </div>
                                <p className="text-xs text-gray-400 mb-0">
                                    Sales data will appear here once you have
                                    recorded orders.
                                </p>
                            </div>
                        }
                    />
                </div>
            )}
        </section>
    );
};

export default SalesChart;
