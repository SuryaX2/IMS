import React from "react";
import { Drawer, Image, Typography, Divider, Space } from "antd";
import {
    TagOutlined,
    InboxOutlined,
    DollarOutlined,
    CalendarOutlined,
    AppstoreOutlined,
    CheckCircleOutlined,
    WarningOutlined,
    CloseCircleOutlined,
    PercentageOutlined,
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
            return {
                status: "error",
                text: "Out of Stock",
                color: "#dc2626",
                bg: "#fef2f2",
                border: "#fecaca",
                icon: <CloseCircleOutlined />,
            };
        } else if (stock <= 10) {
            return {
                status: "warning",
                text: "Low Stock",
                color: "#d97706",
                bg: "#fffbeb",
                border: "#fed7aa",
                icon: <WarningOutlined />,
            };
        }
        return {
            status: "success",
            text: "In Stock",
            color: "#059669",
            bg: "#f0fdf4",
            border: "#bbf7d0",
            icon: <CheckCircleOutlined />,
        };
    };

    const stockStatus = getStockStatus(product.stock);
    const profitMargin = (
        product.selling_price - product.buying_price
    )?.toFixed(2);
    const profitPercentage =
        product.buying_price > 0
            ? (
                  ((product.selling_price - product.buying_price) /
                      product.buying_price) *
                  100
              ).toFixed(1)
            : 0;

    return (
        <Drawer
            title={
                <div className="flex items-center justify-between">
                    <Text className="text-lg font-bold text-gray-900">
                        Product Details
                    </Text>
                </div>
            }
            placement={placement}
            onClose={onClose}
            open={visible}
            width={width || (window.innerWidth < 768 ? "100vw" : "480px")}
            height={height}
            styles={{
                header: {
                    borderBottom: "1px solid #e5e7eb",
                    padding: "20px 24px",
                },
                body: {
                    padding: "24px",
                    backgroundColor: "#fafafa",
                },
            }}
        >
            <div className="space-y-5">
                <div className="bg-white rounded-3xl p-5 border-2 border-slate-400/50">
                    <div className="flex gap-5">
                        <div className="flex-shrink-0">
                            <div className="w-28 h-28 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                <Image
                                    src={product.product_image}
                                    alt={product.product_name}
                                    className="w-full h-full object-cover"
                                    style={{
                                        objectFit: "cover",
                                    }}
                                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6U"
                                    preview={{
                                        mask: (
                                            <div className="text-white text-xs font-medium">
                                                Preview
                                            </div>
                                        ),
                                    }}
                                />
                            </div>
                        </div>

                        <div className="flex-1 min-w-0">
                            <Title
                                level={4}
                                className="!text-gray-900 !mb-2 !text-lg !font-semibold"
                            >
                                {product.product_name}
                            </Title>
                            <div className="flex items-center gap-2 mb-3">
                                <TagOutlined className="text-gray-400 text-xs" />
                                <Text className="text-sm text-gray-600">
                                    {product.product_code}
                                </Text>
                            </div>
                            <div
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border"
                                style={{
                                    backgroundColor: stockStatus.bg,
                                    color: stockStatus.color,
                                    borderColor: stockStatus.border,
                                }}
                            >
                                {stockStatus.icon}
                                <span>{stockStatus.text}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white rounded-3xl p-4 border-2 border-slate-400/50">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-2">
                                <InboxOutlined className="text-blue-600 text-lg" />
                            </div>
                            <Text className="text-xs text-gray-500 mb-1 font-bold">
                                Stock
                            </Text>
                            <Text className="text-xl font-bold text-gray-900">
                                {product.stock}
                            </Text>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-4 border-2 border-slate-400/50">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center mb-2">
                                <DollarOutlined className="text-green-600 text-lg" />
                            </div>
                            <Text className="text-xs text-gray-500 mb-1 font-bold">
                                Profit
                            </Text>
                            <Text className="text-xl font-bold text-green-600">
                                ₹{profitMargin}
                            </Text>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-4 border-2 border-slate-400/50">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center mb-2">
                                <PercentageOutlined className="text-purple-600 text-lg" />
                            </div>
                            <Text className="text-xs text-gray-500 mb-1 font-bold">
                                Margin
                            </Text>
                            <Text className="text-xl font-bold text-purple-600">
                                {profitPercentage}%
                            </Text>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl border-2 border-slate-400/50">
                    <div className="px-5 py-4 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <DollarOutlined className="text-gray-700" />
                            <Text className="text-sm font-bold text-gray-900">
                                Pricing Information
                            </Text>
                        </div>
                    </div>
                    <div className="p-5">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Text className="text-sm text-gray-600">
                                    Buying Price
                                </Text>
                                <Text className="text-base font-semibold text-gray-900">
                                    ₹
                                    {product.buying_price?.toFixed(2) || "0.00"}
                                </Text>
                            </div>
                            <Divider className="!my-0" />
                            <div className="flex items-center justify-between">
                                <Text className="text-sm text-gray-600">
                                    Selling Price
                                </Text>
                                <Text className="text-base font-semibold text-blue-600">
                                    ₹
                                    {product.selling_price?.toFixed(2) ||
                                        "0.00"}
                                </Text>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl border-2 border-slate-400/50">
                    <div className="px-5 py-4 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <AppstoreOutlined className="text-gray-700" />
                            <Text className="text-sm font-bold text-gray-900">
                                Product Classification
                            </Text>
                        </div>
                    </div>
                    <div className="p-5">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Text className="text-sm text-gray-600">
                                    Category
                                </Text>
                                <Text className="text-sm font-medium text-gray-900">
                                    {product.category_id?.category_name ||
                                        "N/A"}
                                </Text>
                            </div>
                            <Divider className="!my-0" />
                            <div className="flex items-center justify-between">
                                <Text className="text-sm text-gray-600">
                                    Unit
                                </Text>
                                <Text className="text-sm font-medium text-gray-900">
                                    {product.unit_id?.unit_name || "N/A"}
                                </Text>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl border-2 border-slate-400/50">
                    <div className="px-5 py-4 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <CalendarOutlined className="text-gray-700" />
                            <Text className="text-sm font-bold text-gray-900">
                                Record Information
                            </Text>
                        </div>
                    </div>
                    <div className="p-5">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Text className="text-sm text-gray-600">
                                    Created
                                </Text>
                                <Text className="text-sm font-medium text-gray-900">
                                    {new Date(
                                        product.createdAt
                                    ).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </Text>
                            </div>
                            <Divider className="!my-0" />
                            <div className="flex items-center justify-between">
                                <Text className="text-sm text-gray-600">
                                    Last Updated
                                </Text>
                                <Text className="text-sm font-medium text-gray-900">
                                    {new Date(
                                        product.updatedAt
                                    ).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </Text>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Drawer>
    );
};

export default ProductDetailsDrawer;
