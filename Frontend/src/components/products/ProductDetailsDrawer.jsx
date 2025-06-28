import React from "react";
import {
    Drawer,
    Descriptions,
    Image,
    Badge,
    Typography,
    Space,
    Card,
} from "antd";
import {
    TagOutlined,
    InboxOutlined,
    DollarOutlined,
    UpCircleOutlined,
    CalendarOutlined,
    BarChartOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;

const ProductDetailsDrawer = ({
    visible,
    product,
    onClose,
    placement = "right",
    width,
    height,
}) => {
    if (!product) return null;

    const getStockStatus = (stock) => {
        if (stock === 0) {
            return { status: "error", text: "Out of Stock", color: "#ff4d4f" };
        } else if (stock <= 10) {
            return { status: "warning", text: "Low Stock", color: "#faad14" };
        }
        return { status: "success", text: "In Stock", color: "#52c41a" };
    };

    const stockStatus = getStockStatus(product.stock);
    const profitMargin = (
        product.selling_price - product.buying_price
    )?.toFixed(2);

    return (
        <Drawer
            title={
                <div className="flex items-center gap-2">
                    <BarChartOutlined className="text-gray-600" />
                    <span className="text-lg font-semibold text-gray-800">
                        Product Details
                    </span>
                </div>
            }
            placement={placement}
            onClose={onClose}
            open={visible}
            width={width || (window.innerWidth < 768 ? "100vw" : "420px")}
            height={height}
            className="product-details-drawer"
            headerStyle={{
                borderBottom: "1px solid #f0f0f0",
                paddingBottom: "16px",
            }}
            bodyStyle={{
                padding: window.innerWidth < 768 ? "16px" : "24px",
                backgroundColor: "#fafafa",
            }}
        >
            <div className="space-y-6">
                {/* Product Image Section */}
                <Card
                    className="shadow-sm border-0"
                    bodyStyle={{ padding: "20px", textAlign: "center" }}
                >
                    <Image
                        src={product.product_image}
                        alt={product.product_name}
                        width="50%"
                        height={window.innerWidth < 768 ? 180 : 220}
                        style={{
                            objectFit: "cover",
                            borderRadius: "8px",
                            maxWidth: "100%",
                        }}
                        fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6U"
                        preview={{
                            mask: (
                                <div className="text-white text-sm">
                                    View Image
                                </div>
                            ),
                        }}
                    />
                </Card>

                {/* Product Header */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                    <Title
                        level={3}
                        className="text-gray-800 mb-2 text-lg sm:text-xl"
                    >
                        {product.product_name}
                    </Title>
                    <div className="flex items-center gap-2">
                        <TagOutlined className="text-gray-500 text-sm" />
                        <Text type="secondary" className="text-sm">
                            {product.product_code}
                        </Text>
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-3">
                    <Card
                        className="shadow-sm border-0 text-center"
                        bodyStyle={{ padding: "16px" }}
                    >
                        <div className="flex flex-col items-center">
                            <InboxOutlined className="text-2xl text-blue-500 mb-2" />
                            <Text className="text-xs text-gray-500 mb-1">
                                Current Stock
                            </Text>
                            <Text strong className="text-lg">
                                {product.stock}
                            </Text>
                        </div>
                    </Card>

                    <Card
                        className="shadow-sm border-0 text-center"
                        bodyStyle={{ padding: "16px" }}
                    >
                        <div className="flex flex-col items-center">
                            <UpCircleOutlined className="text-2xl text-green-500 mb-2" />
                            <Text className="text-xs text-gray-500 mb-1">
                                Profit Margin
                            </Text>
                            <Text strong className="text-lg text-green-600">
                                ${profitMargin}
                            </Text>
                        </div>
                    </Card>
                </div>

                {/* Stock Status */}
                <Card
                    className="shadow-sm border-0"
                    bodyStyle={{ padding: "16px" }}
                >
                    <div className="flex items-center justify-between">
                        <Text className="text-sm font-medium text-gray-700">
                            Stock Status
                        </Text>
                        <Badge
                            status={stockStatus.status}
                            text={
                                <span
                                    style={{
                                        color: stockStatus.color,
                                        fontWeight: 500,
                                    }}
                                >
                                    {stockStatus.text}
                                </span>
                            }
                        />
                    </div>
                </Card>

                {/* Product Information */}
                <Card
                    title={
                        <span className="text-base font-semibold text-gray-800">
                            Product Information
                        </span>
                    }
                    className="shadow-sm border-0"
                    bodyStyle={{ padding: "0" }}
                >
                    <Descriptions
                        column={1}
                        size="middle"
                        colon={false}
                        labelStyle={{
                            fontSize: "13px",
                            color: "#666",
                            fontWeight: "500",
                            padding: "12px 16px",
                            backgroundColor: "#fafafa",
                            width: "35%",
                        }}
                        contentStyle={{
                            fontSize: "13px",
                            padding: "12px 16px",
                            color: "#333",
                        }}
                    >
                        <Descriptions.Item label="Category">
                            <Text className="font-medium">
                                {product.category_id?.category_name || "N/A"}
                            </Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Unit">
                            <Text className="font-medium">
                                {product.unit_id?.unit_name || "N/A"}
                            </Text>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>

                {/* Pricing Information */}
                <Card
                    title={
                        <div className="flex items-center gap-2">
                            <DollarOutlined className="text-gray-600" />
                            <span className="text-base font-semibold text-gray-800">
                                Pricing Details
                            </span>
                        </div>
                    }
                    className="shadow-sm border-0"
                    bodyStyle={{ padding: "0" }}
                >
                    <Descriptions
                        column={1}
                        size="middle"
                        colon={false}
                        labelStyle={{
                            fontSize: "13px",
                            color: "#666",
                            fontWeight: "500",
                            padding: "12px 16px",
                            backgroundColor: "#fafafa",
                            width: "35%",
                        }}
                        contentStyle={{
                            fontSize: "13px",
                            padding: "12px 16px",
                            color: "#333",
                        }}
                    >
                        <Descriptions.Item label="Buying Price">
                            <Text className="font-medium">
                                ${product.buying_price?.toFixed(2) || "0.00"}
                            </Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Selling Price">
                            <Text strong className="text-blue-600">
                                ${product.selling_price?.toFixed(2) || "0.00"}
                            </Text>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>

                {/* Timestamps */}
                <Card
                    title={
                        <div className="flex items-center gap-2">
                            <CalendarOutlined className="text-gray-600" />
                            <span className="text-base font-semibold text-gray-800">
                                Record Information
                            </span>
                        </div>
                    }
                    className="shadow-sm border-0"
                    bodyStyle={{ padding: "16px" }}
                >
                    <Space direction="vertical" size="small" className="w-full">
                        <div className="flex justify-between items-center">
                            <Text className="text-xs text-gray-500">
                                Created
                            </Text>
                            <Text className="text-xs font-medium">
                                {new Date(product.createdAt).toLocaleDateString(
                                    "en-US",
                                    {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    }
                                )}
                            </Text>
                        </div>
                        <div className="flex justify-between items-center">
                            <Text className="text-xs text-gray-500">
                                Last Updated
                            </Text>
                            <Text className="text-xs font-medium">
                                {new Date(product.updatedAt).toLocaleDateString(
                                    "en-US",
                                    {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    }
                                )}
                            </Text>
                        </div>
                    </Space>
                </Card>
            </div>

            <style jsx>{`
                .product-details-drawer .ant-drawer-header {
                    border-bottom: 1px solid #f0f0f0;
                }
                .product-details-drawer .ant-descriptions-item-label {
                    border-right: 1px solid #f0f0f0;
                }
                .product-details-drawer .ant-descriptions-item-content {
                    border-bottom: 1px solid #f5f5f5;
                }
                .product-details-drawer
                    .ant-descriptions-item:last-child
                    .ant-descriptions-item-content {
                    border-bottom: none;
                }
                @media (max-width: 768px) {
                    .grid-cols-2 {
                        gap: 8px;
                    }
                }
            `}</style>
        </Drawer>
    );
};

export default ProductDetailsDrawer;
