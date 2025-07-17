import React from "react";
import {
    Modal,
    Form,
    Input,
    Select,
    Row,
    Col,
    Divider,
    Button,
    Space,
    InputNumber,
} from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";

const { Option } = Select;

const PurchaseForm = ({
    visible,
    onCancel,
    onSubmit,
    suppliers,
    products,
    form,
    initialValues,
}) => {
    const handleSubmit = (values) => {
        const purchaseData = {
            supplier_id: values.supplier_id,
            purchase_no: values.purchase_no,
            purchase_status: values.purchase_status || "pending",
            details: values.details.map((detail) => ({
                product_id: detail.product_id,
                quantity: detail.quantity,
                unitcost: detail.unitcost,
            })),
        };
        onSubmit(purchaseData);
    };

    return (
        <Modal
            title="Add New Purchase"
            open={visible}
            onCancel={onCancel}
            footer={null}
            width={800}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={initialValues}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Purchase Number"
                            name="purchase_no"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter purchase number",
                                },
                                {
                                    max: 10,
                                    message:
                                        "Purchase number must be at most 10 characters",
                                },
                            ]}
                        >
                            <Input placeholder="Enter purchase number" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Supplier"
                            name="supplier_id"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select supplier",
                                },
                            ]}
                        >
                            <Select placeholder="Select supplier">
                                {suppliers.map((supplier) => (
                                    <Option
                                        key={supplier._id}
                                        value={supplier._id}
                                    >
                                        {supplier.name} ({supplier.shopname})
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item label="Purchase Status" name="purchase_status">
                    <Select placeholder="Select status">
                        <Option value="pending">Pending</Option>
                        <Option value="completed">Completed</Option>
                        <Option value="approved">Approved</Option>
                    </Select>
                </Form.Item>

                <Divider>Purchase Details</Divider>

                <Form.List name="details">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <Row key={key} gutter={16} align="middle">
                                    <Col span={7}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, "product_id"]}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Select product",
                                                },
                                            ]}
                                        >
                                            <Select placeholder="Select product">
                                                {products.map((product) => (
                                                    <Option
                                                        key={product._id}
                                                        value={product._id}
                                                    >
                                                        {product.product_name} (
                                                        {product.product_code})
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={5}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, "quantity"]}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Enter quantity",
                                                },
                                            ]}
                                        >
                                            <InputNumber
                                                placeholder="Quantity"
                                                min={1}
                                                style={{ width: "100%" }}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, "unitcost"]}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Enter unit cost",
                                                },
                                            ]}
                                        >
                                            <InputNumber
                                                placeholder="Unit Cost"
                                                min={0}
                                                precision={2}
                                                style={{ width: "100%" }}
                                                prefix="₹"
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Button
                                            type="dashed"
                                            onClick={() => remove(name)}
                                            icon={<MinusCircleOutlined />}
                                            danger
                                        />
                                    </Col>
                                </Row>
                            ))}
                            <Form.Item>
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    block
                                    icon={<PlusOutlined />}
                                >
                                    Add Product
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>

                <Form.Item className="mb-0 text-right">
                    <Space>
                        <Button onClick={onCancel}>Cancel</Button>
                        <Button type="primary" htmlType="submit">
                            Create Purchase
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default PurchaseForm;
