import React from "react";
import { Card, Row, Col, Input, Select, Button } from "antd";
import {
    SearchOutlined,
    FilterOutlined,
    ReloadOutlined,
} from "@ant-design/icons";

const { Option } = Select;

const FilterControls = ({
    searchText,
    onSearchChange,
    filters = [],
    onFilterChange,
    onRefresh,
    showRefresh = true,
    actions = [],
    className = "filter-controls",
}) => {
    return (
        <Card className={className}>
            <Row gutter={[16, 16]} align="middle">
                {/* Search Input */}
                <Col xs={24} sm={12} md={6}>
                    <Input
                        placeholder="Search..."
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={(e) => onSearchChange(e.target.value)}
                        allowClear
                    />
                </Col>

                {/* Dynamic Filters */}
                {filters.map((filter, index) => (
                    <Col key={index} xs={24} sm={12} md={filter.span || 4}>
                        <Select
                            placeholder={filter.placeholder}
                            value={filter.value}
                            onChange={(value) =>
                                onFilterChange(filter.key, value)
                            }
                            style={{ width: "100%" }}
                            allowClear={filter.allowClear}
                        >
                            {filter.options?.map((option) => (
                                <Option key={option.value} value={option.value}>
                                    {option.label}
                                </Option>
                            ))}
                        </Select>
                    </Col>
                ))}

                {/* Actions */}
                <Col
                    xs={24}
                    sm={24}
                    md={actions.length + (showRefresh ? 1 : 0) > 1 ? 8 : 4}
                >
                    <div className="flex gap-2 justify-end">
                        {showRefresh && (
                            <Button
                                icon={<ReloadOutlined />}
                                onClick={onRefresh}
                                title="Refresh"
                            />
                        )}
                        {actions.map((action, index) => (
                            <Button
                                key={index}
                                type={action.type || "default"}
                                icon={action.icon}
                                onClick={action.onClick}
                                disabled={action.disabled}
                                danger={action.danger}
                            >
                                {action.label}
                            </Button>
                        ))}
                    </div>
                </Col>
            </Row>
        </Card>
    );
};

export default FilterControls;
