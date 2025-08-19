import React from "react";
import { Card, Empty, List, Typography, Badge, Avatar } from "antd";
import { Pie } from "@ant-design/plots";
import { TrophyOutlined, ArrowUpOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

// Array of vibrant but harmonious colors for the pie chart
const CHART_COLORS = [
    "#1890FF",
    "#52C41A",
    "#FAAD14",
    "#F5222D",
    "#722ED1",
    "#13C2C2",
    "#EB2F96",
    "#FA541C",
    "#a0d911",
    "#2f54eb",
];

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
        color: CHART_COLORS,
        label: {
            type: "inner",
            offset: "-50%",
            content: "{percentage}",
            style: {
                fill: "#fff",
                fontSize: 12,
                textAlign: "center",
                fontWeight: "bold",
                textShadow: "0 0 3px rgba(0,0,0,0.3)",
            },
        },
        interactions: [
            { type: "element-active" },
            { type: "pie-statistic-active" },
        ],
        statistic: {
            title: {
                style: {
                    fontSize: "12px",
                    lineHeight: "12px",
                    color: "#666",
                },
                content: "Total\nSold",
            },
            content: {
                style: {
                    fontSize: "20px",
                    lineHeight: "20px",
                    fontWeight: "bold",
                    color: "#1890FF",
                },
                content: hasData
                    ? topProducts.reduce(
                          (acc, item) => acc + item.quantity_sold,
                          0
                      )
                    : 0,
            },
        },
        legend: {
            layout: "horizontal",
            position: "bottom",
            flipPage: true,
            maxRow: 2,
            itemName: {
                style: {
                    fontSize: "11px",
                },
            },
        },
        animation: {
            appear: {
                animation: "fade-in",
                duration: 1500,
            },
        },
        tooltip: {
            formatter: (datum) => {
                return {
                    name: datum.type,
                    value: `${datum.value} units (${(datum.percent * 100).toFixed(1)}%)`,
                };
            },
        },
    };

    const getMedalColor = (index) => {
        switch (index) {
            case 0:
                return "#FFD700"; // Gold
            case 1:
                return "#C0C0C0"; // Silver
            case 2:
                return "#CD7F32"; // Bronze
            default:
                return "#E8E8E8";
        }
    };

    return (
        <Card
            title={
                <div className="flex items-center">
                    <TrophyOutlined className="mr-2 text-yellow-500" />
                    <span className="text-lg font-semibold text-gray-800">
                        Top Products
                    </span>
                </div>
            }
            extra={
                <a
                    href="/reports/top-products"
                    className="text-blue-600 hover:text-blue-800 transition-colors flex items-center font-medium"
                >
                    View All <ArrowUpOutlined className="ml-1 rotate-45" />
                </a>
            }
            className="h-full rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
            bodyStyle={{
                padding: "16px",
                height: "calc(100% - 60px)",
            }}
            headStyle={{
                borderBottom: "1px solid #f0f0f0",
                padding: "12px 16px",
                backgroundColor: "#fafafa",
            }}
        >
            {hasData ? (
                <div className="h-full flex flex-col">
                    <div className="flex-1 flex justify-center items-center">
                        <Pie {...pieConfig} height={200} />
                    </div>

                    <div className="mt-4">
                        <List
                            size="small"
                            dataSource={topProducts.slice(0, 3)}
                            renderItem={(item, index) => (
                                <List.Item className="py-2 px-2 flex justify-between border-0 hover:bg-gray-50 transition-colors rounded-lg">
                                    <div className="flex items-center">
                                        <Avatar
                                            size="small"
                                            shape="square"
                                            style={{
                                                backgroundColor:
                                                    getMedalColor(index),
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: "11px",
                                                fontWeight: "bold",
                                                color:
                                                    index === 0
                                                        ? "#5c3c00"
                                                        : index === 1
                                                          ? "#494949"
                                                          : "#3e2a15",
                                            }}
                                        >
                                            {index + 1}
                                        </Avatar>
                                        <Text
                                            ellipsis
                                            className="max-w-xs ml-3 text-sm font-medium text-balance"
                                        >
                                            {item.product_name}
                                        </Text>
                                    </div>
                                    <Badge
                                        count={item.quantity_sold}
                                        className="font-medium"
                                        style={{
                                            backgroundColor:
                                                CHART_COLORS[
                                                    index % CHART_COLORS.length
                                                ],
                                            fontWeight: "600",
                                            fontSize: "10px",
                                        }}
                                        overflowCount={99999}
                                        title={`${item.quantity_sold} units sold`}
                                    />
                                </List.Item>
                            )}
                        />
                    </div>
                </div>
            ) : (
                <div className="h-full flex items-center justify-center">
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={
                            <div className="text-center">
                                <Title
                                    level={5}
                                    className="text-gray-500 mt-0 mb-2"
                                >
                                    No Product Data
                                </Title>
                                <p className="text-sm text-gray-400 mb-0">
                                    Sales data will appear here once available.
                                </p>
                            </div>
                        }
                    />
                </div>
            )}
        </Card>
    );
};

export default ProductDistribution;
