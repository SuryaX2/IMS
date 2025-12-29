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
            title={
                <div className="text-xl text-center font-bold text-gray-800">
                    {title}
                </div>
            }
            open={visible}
            onCancel={onCancel}
            confirmLoading={loading}
            onOk={onSave}
            width="90%"
            style={{
                maxWidth: "920px",
                top: 32,
            }}
            styles={{
                body: {
                    padding: "20px 24px",
                },
            }}
            okText="Save Product"
            cancelText="Cancel"
            okButtonProps={{
                size: "large",
                className: "min-w-[140px] h-10",
            }}
            cancelButtonProps={{
                size: "large",
                className: "h-10",
            }}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{ stock: 0 }}
                className="product-modal-form"
            >
                <Row gutter={20} className="space-y-4 lg:space-y-0">
                    <Col xs={24} lg={14}>
                        <div className="space-y-4">
                            <div className="bg-white rounded-lg border-2 border-gray-200 p-4 ">
                                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                                    <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                        Product Details
                                    </h3>
                                </div>
                                <Row gutter={12}>
                                    <Col xs={24} sm={12}>
                                        <Form.Item
                                            name="product_name"
                                            label={
                                                <span className="text-xs font-medium text-gray-600">
                                                    Product Name
                                                </span>
                                            }
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Please enter product name",
                                                },
                                                {
                                                    max: 50,
                                                    message:
                                                        "Maximum 50 characters allowed",
                                                },
                                            ]}
                                            className="mb-3"
                                        >
                                            <Input
                                                placeholder="Enter product name"
                                                size="large"
                                                className="rounded-md"
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col xs={24} sm={12}>
                                        <Form.Item
                                            name="product_code"
                                            label={
                                                <span className="text-xs font-medium text-gray-600">
                                                    Product Code
                                                </span>
                                            }
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Please enter product code",
                                                },
                                                {
                                                    max: 5,
                                                    message:
                                                        "Maximum 5 characters allowed",
                                                },
                                            ]}
                                            className="mb-3"
                                        >
                                            <Input
                                                placeholder="Enter code"
                                                disabled={!!editingProduct}
                                                size="large"
                                                className="rounded-md"
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col xs={24} sm={12}>
                                        <Form.Item
                                            name="category_id"
                                            label={
                                                <span className="text-xs font-medium text-gray-600">
                                                    Category
                                                </span>
                                            }
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Please select a category",
                                                },
                                            ]}
                                            className="mb-0"
                                        >
                                            <Select
                                                placeholder="Select category"
                                                size="large"
                                                className="rounded-md"
                                            >
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

                                    <Col xs={24} sm={12}>
                                        <Form.Item
                                            name="unit_id"
                                            label={
                                                <span className="text-xs font-medium text-gray-600">
                                                    Unit
                                                </span>
                                            }
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Please select a unit",
                                                },
                                            ]}
                                            className="mb-0"
                                        >
                                            <Select
                                                placeholder="Select unit"
                                                size="large"
                                                className="rounded-md"
                                            >
                                                {units.map((unit) => (
                                                    <Option
                                                        key={unit._id}
                                                        value={unit._id}
                                                    >
                                                        {unit.unit_name}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </div>

                            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg border-2 border-emerald-200 p-4 ">
                                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-emerald-100">
                                    <div className="w-1 h-4 bg-emerald-500 rounded-full"></div>
                                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                        Pricing
                                    </h3>
                                </div>
                                <Row gutter={12}>
                                    <Col xs={24} sm={12}>
                                        <Form.Item
                                            name="buying_price"
                                            label={
                                                <span className="text-xs font-medium text-gray-600">
                                                    Buying Price
                                                </span>
                                            }
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Please enter buying price",
                                                },
                                                {
                                                    type: "number",
                                                    min: 0,
                                                    message:
                                                        "Price must be positive",
                                                },
                                            ]}
                                            className="mb-0"
                                        >
                                            <InputNumber
                                                placeholder="0.00"
                                                prefix="$"
                                                style={{ width: "100%" }}
                                                precision={2}
                                                size="large"
                                                className="rounded-md"
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col xs={24} sm={12}>
                                        <Form.Item
                                            name="selling_price"
                                            label={
                                                <span className="text-xs font-medium text-gray-600">
                                                    Selling Price
                                                </span>
                                            }
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Please enter selling price",
                                                },
                                                {
                                                    type: "number",
                                                    min: 0,
                                                    message:
                                                        "Price must be positive",
                                                },
                                            ]}
                                            className="mb-0"
                                        >
                                            <InputNumber
                                                placeholder="0.00"
                                                prefix="$"
                                                style={{ width: "100%" }}
                                                precision={2}
                                                size="large"
                                                className="rounded-md"
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </Col>

                    <Col xs={24} lg={10}>
                        <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-lg border-2 border-gray-200 p-4  h-full">
                            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
                                <div className="w-1 h-4 bg-indigo-500 rounded-full"></div>
                                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                    Product Image
                                </h3>
                            </div>
                            <ProductImageUpload
                                imageUrl={imageUrl}
                                onChange={onImageChange}
                            />
                        </div>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default ProductModal;
