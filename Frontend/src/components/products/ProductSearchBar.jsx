import React from "react";
import { Card, Input, Button, Space } from "antd";
import {
    SearchOutlined,
    FilterOutlined,
    ReloadOutlined,
} from "@ant-design/icons";

const ProductSearchBar = ({
    searchText,
    onSearchChange,
    onSearch,
    onShowFilters,
    onReset,
}) => {
    return (
        <Card className="mb-6">
            <div className="flex flex-col md:flex-row gap-4">
                <Input
                    placeholder="Search products by name or code"
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={(e) => onSearchChange(e.target.value)}
                    onPressEnter={onSearch}
                    className="md:w-72"
                />

                <Space>
                    <Button icon={<FilterOutlined />} onClick={onShowFilters}>
                        Filters
                    </Button>

                    <Button icon={<ReloadOutlined />} onClick={onReset}>
                        Reset
                    </Button>

                    <Button type="primary" onClick={onSearch}>
                        Search
                    </Button>
                </Space>
            </div>
        </Card>
    );
};

export default ProductSearchBar;
