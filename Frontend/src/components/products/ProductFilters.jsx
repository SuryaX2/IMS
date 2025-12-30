import React from "react";
import { Drawer, Select, Typography, Button, Space } from "antd";
import {
    FilterOutlined,
    AppstoreOutlined,
    InboxOutlined,
    CloseCircleOutlined,
    CheckCircleOutlined,
} from "@ant-design/icons";

const { Text } = Typography;
const { Option } = Select;

const ProductFilters = ({
    visible,
    categories,
    categoryFilter,
    stockFilter,
    onCategoryChange,
    onStockChange,
    onApply,
    onReset,
    onClose,
}) => {
    return (
        <Drawer
            title={
                <div className="flex items-center gap-2.5">
                    <FilterOutlined className="text-blue-600 text-base" />
                    <span className="text-base font-semibold text-gray-900">
                        Filter Products
                    </span>
                </div>
            }
            placement="right"
            onClose={onClose}
            open={visible}
            width={window.innerWidth < 768 ? "100vw" : "340px"}
            styles={{
                header: {
                    borderBottom: "1px solid #e5e7eb",
                    padding: "16px 24px",
                },
                body: {
                    padding: 0,
                    backgroundColor: "#f9fafb",
                },
                footer: {
                    borderTop: "1px solid #e5e7eb",
                    padding: "12px 24px",
                },
            }}
            footer={
                <div className="flex items-center gap-2">
                    <Button
                        onClick={onReset}
                        icon={<CloseCircleOutlined />}
                        className="flex-1"
                        size="large"
                    >
                        Reset
                    </Button>
                    <Button
                        type="primary"
                        onClick={onApply}
                        icon={<CheckCircleOutlined />}
                        className="flex-1"
                        size="large"
                    >
                        Apply
                    </Button>
                </div>
            }
        >
            <div className="p-4 space-y-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                            <AppstoreOutlined className="text-blue-600 text-sm" />
                        </div>
                        <Text className="text-sm font-semibold text-gray-900">
                            Category
                        </Text>
                    </div>
                    <Select
                        style={{ width: "100%" }}
                        placeholder="All categories"
                        allowClear
                        value={categoryFilter}
                        onChange={onCategoryChange}
                        size="large"
                        className="w-full"
                    >
                        {categories.map((cat) => (
                            <Option key={cat._id} value={cat._id}>
                                {cat.category_name}
                            </Option>
                        ))}
                    </Select>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                            <InboxOutlined className="text-green-600 text-sm" />
                        </div>
                        <Text className="text-sm font-semibold text-gray-900">
                            Stock Status
                        </Text>
                    </div>
                    <Select
                        style={{ width: "100%" }}
                        placeholder="All stock levels"
                        allowClear
                        value={stockFilter}
                        onChange={onStockChange}
                        size="large"
                        className="w-full"
                    >
                        <Option value="out">
                            <Space>
                                <span className="inline-block w-2 h-2 rounded-full bg-red-500"></span>
                                Out of Stock
                            </Space>
                        </Option>
                        <Option value="low">
                            <Space>
                                <span className="inline-block w-2 h-2 rounded-full bg-yellow-500"></span>
                                Low Stock
                            </Space>
                        </Option>
                        <Option value="in">
                            <Space>
                                <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                                In Stock
                            </Space>
                        </Option>
                    </Select>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                    <Text className="text-xs text-blue-700 leading-relaxed">
                        <strong>Tip:</strong> Select filters above and click
                        Apply to update your product list.
                    </Text>
                </div>
            </div>
        </Drawer>
    );
};

export default ProductFilters;
