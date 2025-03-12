import React from "react";
import { Card, Alert } from "antd";
import { Area } from "@ant-design/plots";

const SalesChart = ({ salesData }) => {
    // Area chart configuration for sales trend
    const areaConfig = {
        data: salesData,
        xField: "date",
        yField: "sales",
        xAxis: {
            type: "time",
            tickCount: 7,
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
        },
    };

    return (
        <Card
            title="Sales Trend"
            extra={<a href="/reports/sales">View Details</a>}
        >
            {salesData && salesData.length > 0 ? (
                <Area {...areaConfig} height={300} />
            ) : (
                <div
                    style={{
                        textAlign: "center",
                        padding: "40px 0",
                    }}
                    className="flex flex-col items-center"
                >
                    <Alert
                        message="No sales data available"
                        type="info"
                        showIcon
                        className="md:w-60"
                    />
                </div>
            )}
        </Card>
    );
};

export default SalesChart;
