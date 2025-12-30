import React from "react";
import { Card, Empty, Typography, Tooltip } from "antd";
import { Pie } from "@ant-design/plots";
import {
    TrophyOutlined,
    ArrowUpOutlined,
    FireOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;

const CHART_COLORS = [
    "#6366F1",
    "#EC4899",
    "#F59E0B",
    "#10B981",
    "#8B5CF6",
    "#06B6D4",
    "#EF4444",
    "#F97316",
    "#84CC16",
    "#3B82F6",
];

const ProductDistribution = ({ topProducts }) => {
    const hasData = topProducts && topProducts.length > 0;

    const chartData = hasData
        ? topProducts
              .filter(
                  (product) => product.product_name && product.quantity_sold > 0
              )
              .map((product) => ({
                  type: product.product_name || "Unknown Product",
                  value: product.quantity_sold || 0,
              }))
        : [];

    const pieConfig = {
        data: chartData,
        angleField: "value",
        colorField: "type",
        radius: 0.9,
        innerRadius: 0.68,
        color: CHART_COLORS,
        label: {
            type: "inner",
            offset: "-50%",
            content: "{percentage}",
            style: {
                fill: "#ffffff",
                fontSize: 13,
                textAlign: "center",
                fontWeight: 700,
                textShadow: "0 1px 2px rgba(0,0,0,0.2)",
            },
        },
        interactions: [
            { type: "element-active" },
            { type: "pie-statistic-active" },
        ],
        statistic: {
            title: {
                offsetY: -8,
                style: {
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "#64748b",
                    letterSpacing: "0.5px",
                },
                content: "TOTAL UNITS",
            },
            content: {
                offsetY: 4,
                style: {
                    fontSize: "28px",
                    fontWeight: 800,
                    color: "#0f172a",
                    lineHeight: 1,
                },
                content:
                    chartData.length > 0
                        ? chartData
                              .reduce((acc, item) => acc + (item.value || 0), 0)
                              .toLocaleString()
                        : 0,
            },
        },
        legend: {
            layout: "horizontal",
            position: "bottom",
            flipPage: true,
            maxRow: 2,
            offsetY: -8,
            itemName: {
                style: {
                    fontSize: "11px",
                    fill: "#475569",
                    fontWeight: 500,
                },
                formatter: (text) => {
                    return text.length > 16
                        ? text.substring(0, 16) + "..."
                        : text;
                },
            },
            marker: {
                symbol: "circle",
                style: {
                    r: 5,
                },
            },
        },
        animation: {
            appear: {
                animation: "fade-in",
                duration: 1000,
            },
        },
    };

    const getMedalIcon = (index) => {
        const medals = ["🥇", "🥈", "🥉"];
        return medals[index] || "•";
    };

    const truncateProductName = (name, maxLength = 20) => {
        if (!name) return "Unknown Product";
        return name.length > maxLength
            ? name.substring(0, maxLength) + "..."
            : name;
    };

    return (
        <section className="w-full bg-white rounded-xl shadow-sm border border-slate-200">
            <header className="px-6 py-5 border-b border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm">
                            <TrophyOutlined className="text-white text-lg" />
                        </div>
                        <div>
                            <h2 className="m-0 text-slate-900 font-bold text-lg leading-tight">
                                Product Distribution
                            </h2>
                            <p className="m-0 text-slate-500 text-xs mt-0.5">
                                Top selling products overview
                            </p>
                        </div>
                    </div>
                    <a
                        href="/reports/top-products"
                        className="px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 transition-all duration-200 flex items-center justify-center gap-2 font-semibold text-xs border border-blue-200 w-full sm:w-auto"
                    >
                        <span>View All</span>
                        <ArrowUpOutlined className="text-xs rotate-45" />
                    </a>
                </div>
            </header>

            {hasData && chartData.length > 0 ? (
                <div className="p-6">
                    <div className="bg-slate-50/50 rounded-xl border-2 border-slate-400 p-6 mb-6">
                        <div
                            className="w-full mx-auto"
                            style={{ maxWidth: "420px" }}
                        >
                            <div className="w-full h-72 sm:h-80">
                                <Pie {...pieConfig} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-5 border-2 border-slate-400">
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                                <FireOutlined className="text-orange-600 text-sm" />
                            </div>
                            <span className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                                Top Performers
                            </span>
                        </div>
                        <div className="space-y-3">
                            {topProducts.slice(0, 3).map((item, index) => (
                                <div
                                    key={index}
                                    className="group flex items-center justify-between p-4 rounded-xl bg-white hover:bg-gradient-to-r hover:from-slate-50 hover:to-white transition-all duration-200 border-2 border-slate-200 hover:border-slate-300 hover:shadow-sm"
                                >
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                        <div className="text-2xl flex-shrink-0 w-8 h-8 flex items-center justify-center">
                                            {getMedalIcon(index)}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <Tooltip
                                                title={item.product_name}
                                                placement="topLeft"
                                            >
                                                <div className="text-sm font-semibold text-slate-800 truncate group-hover:text-slate-900 transition-colors">
                                                    {truncateProductName(
                                                        item.product_name,
                                                        24
                                                    )}
                                                </div>
                                            </Tooltip>
                                            <div className="text-xs text-slate-500 mt-1 font-medium">
                                                Rank #{index + 1}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0 ml-4">
                                        <div
                                            className="px-4 py-2 rounded-lg font-bold text-sm text-white shadow-sm"
                                            style={{
                                                backgroundColor:
                                                    CHART_COLORS[
                                                        index %
                                                            CHART_COLORS.length
                                                    ],
                                            }}
                                        >
                                            {item.quantity_sold.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="py-32 flex items-center justify-center px-6">
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        imageStyle={{ height: 90 }}
                        description={
                            <div className="text-center mt-4">
                                <div className="text-slate-700 font-semibold text-base mb-2">
                                    No Product Data Available
                                </div>
                                <Text className="text-sm text-slate-500 block leading-relaxed max-w-xs mx-auto">
                                    Product sales analytics will be displayed
                                    here once data becomes available
                                </Text>
                            </div>
                        }
                    />
                </div>
            )}
        </section>
    );
};

export default ProductDistribution;
