import React from "react";
import { Input, Select, Button, Space, Row, Col } from "antd";
import {
    FilterOutlined,
    ClearOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import { FILTER_OPTIONS } from "../../utils/category_units/constants";

const { Search } = Input;
const { Option } = Select;

const SearchFilter = ({
    searchText,
    setSearchText,
    filter,
    setFilter,
    onClear,
    placeholder = "Search...",
    isAdmin = false,
}) => {
    return (
        <div className="space-y-4">
            {/* Search Input */}
            <div>
                <Search
                    placeholder={placeholder}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    allowClear
                    className="w-full"
                    size="large"
                    prefix={<SearchOutlined className="text-gray-400" />}
                    style={{
                        borderRadius: "8px",
                    }}
                />
            </div>

            {/* Filter Controls */}
            <Row gutter={[12, 12]} align="middle" className="mt-3">
                <Col xs={24} sm={12} md={8} lg={10}>
                    <div className="flex items-center space-x-2">
                        <FilterOutlined className="text-gray-500 text-sm" />
                        <Select
                            value={filter}
                            onChange={setFilter}
                            className="min-w-[120px] flex-1"
                            size="middle"
                            style={{ borderRadius: "6px" }}
                        >
                            <Option value={FILTER_OPTIONS.ALL}>
                                <span className="flex items-center gap-2">
                                    All Items
                                </span>
                            </Option>
                            <Option value={FILTER_OPTIONS.MINE}>
                                <span className="flex items-center gap-2">
                                    My Items
                                </span>
                            </Option>
                            {isAdmin && (
                                <Option value={FILTER_OPTIONS.OTHERS}>
                                    <span className="flex items-center gap-2">
                                        Others' Items
                                    </span>
                                </Option>
                            )}
                        </Select>
                    </div>
                </Col>

                <Col xs={24} sm={12} md={8} lg={6}>
                    <div className="flex justify-end sm:justify-start">
                        <Button
                            size="middle"
                            icon={<ClearOutlined />}
                            onClick={onClear}
                            className="border-gray-300 hover:border-red-400 hover:text-red-500 transition-colors duration-200"
                            type="default"
                        >
                            <span className="hidden sm:inline">
                                Clear Filters
                            </span>
                            <span className="sm:hidden">Clear</span>
                        </Button>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default SearchFilter;
