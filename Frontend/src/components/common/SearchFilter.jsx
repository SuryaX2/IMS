import React from "react";
import { Input, Select, Button, Space } from "antd";
import { FilterOutlined, ClearOutlined } from "@ant-design/icons";
import { FILTER_OPTIONS } from "../../utils/constants";

const { Search } = Input;
const { Option } = Select;

const SearchFilter = ({
    searchText,
    setSearchText,
    filter,
    setFilter,
    onClear,
    placeholder = "Search...",
    showOthersFilter = false,
}) => {
    return (
        <div className="mb-4 space-y-2">
            <Search
                placeholder={placeholder}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
                className="w-full"
            />
            <div className="flex items-center justify-between">
                <Select
                    value={filter}
                    onChange={setFilter}
                    className="w-32"
                    suffixIcon={<FilterOutlined />}
                >
                    <Option value={FILTER_OPTIONS.ALL}>All</Option>
                    <Option value={FILTER_OPTIONS.MINE}>Mine</Option>
                    {showOthersFilter && (
                        <Option value={FILTER_OPTIONS.OTHERS}>Others</Option>
                    )}
                </Select>
                <Button size="small" icon={<ClearOutlined />} onClick={onClear}>
                    Clear
                </Button>
            </div>
        </div>
    );
};

export default SearchFilter;
