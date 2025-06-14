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
            width={300}
            footer={
                <div className="flex justify-end">
                    <Button onClick={onReset} className="mr-2">
                        Reset
                    </Button>
                    <Button type="primary" onClick={onApply}>
                        Apply
                    </Button>
                </div>
            }
        >
            <div className="space-y-6">
                <div>
                    <Text strong>Category</Text>
                    <Select
                        style={{ width: "100%", marginTop: "8px" }}
                        placeholder="Filter by category"
                        allowClear
                        value={categoryFilter}
                        onChange={onCategoryChange}
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
                    <Text strong>Stock Status</Text>
                    <Select
                        style={{ width: "100%", marginTop: "8px" }}
                        placeholder="Filter by stock status"
                        allowClear
                        value={stockFilter}
                        onChange={onStockChange}
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
