import React from "react";
import { Form, Row, Col, Select, InputNumber, Button } from "antd";
import {
    DeleteOutlined,
    ShoppingOutlined,
    NumberOutlined,
    DollarOutlined,
} from "@ant-design/icons";

const { Option } = Select;

const OrderFormItems = ({ products, onRemove, name, restField }) => {
    return (
        <div className="relative bg-white border-2 border-gray-200 rounded-2xl p-5 mb-4">
            <Button
                type="text"
                danger
                onClick={onRemove}
                className="absolute top-3 right-3 flex items-center justify-center h-8 w-8 rounded-lg hover:bg-red-50 z-10"
                icon={<DeleteOutlined className="text-sm" />}
            />

            <div className="pr-10">
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={24} md={24} lg={12}>
                        <Form.Item
                            {...restField}
                            name={[name, "product_id"]}
                            label={
                                <span className="text-sm font-medium text-gray-700">
                                    Product
                                </span>
                            }
                            rules={[
                                {
                                    required: true,
                                    message: "Please select a product",
                                },
                            ]}
                            className="mb-0"
                        >
                            <Select
                                placeholder="Select a product"
                                showSearch
                                optionFilterProp="children"
                                size="large"
                                className="w-full"
                            >
                                {products.map((product) => (
                                    <Option
                                        key={product._id}
                                        value={product._id}
                                    >
                                        {product.product_name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col xs={12} sm={12} md={12} lg={6}>
                        <Form.Item
                            {...restField}
                            name={[name, "quantity"]}
                            label={
                                <span className="text-sm font-medium text-gray-700">
                                    Quantity
                                </span>
                            }
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter quantity",
                                },
                            ]}
                            className="mb-0"
                        >
                            <InputNumber
                                placeholder="0"
                                min={1}
                                className="w-full"
                                size="large"
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={12} sm={12} md={12} lg={6}>
                        <Form.Item
                            {...restField}
                            name={[name, "unitcost"]}
                            label={
                                <span className="text-sm font-medium text-gray-700">
                                    Unit Cost
                                </span>
                            }
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter unit cost",
                                },
                            ]}
                            className="mb-0"
                        >
                            <InputNumber
                                placeholder="0.00"
                                min={0}
                                step={0.01}
                                className="w-full"
                                size="large"
                                prefix="₹"
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default OrderFormItems;
