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
    filters = {},
    customers = [],
    onFilterChange,
    onApplyFilters,
    onResetFilters,
}) => {
    const totalRange = filters.total_range || {};

    return (
        <Card className="mb-6 border-2 rounded-lg">
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Input
                        placeholder="Search by invoice..."
                        prefix={<SearchOutlined className="text-gray-400" />}
                        value={filters.search || ""}
                        onChange={(e) =>
                            onFilterChange("search", e.target.value)
                        }
                        allowClear
                        className="h-10"
                    />

                    <Select
                        placeholder="Select Customer"
                        onChange={(value) =>
                            onFilterChange("customer_id", value)
                        }
                        allowClear
                        showSearch
                        optionFilterProp="children"
                        className="w-full h-10"
                    >
                        {customers.map((customer) => (
                            <Option key={customer._id} value={customer._id}>
                                {customer.name}
                            </Option>
                        ))}
                    </Select>

                    <Select
                        placeholder="Order Status"
                        onChange={(value) =>
                            onFilterChange("order_status", value)
                        }
                        allowClear
                        className="w-full h-10"
                    >
                        {ORDER_STATUSES.map((status) => (
                            <Option key={status.value} value={status.value}>
                                {status.label}
                            </Option>
                        ))}
                    </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <RangePicker
                        placeholder={["Start Date", "End Date"]}
                        value={filters.date_range}
                        onChange={(dates) =>
                            onFilterChange("date_range", dates)
                        }
                        className="w-full h-10"
                        format="MMM DD, YYYY"
                    />

                    <InputNumber
                        placeholder="Min Total (₹)"
                        value={totalRange.min}
                        onChange={(value) =>
                            onFilterChange("total_range", {
                                ...totalRange,
                                min: value,
                            })
                        }
                        className="w-full h-10"
                        min={0}
                        prefix="₹"
                        formatter={(value) =>
                            value
                                ? `${value}`.replace(
                                      /\B(?=(\d{3})+(?!\d))/g,
                                      ","
                                  )
                                : ""
                        }
                        parser={(value) => value.replace(/₹\s?|(,*)/g, "")}
                    />

                    <InputNumber
                        placeholder="Max Total (₹)"
                        value={totalRange.max}
                        onChange={(value) =>
                            onFilterChange("total_range", {
                                ...totalRange,
                                max: value,
                            })
                        }
                        className="w-full h-10"
                        min={0}
                        prefix="₹"
                        formatter={(value) =>
                            value
                                ? `${value}`.replace(
                                      /\B(?=(\d{3})+(?!\d))/g,
                                      ","
                                  )
                                : ""
                        }
                        parser={(value) => value.replace(/₹\s?|(,*)/g, "")}
                    />
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-gray-100">
                    <Button
                        type="primary"
                        icon={<FilterOutlined />}
                        onClick={onApplyFilters}
                        className="h-10 font-medium"
                    >
                        Apply Filters
                    </Button>
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={onResetFilters}
                        className="h-10"
                    >
                        Reset
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default OrderFilters;
