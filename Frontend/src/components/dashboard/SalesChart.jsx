import React from "react";
import { Card, Alert, Empty, Typography } from "antd";
import { Area } from "@ant-design/plots";

const { Text } = Typography;

const SalesChart = ({ salesData }) => {
    // Calculate some metrics for the summary
    const hasSalesData = salesData && salesData.length > 0;
    const totalSales = hasSalesData
        ? salesData.reduce((sum, item) => sum + item.sales, 0)
        : 0;

    const averageSales = hasSalesData ? totalSales / salesData.length : 0;

    // Get trend (up or down) by comparing first and last week
    let trend = 0;
    if (hasSalesData && salesData.length > 7) {
        const firstWeek = salesData
            .slice(0, 7)
            .reduce((sum, item) => sum + item.sales, 0);
        const lastWeek = salesData
            .slice(-7)
            .reduce((sum, item) => sum + item.sales, 0);
        trend = ((lastWeek - firstWeek) / firstWeek) * 100;
    }

    // Area chart configuration for sales trend
    const areaConfig = {
        data: salesData,
        xField: "date",
        yField: "sales",
        xAxis: {
            type: "time",
            tickCount: 7,
        },
        yAxis: {
            label: {
                formatter: (v) => `$${v.toLocaleString()}`,
            },
        },
        smooth: true,
        areaStyle: {
            fill: "l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff",
        },
        line: {
            color: "#1890ff",
        },
        tooltip: {
            showMarkers: true,
            formatter: (data) => {
                return {
                    name: "Sales",
                    value: `$${data.sales.toLocaleString()}`,
                };
            },
        },
        interactions: [
            {
                type: "element-active",
            },
        ],
        animation: {
            appear: {
                animation: "wave-in",
                duration: 1500,
            },
        },
    };

    return (
        <Card
            title="Sales Trend"
            extra={<a href="/reports/sales">View Details</a>}
            className="shadow-sm hover:shadow-md transition-shadow"
        >
            {hasSalesData ? (
                <>
                    <div className="flex flex-wrap gap-4 mb-4">
                        <div className="bg-blue-50 p-3 rounded-lg">
                            <Text type="secondary">Total Sales</Text>
                            <div className="text-lg font-bold text-primary mt-1">
                                ${totalSales.toLocaleString()}
                            </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <Text type="secondary">Average Daily</Text>
                            <div className="text-lg font-bold text-gray-700 mt-1">
                                ${averageSales.toLocaleString()}
                            </div>
                        </div>
                        {trend !== 0 && (
                            <div
                                className={`p-3 rounded-lg ${trend > 0 ? "bg-green-50" : "bg-red-50"}`}
                            >
                                <Text type="secondary">Trend</Text>
                                <div
                                    className={`text-lg font-bold mt-1 ${trend > 0 ? "text-green-600" : "text-red-600"}`}
                                >
                                    {trend > 0 ? "+" : ""}
                                    {trend.toFixed(1)}%
                                </div>
                            </div>
                        )}
                    </div>
                    <Area {...areaConfig} height={300} />
                </>
            ) : (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                        <div className="text-center p-8">
                            <p className="mt-5 text-gray-500">
                                Sales data for the last 30 days will appear here
                                once available.
                            </p>
                        </div>
                    }
                />
            )}
        </Card>
    );
};

export default SalesChart;
