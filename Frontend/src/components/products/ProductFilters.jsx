import React from "react";
import { Drawer, Select, Typography, Divider, Button } from "antd";

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
            title="Filter Products"
            placement="right"
            onClose={onClose}
            open={visible}
            width="100%"
            style={{
                maxWidth: window.innerWidth < 768 ? "100vw" : "300px",
            }}
            footer={
                <div className="flex flex-col sm:flex-row justify-end gap-2">
                    <Button onClick={onReset} className="w-full sm:w-auto">
                        Reset
                    </Button>
                    <Button
                        type="primary"
                        onClick={onApply}
                        className="w-full sm:w-auto"
                    >
                        Apply
                    </Button>
                </div>
            }
        >
            <div className="space-y-4 sm:space-y-6">
                <div>
                    <Text strong className="text-sm sm:text-base">
                        Category
                    </Text>
                    <Select
                        style={{ width: "100%", marginTop: "8px" }}
                        placeholder="Filter by category"
                        allowClear
                        value={categoryFilter}
                        onChange={onCategoryChange}
                        size="large"
                    >
                        {categories.map((cat) => (
                            <Option key={cat._id} value={cat._id}>
                                {cat.category_name}
                            </Option>
                        ))}
                    </Select>
                </div>

                <Divider />

                <div>
                    <Text strong className="text-sm sm:text-base">
                        Stock Status
                    </Text>
                    <Select
                        style={{ width: "100%", marginTop: "8px" }}
                        placeholder="Filter by stock status"
                        allowClear
                        value={stockFilter}
                        onChange={onStockChange}
                        size="large"
                    >
                        <Option value="out">Out of Stock</Option>
                        <Option value="low">Low Stock</Option>
                        <Option value="in">In Stock</Option>
                    </Select>
                </div>
            </div>
        </Drawer>
    );
};

export default ProductFilters;