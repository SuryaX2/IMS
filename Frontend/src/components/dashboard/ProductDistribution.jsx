import React from "react";
import { Card, Alert, Empty, List, Typography } from "antd";
import { Pie } from "@ant-design/plots";
import { TrophyOutlined } from "@ant-design/icons";

const { Text } = Typography;

const ProductDistribution = ({ topProducts }) => {
    const hasData = topProducts && topProducts.length > 0;
    
    // Pie chart configuration for top products distribution
    const pieConfig = {
        data: hasData 
            ? topProducts.map((product) => ({
                type: product.product_name,
                value: product.quantity_sold,
              }))
            : [],
        angleField: "value",
        colorField: "type",
        radius: 0.8,
        innerRadius: 0.6,
        label: {
            type: "inner",
            offset: "-50%",
            content: "{percentage}",
            style: {
                fill: "#fff",
                fontSize: 14,
                textAlign: "center",
                fontWeight: "bold",
            },
        },
        interactions: [{ type: "element-active" }],
        statistic: {
            title: {
                style: {
                    fontSize: "14px",
                    lineHeight: "14px",
                    color: "#666",
                },
                content: "Total\nSold",
            },
            content: {
                style: {
                    fontSize: "20px",
                    lineHeight: "20px",
                    fontWeight: "bold",
                    color: "#333",
                },
                content: hasData 
                    ? topProducts.reduce((acc, item) => acc + item.quantity_sold, 0)
                    : 0,
            },
        },
        legend: {
            layout: "horizontal",
            position: "bottom",
        },
        animation: {
            appear: {
                animation: 'fade-in',
                duration: 1500,
            },
        },
    };

    return (
        <Card
            title={
                <div className="flex items-center">
                    <TrophyOutlined className="mr-2 text-yellow-500" />
                    <span>Top Products</span>
                </div>
            }
            extra={<a href="/reports/top-products">View All</a>}
            className="shadow-sm hover:shadow-md transition-shadow"
        >
            {hasData ? (
                <div>
                    <Pie {...pieConfig} height={240} />
                    
                    <List
                        size="small"
                        className="mt-4"
                        dataSource={topProducts.slice(0, 3)}
                        renderItem={(item, index) => (
                            <List.Item className="flex justify-between px-2 py-1">
                                <div className="flex items-center">
                                    <div className={`h-6 w-6 rounded-full flex justify-center items-center mr-2 ${
                                        index === 0 ? 'bg-yellow-100 text-yellow-600' : 
                                        index === 1 ? 'bg-gray-100 text-gray-600' : 
                                        'bg-orange-100 text-orange-600'
                                    }`}>
                                        {index + 1}
                                    </div>
                                    <Text ellipsis className="max-w-xs">
                                        {item.product_name}
                                    </Text>
                                </div>
                                <Text strong>
                                    {item.quantity_sold} units
                                </Text>
                            </List.Item>
                        )}
                    />
                </div>
            ) : (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                        <div className="text-center p-8">
                            <p className="mt-0 text-gray-500">
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

export default ProductDistribution;