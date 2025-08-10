import React from "react";
import { Card, Row, Col, Select } from "antd";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
import { Input } from "antd";

const { Search } = Input;
const { Option } = Select;

const SupplierFilters = ({
    searchText,
    setSearchText,
    filterType,
    setFilterType,
}) => {
    return (
        <Card className="mb-4">
            <Row gutter={16} align="middle">
                <Col xs={24} md={12} lg={8}>
                    <Search
                        placeholder="Search suppliers..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        prefix={<SearchOutlined />}
                        allowClear
                    />
                </Col>
                <Col xs={24} md={12} lg={6}>
                    <Select
                        style={{ width: "100%" }}
                        placeholder="Filter by type"
                        value={filterType}
                        onChange={setFilterType}
                        suffixIcon={<FilterOutlined />}
                    >
                        <Option value="all">All Types</Option>
                        <Option value="individual">Individual</Option>
                        <Option value="wholesale">Wholesale</Option>
                        <Option value="retail">Retail</Option>
                        <Option value="company">Company</Option>
                    </Select>
                </Col>
            </Row>
        </Card>
    );
};

export default SupplierFilters;
