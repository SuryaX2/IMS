import React from "react";
import { Form, Row, Col, Select, InputNumber, Button } from "antd";

const { Option } = Select;

const OrderFormItems = ({ products, onRemove, name, restField }) => {
    return (
        <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
            <Row gutter={16}>
                <Col span={8}>
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
                        >
                            {products.map((product) => (
                                <Option key={product._id} value={product._id}>
                                    {product.product_name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={6}>
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
                            placeholder="Quantity"
                            min={1}
                            className="w-full"
                        />
                    </Form.Item>
                </Col>
                <Col span={6}>
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
                            placeholder="Unit Cost"
                            min={0}
                            step={0.01}
                            className="w-full"
                        />
                    </Form.Item>
                </Col>
                <Col span={4} className="flex items-end">
                    <Button
                        type="text"
                        danger
                        onClick={onRemove}
                        className="mb-6"
                    >
                        Remove
                    </Button>
                </Col>
            </Row>
        </div>
    );
};

export default OrderFormItems;
