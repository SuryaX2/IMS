import React from "react";
import { Card, Alert } from "antd";
import { Pie } from "@ant-design/plots";

const ProductDistribution = ({ topProducts }) => {
    // Pie chart configuration for top products distribution
    const pieConfig = {
        data: topProducts.map((product) => ({
            type: product.product_name,
            value: product.quantity_sold,
        })),
        angleField: "value",
        colorField: "type",
        radius: 0.8,
        innerRadius: 0.5,
        label: {
            type: "inner",
            offset: "-50%",
            content: "{percentage}",
            style: {
                fill: "#fff",
                fontSize: 14,
                textAlign: "center",
            },
        },
        interactions: [{ type: "element-active" }],
        statistic: {
            title: false,
            content: {
                style: {
                    fontSize: "16px",
                    lineHeight: "16px",
                },
                content: "Products",
            },
        },
    };

    return (
        <Card
            title="Top Products Distribution"
            extra={<a href="/reports/top-products">View All</a>}
        >
            {topProducts && topProducts.length > 0 ? (
                <Pie {...pieConfig} height={300} />
            ) : (
                <div
                    style={{
                        textAlign: "center",
                        padding: "40px 0",
                    }}
                >
                    <Alert
                        message="No product distribution data available"
                        type="info"
                        showIcon
                    />
                </div>
            )}
        </Card>
    );
};

export default ProductDistribution;
