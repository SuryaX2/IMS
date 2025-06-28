import React from "react";
import { Card, Input, Select, DatePicker, InputNumber, Button } from "antd";
import {
    SearchOutlined,
    FilterOutlined,
    ReloadOutlined,
} from "@ant-design/icons";
import { ORDER_STATUSES } from "../../utils/orderHelpers";

const { Option } = Select;
const { RangePicker } = DatePicker;

const OrderFilters = ({
    filters,
    customers,
    onFilterChange,
    onApplyFilters,
    onResetFilters,
}) => {
    return (
        <Card className="mb-6 border-0 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-4">
                <Input
                    placeholder="Search by invoice..."
                    prefix={<SearchOutlined />}
                    value={filters.search}
                    onChange={(e) => onFilterChange("search", e.target.value)}
                    allowClear
                />

                <Select
                    placeholder="Select Customer"
                    value={filters.customer_id}
                    onChange={(value) => onFilterChange("customer_id", value)}
                    allowClear
                    showSearch
                    optionFilterProp="children"
                >
                    {customers.map((customer) => (
                        <Option key={customer._id} value={customer._id}>
                            {customer.name}
                        </Option>
                    ))}
                </Select>

                <Select
                    placeholder="Order Status"
                    value={filters.order_status}
                    onChange={(value) => onFilterChange("order_status", value)}
                    allowClear
                >
                    {ORDER_STATUSES.map((status) => (
                        <Option key={status.value} value={status.value}>
                            {status.label}
                        </Option>
                    ))}
                </Select>

                <RangePicker
                    placeholder={["Start Date", "End Date"]}
                    value={filters.date_range}
                    onChange={(dates) => onFilterChange("date_range", dates)}
                    className="w-full"
                />

                <InputNumber
                    placeholder="Min Total"
                    value={filters.total_range.min}
                    onChange={(value) =>
                        onFilterChange("total_range", {
                            ...filters.total_range,
                            min: value,
                        })
                    }
                    className="w-full"
                    min={0}
                />

                <InputNumber
                    placeholder="Max Total"
                    value={filters.total_range.max}
                    onChange={(value) =>
                        onFilterChange("total_range", {
                            ...filters.total_range,
                            max: value,
                        })
                    }
                    className="w-full"
                    min={0}
                />
            </div>

            <div className="flex gap-2">
                <Button
                    type="primary"
                    icon={<FilterOutlined />}
                    onClick={onApplyFilters}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    Apply Filters
                </Button>
                <Button icon={<ReloadOutlined />} onClick={onResetFilters}>
                    Reset
                </Button>
            </div>
        </Card>
    );
};

export default OrderFilters;
