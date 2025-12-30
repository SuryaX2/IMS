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
                <div className="bg-white px-4 py-3 border border-slate-200 shadow-lg rounded-lg">
                    <p className="text-slate-500 text-xs font-medium mb-1">
                        {label}
                    </p>
                    <p className="text-blue-600 font-bold text-base mb-0">
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
        <section className="w-full bg-white rounded-xl shadow-sm border border-slate-200">
            <header className="px-6 py-5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                        <LineChartOutlined className="text-blue-600 text-lg" />
                    </div>
                    <div>
                        <h2 className="m-0 text-slate-900 font-bold text-lg leading-tight">
                            Sales Performance
                        </h2>
                        <p className="m-0 text-slate-500 text-xs mt-0.5">
                            Track your revenue and order trends
                        </p>
                    </div>
                </div>
            </header>

            {loading ? (
                <div className="flex justify-center items-center py-32">
                    <Spin size="large" />
                </div>
            ) : hasSalesData ? (
                <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 px-5 py-4 rounded-xl border-2 border-blue-400">
                            <Text className="text-blue-700 text-xs font-semibold uppercase tracking-wider block mb-2">
                                Total Sales
                            </Text>
                            <div className="text-blue-900 text-3xl font-bold">
                                ₹ {summaryData.totalSales.toLocaleString()}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 px-5 py-4 rounded-xl border-2 border-indigo-400">
                            <Text className="text-indigo-700 text-xs font-semibold uppercase tracking-wider block mb-2">
                                Total Orders
                            </Text>
                            <div className="text-indigo-900 text-3xl font-bold">
                                {summaryData.totalOrders}
                            </div>
                        </div>

                        <div
                            className={`px-5 py-4 rounded-xl border-2 sm:col-span-2 lg:col-span-1 ${
                                trend > 0
                                    ? "bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-400"
                                    : trend < 0
                                      ? "bg-gradient-to-br from-rose-50 to-rose-100/50 border-rose-400"
                                      : "bg-gradient-to-br from-slate-50 to-slate-100/50 border-slate-400"
                            }`}
                        >
                            <Text
                                className={`text-xs font-semibold uppercase tracking-wider block mb-2 ${
                                    trend > 0
                                        ? "text-emerald-700"
                                        : trend < 0
                                          ? "text-rose-700"
                                          : "text-slate-700"
                                }`}
                            >
                                Growth Trend
                            </Text>
                            <div
                                className={`flex items-center text-3xl font-bold ${
                                    trend > 0
                                        ? "text-emerald-900"
                                        : trend < 0
                                          ? "text-rose-900"
                                          : "text-slate-900"
                                }`}
                            >
                                {trend > 0 ? (
                                    <ArrowUpOutlined className="mr-2 text-emerald-600 text-xl" />
                                ) : trend < 0 ? (
                                    <ArrowDownOutlined className="mr-2 text-rose-600 text-xl" />
                                ) : null}
                                {trend > 0 ? "+" : ""}
                                {trend.toFixed(1)}%
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50/50 rounded-xl border border-slate-200 p-5">
                        <div className="w-full h-80 sm:h-96 lg:h-[420px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={chartData}
                                    margin={{
                                        top: 10,
                                        right: 10,
                                        left: 0,
                                        bottom: 10,
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
                                                stopColor="#3b82f6"
                                                stopOpacity={0.3}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="#3b82f6"
                                                stopOpacity={0.05}
                                            />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        stroke="#e2e8f0"
                                    />
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tickMargin={12}
                                        tick={{
                                            fill: "#64748b",
                                            fontSize: 11,
                                            fontWeight: 500,
                                        }}
                                    />
                                    <YAxis
                                        tickFormatter={formatDollar}
                                        axisLine={false}
                                        tickLine={false}
                                        tickMargin={12}
                                        tick={{
                                            fill: "#64748b",
                                            fontSize: 11,
                                            fontWeight: 500,
                                        }}
                                        width={70}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area
                                        type="monotone"
                                        dataKey="sales"
                                        stroke="#3b82f6"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorSales)"
                                        activeDot={{
                                            r: 6,
                                            strokeWidth: 3,
                                            stroke: "#fff",
                                            fill: "#3b82f6",
                                        }}
                                        dot={false}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mt-5 pt-5 border-t border-slate-200">
                        <span className="text-sm text-slate-600 font-medium">
                            Average daily sales
                        </span>
                        <span className="text-lg font-bold text-slate-900">
                            ${averageSales.toLocaleString()}
                        </span>
                    </div>
                </div>
            ) : (
                <div className="py-32 flex items-center justify-center">
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={
                            <div className="text-center">
                                <div className="text-slate-700 font-semibold text-base mb-2">
                                    No Sales Data Available
                                </div>
                                <p className="text-sm text-slate-500 mb-0 max-w-xs mx-auto">
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
