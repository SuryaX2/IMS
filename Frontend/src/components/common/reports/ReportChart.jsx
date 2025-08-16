import React from "react";
import { Card, Empty } from "antd";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

const ReportChart = ({
    title,
    data = [],
    chartType = "line",
    height = 350,
    lines = [],
    bars = [],
    emptyDescription = "No data available for the selected period",
    xAxisKey = "date",
    className = "chart-card",
    loading = false,
}) => {
    const renderLineChart = () => (
        <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
                dataKey={xAxisKey}
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={lines[0]?.formatter} />
            <Legend />
            {lines.map((line, index) => (
                <Line
                    key={index}
                    type="monotone"
                    dataKey={line.dataKey}
                    stroke={line.stroke || line.color}
                    strokeWidth={line.strokeWidth || 2}
                    name={line.name}
                    dot={{
                        fill: line.stroke || line.color,
                        strokeWidth: line.dotStrokeWidth || 2,
                    }}
                />
            ))}
        </LineChart>
    );

    const renderBarChart = () => (
        <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
                dataKey={xAxisKey}
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={bars[0]?.formatter} />
            <Legend />
            {bars.map((bar, index) => (
                <Bar
                    key={index}
                    dataKey={bar.dataKey}
                    fill={bar.fill}
                    name={bar.name}
                    radius={bar.radius || [4, 4, 0, 0]}
                />
            ))}
        </BarChart>
    );

    const renderChart = () => {
        return chartType === "bar" ? renderBarChart() : renderLineChart();
    };

    if (loading) {
        return (
            <Card title={title} className={className}>
                <div
                    className="flex justify-center items-center"
                    style={{ height }}
                >
                    <div>Loading...</div>
                </div>
            </Card>
        );
    }

    return (
        <Card title={title} className={className}>
            {data.length > 0 ? (
                <ResponsiveContainer width="100%" height={height}>
                    {renderChart()}
                </ResponsiveContainer>
            ) : (
                <Empty description={emptyDescription} />
            )}
        </Card>
    );
};

export default ReportChart;
