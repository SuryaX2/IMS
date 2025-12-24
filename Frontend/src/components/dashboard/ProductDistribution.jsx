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
                    color: "#9CA3AF",
                    letterSpacing: "0.5px",
                },
                content: "TOTAL UNITS",
            },
            content: {
                offsetY: 4,
                style: {
                    fontSize: "28px",
                    fontWeight: 800,
                    color: "#111827",
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
                    fill: "#6B7280",
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
        <Card
            className="h-full border border-gray-200/60 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br from-white to-gray-50/30"
            bodyStyle={{
                padding: 0,
                height: "100%",
                display: "flex",
                flexDirection: "column",
            }}
            bordered={false}
        >
            <div className="px-5 py-4 border-b border-gray-100 bg-white/80 backdrop-blur-sm rounded-t-2xl">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm">
                            <TrophyOutlined className="text-white text-base" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-gray-900 leading-none mb-0.5">
                                Top Products
                            </h3>
                            <p className="text-xs text-gray-500 m-0">
                                Best performers
                            </p>
                        </div>
                    </div>
                    <a
                        href="/reports/top-products"
                        className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 transition-all duration-200 flex items-center gap-1.5 font-semibold text-xs border border-blue-100"
                    >
                        <span>View All</span>
                        <ArrowUpOutlined className="text-[10px] rotate-45" />
                    </a>
                </div>
            </div>

            {hasData && chartData.length > 0 ? (
                <div className="flex-1 flex flex-col p-5">
                    <div className="flex-1 flex items-center justify-center min-h-0 mb-4">
                        <div
                            className="w-full max-w-sm"
                            style={{ height: "240px" }}
                        >
                            <Pie {...pieConfig} />
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100">
                        <div className="flex items-center gap-2 mb-3">
                            <FireOutlined className="text-orange-500 text-sm" />
                            <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                                Top Performers
                            </span>
                        </div>
                        <div className="space-y-2">
                            {topProducts.slice(0, 3).map((item, index) => (
                                <div
                                    key={index}
                                    className="group flex items-center justify-between p-3 rounded-lg bg-white hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all duration-200 border border-gray-100 hover:border-gray-200 hover:shadow-sm"
                                >
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                        <div className="text-xl flex-shrink-0 w-7 h-7 flex items-center justify-center">
                                            {getMedalIcon(index)}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <Tooltip
                                                title={item.product_name}
                                                placement="topLeft"
                                            >
                                                <div className="text-sm font-semibold text-gray-800 truncate group-hover:text-gray-900 transition-colors">
                                                    {truncateProductName(
                                                        item.product_name,
                                                        18
                                                    )}
                                                </div>
                                            </Tooltip>
                                            <div className="text-xs text-gray-500 mt-0.5">
                                                Rank #{index + 1}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0 ml-3">
                                        <div
                                            className="px-3 py-1.5 rounded-lg font-bold text-xs text-white shadow-sm"
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
                <div className="flex-1 flex items-center justify-center p-8">
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        imageStyle={{ height: 80 }}
                        description={
                            <div className="text-center mt-3">
                                <Title
                                    level={5}
                                    className="text-gray-700 mb-2 font-semibold"
                                    style={{ fontSize: "15px" }}
                                >
                                    No Product Data Available
                                </Title>
                                <Text className="text-xs text-gray-500 block leading-relaxed">
                                    Product sales analytics will be displayed
                                    <br />
                                    here once data becomes available
                                </Text>
                            </div>
                        }
                    />
                </div>
            )}
        </Card>
    );
};

export default ProductDistribution;
