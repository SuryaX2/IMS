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
            width="95vw"
            style={{ maxWidth: "800px", top: "10px" }}
            className="mobile-modal"
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onSubmit}
                className="mt-2 sm:mt-4"
            >
                <Row gutter={[8, 0]} className="sm:gutter-16">
                    <Col xs={24} sm={12}>
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
                                size="large"
                                className="sm:size-default"
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
                    <Col xs={24} sm={12}>
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
                                size="large"
                                className="sm:size-default"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="order_status"
                    label="Order Status"
                    initialValue="pending"
                >
                    <Select size="large" className="sm:size-default">
                        <Option value="pending">Pending</Option>
                        <Option value="processing">Processing</Option>
                        <Option value="completed">Completed</Option>
                    </Select>
                </Form.Item>

                <Form.List name="orderItems" initialValue={[{}]}>
                    {(fields, { add, remove }) => (
                        <>
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 sm:mb-4 gap-2">
                                <h3 className="text-base sm:text-lg font-medium">
                                    Order Items
                                </h3>
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    icon={<PlusOutlined />}
                                    size="large"
                                    className="sm:size-default w-full sm:w-auto"
                                >
                                    Add Item
                                </Button>
                            </div>
                            <div className="space-y-3 sm:space-y-0">
                                {fields.map(({ key, name, ...restField }) => (
                                    <OrderFormItems
                                        key={key}
                                        products={products}
                                        onRemove={() => remove(name)}
                                        name={name}
                                        restField={restField}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </Form.List>

                <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4 sm:mt-6">
                    <Button
                        onClick={onCancel}
                        size="large"
                        className="sm:size-default order-2 sm:order-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        className="bg-blue-600 hover:bg-blue-700 sm:size-default order-1 sm:order-2"
                    >
                        Create Order
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default CreateOrderModal;
