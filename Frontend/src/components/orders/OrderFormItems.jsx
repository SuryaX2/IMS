import React from "react";
import { Form, Row, Col, Select, InputNumber, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const { Option } = Select;

const OrderFormItems = ({ products, onRemove, name, restField }) => {
    return (
        <div className="border border-gray-200 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 bg-gray-50">
            <Row gutter={[8, 8]} className="sm:gutter-16">
                <Col xs={24} sm={12} md={8}>
                    <Form.Item
                        {...restField}
                        name={[name, "product_id"]}
                        label="Product"
                        rules={[
                            {
                                required: true,
                                message: "Please select a product",
                            },
                        ]}
                    >
                        <Select
                            placeholder="Select Product"
                            showSearch
                            optionFilterProp="children"
                            size="large"
                            className="sm:size-default"
                        >
                            {products.map((product) => (
                                <Option key={product._id} value={product._id}>
                                    {product.product_name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col xs={12} sm={6} md={6}>
                    <Form.Item
                        {...restField}
                        name={[name, "quantity"]}
                        label="Quantity"
                        rules={[
                            {
                                required: true,
                                message: "Please enter quantity",
                            },
                        ]}
                    >
                        <InputNumber
                            placeholder="Qty"
                            min={1}
                            className="w-full"
                            size="large"
                        />
                    </Form.Item>
                </Col>
                <Col xs={12} sm={6} md={6}>
                    <Form.Item
                        {...restField}
                        name={[name, "unitcost"]}
                        label="Unit Cost"
                        rules={[
                            {
                                required: true,
                                message: "Please enter unit cost",
                            },
                        ]}
                    >
                        <InputNumber
                            placeholder="Cost"
                            min={0}
                            step={0.01}
                            className="w-full"
                            size="large"
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={4} className="flex items-end">
                    <Button
                        type="text"
                        danger
                        onClick={onRemove}
                        className="mb-3 sm:mb-6 w-full sm:w-auto flex items-center justify-center"
                        icon={<DeleteOutlined />}
                        size="large"
                    >
                        <span className="sm:hidden ml-1">Remove</span>
                    </Button>
                </Col>
            </Row>
        </div>
    );
};

export default OrderFormItems;
