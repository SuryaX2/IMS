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
}) => {
    const renderChart = () => {
        if (chartType === "line") {
            return (
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
                            stroke={line.stroke}
                            strokeWidth={line.strokeWidth || 2}
                            name={line.name}
                            dot={{
                                fill: line.stroke,
                                strokeWidth: line.dotStrokeWidth || 2,
                            }}
                        />
                    ))}
                </LineChart>
            );
        }

        if (type === "bar") {
            return (
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={config.bars?.[0]?.formatter} />
                    <Legend />
                    {config.bars?.map((bar, index) => (
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
        }

        return (
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={config.lines?.[0]?.formatter} />
                <Legend />
                {config.lines?.map((line, index) => (
                    <Line
                        key={index}
                        type="monotone"
                        dataKey={line.dataKey}
                        stroke={line.color}
                        strokeWidth={line.strokeWidth || 2}
                        name={line.name}
                        dot={{ fill: line.color, strokeWidth: 2 }}
                    />
                ))}
            </LineChart>
        );

    };

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
