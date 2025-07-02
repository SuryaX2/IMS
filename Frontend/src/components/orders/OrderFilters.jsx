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
        <Card className="mb-4 sm:mb-6 border-0 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="sm:col-span-2 lg:col-span-1">
                    <Input
                        placeholder="Search by invoice..."
                        prefix={<SearchOutlined />}
                        value={filters.search}
                        onChange={(e) =>
                            onFilterChange("search", e.target.value)
                        }
                        allowClear
                        size="large"
                        className="sm:size-default"
                    />
                </div>

                <div className="sm:col-span-2 lg:col-span-1">
                    <Select
                        placeholder="Select Customer"
                        value={filters.customer_id}
                        onChange={(value) =>
                            onFilterChange("customer_id", value)
                        }
                        allowClear
                        showSearch
                        optionFilterProp="children"
                        size="large"
                        className="w-full sm:size-default"
                    >
                        {customers.map((customer) => (
                            <Option key={customer._id} value={customer._id}>
                                {customer.name}
                            </Option>
                        ))}
                    </Select>
                </div>

                <div className="sm:col-span-2 lg:col-span-1">
                    <Select
                        placeholder="Order Status"
                        value={filters.order_status}
                        onChange={(value) =>
                            onFilterChange("order_status", value)
                        }
                        allowClear
                        size="large"
                        className="w-full sm:size-default"
                    >
                        {ORDER_STATUSES.map((status) => (
                            <Option key={status.value} value={status.value}>
                                {status.label}
                            </Option>
                        ))}
                    </Select>
                </div>

                <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                    <RangePicker
                        placeholder={["Start Date", "End Date"]}
                        value={filters.date_range}
                        onChange={(dates) =>
                            onFilterChange("date_range", dates)
                        }
                        className="w-full"
                        size="large"
                        format="MMM DD, YYYY"
                    />
                </div>

                <div className="sm:col-span-1 lg:col-span-1">
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
                        size="large"
                    />
                </div>

                <div className="sm:col-span-1 lg:col-span-1">
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
                        size="large"
                    />
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
                <Button
                    type="primary"
                    icon={<FilterOutlined />}
                    onClick={onApplyFilters}
                    className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                    size="large"
                >
                    Apply Filters
                </Button>
                <Button
                    icon={<ReloadOutlined />}
                    onClick={onResetFilters}
                    className="w-full sm:w-auto"
                    size="large"
                >
                    Reset
                </Button>
            </div>
        </Card>
    );
};

export default OrderFilters;
