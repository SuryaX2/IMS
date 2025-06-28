import React from "react";
import {
    Modal,
    Form,
    Row,
    Col,
    Select,
    Input,
    Button,
    InputNumber,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

const CreateOrderModal = ({
    visible,
    onCancel,
    onSubmit,
    customers,
    products,
    form,
}) => {
    return (
        <Modal
            title="Create New Order"
            open={visible}
            onCancel={onCancel}
            footer={null}
            width={800}
            className="top-4"
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onSubmit}
                className="mt-4"
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="customer_id"
                            label="Customer"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select a customer",
                                },
                            ]}
                        >
                            <Select
                                placeholder="Select Customer"
                                showSearch
                                optionFilterProp="children"
                            >
                                {customers.map((customer) => (
                                    <Option
                                        key={customer._id}
                                        value={customer._id}
                                    >
                                        {customer.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="invoice_no"
                            label="Invoice Number"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter invoice number",
                                },
                            ]}
                        >
                            <Input
                                placeholder="Enter invoice number"
                                maxLength={10}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="order_status"
                    label="Order Status"
                    initialValue="pending"
                >
                    <Select>
                        <Option value="pending">Pending</Option>
                        <Option value="processing">Processing</Option>
                        <Option value="completed">Completed</Option>
                    </Select>
                </Form.Item>

                <Form.List name="orderItems" initialValue={[{}]}>
                    {(fields, { add, remove }) => (
                        <>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium">
                                    Order Items
                                </h3>
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    icon={<PlusOutlined />}
                                >
                                    Add Item
                                </Button>
                            </div>
                            {fields.map(({ key, name, ...restField }) => (
                                <div
                                    key={key}
                                    className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50"
                                >
                                    <Row gutter={16}>
                                        <Col span={8}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, "product_id"]}
                                                label="Product"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            "Please select a product",
                                                    },
                                                ]}
                                            >
                                                <Select
                                                    placeholder="Select Product"
                                                    showSearch
                                                    optionFilterProp="children"
                                                >
                                                    {products.map((product) => (
                                                        <Option
                                                            key={product._id}
                                                            value={product._id}
                                                        >
                                                            {
                                                                product.product_name
                                                            }
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
                                                        message:
                                                            "Please enter quantity",
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
                                                        message:
                                                            "Please enter unit cost",
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
                                        <Col
                                            span={4}
                                            className="flex items-end"
                                        >
                                            <Button
                                                type="text"
                                                danger
                                                onClick={() => remove(name)}
                                                className="mb-6"
                                            >
                                                Remove
                                            </Button>
                                        </Col>
                                    </Row>
                                </div>
                            ))}
                        </>
                    )}
                </Form.List>

                <div className="flex justify-end gap-2 mt-6">
                    <Button onClick={onCancel}>Cancel</Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        Create Order
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default CreateOrderModal;
