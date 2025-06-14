import React from "react";
import { Modal, Form, Input, Select, InputNumber, Row, Col } from "antd";
import ProductImageUpload from "./ProductImageUpload";

const { Option } = Select;

const ProductModal = ({
    visible,
    title,
    form,
    loading,
    categories,
    units,
    editingProduct,
    imageUrl,
    onSave,
    onCancel,
    onImageChange,
}) => {
    return (
        <Modal
            title={title}
            open={visible}
            onCancel={onCancel}
            confirmLoading={loading}
            onOk={onSave}
            width={700}
        >
            <Form form={form} layout="vertical" initialValues={{ stock: 0 }}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="product_name"
                            label="Product Name"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter product name",
                                },
                                {
                                    max: 50,
                                    message: "Maximum 50 characters allowed",
                                },
                            ]}
                        >
                            <Input placeholder="Enter product name" />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            name="product_code"
                            label="Product Code"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter product code",
                                },
                                {
                                    max: 5,
                                    message: "Maximum 5 characters allowed",
                                },
                            ]}
                        >
                            <Input
                                placeholder="Enter product code"
                                disabled={!!editingProduct}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="category_id"
                            label="Category"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select a category",
                                },
                            ]}
                        >
                            <Select placeholder="Select category">
                                {categories.map((category) => (
                                    <Option
                                        key={category._id}
                                        value={category._id}
                                    >
                                        {category.category_name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            name="unit_id"
                            label="Unit"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select a unit",
                                },
                            ]}
                        >
                            <Select placeholder="Select unit">
                                {units.map((unit) => (
                                    <Option key={unit._id} value={unit._id}>
                                        {unit.unit_name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="buying_price"
                            label="Buying Price"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter buying price",
                                },
                                {
                                    type: "number",
                                    min: 0,
                                    message: "Price must be positive",
                                },
                            ]}
                        >
                            <InputNumber
                                placeholder="0.00"
                                prefix="$"
                                style={{ width: "100%" }}
                                precision={2}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            name="selling_price"
                            label="Selling Price"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter selling price",
                                },
                                {
                                    type: "number",
                                    min: 0,
                                    message: "Price must be positive",
                                },
                            ]}
                        >
                            <InputNumber
                                placeholder="0.00"
                                prefix="$"
                                style={{ width: "100%" }}
                                precision={2}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <ProductImageUpload
                    imageUrl={imageUrl}
                    onChange={onImageChange}
                />
            </Form>
        </Modal>
    );
};

export default ProductModal;
