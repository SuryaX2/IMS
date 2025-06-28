import React from "react";
import { Modal, Form, Row, Col, Select, Input, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import OrderFormItems from "./OrderFormItems";

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
                                <OrderFormItems
                                    key={key}
                                    products={products}
                                    onRemove={() => remove(name)}
                                    name={name}
                                    restField={restField}
                                />
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
