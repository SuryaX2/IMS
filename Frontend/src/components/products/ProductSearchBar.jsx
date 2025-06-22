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
        <Card className="mb-4 sm:mb-6">
            <div className="flex flex-col gap-3 sm:gap-4">
                {/* Search Input */}
                <Input
                    placeholder="Search products by name or code"
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={(e) => onSearchChange(e.target.value)}
                    onPressEnter={onSearch}
                    size="large"
                    className="w-full"
                />

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    <Button
                        icon={<FilterOutlined />}
                        onClick={onShowFilters}
                        className="flex-1 min-w-0 sm:flex-none"
                        size="large"
                    >
                        <span className="hidden sm:inline">Filters</span>
                    </Button>

                    <Button
                        icon={<ReloadOutlined />}
                        onClick={onReset}
                        className="flex-1 min-w-0 sm:flex-none"
                        size="large"
                    >
                        <span className="hidden sm:inline">Reset</span>
                    </Button>

                    <Button
                        type="primary"
                        onClick={onSearch}
                        className="flex-1 min-w-0 sm:flex-none"
                        size="large"
                    >
                        Search
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default ProductSearchBar;
