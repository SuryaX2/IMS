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
    Card,
    Tag,
} from "antd";
import {
    PlusOutlined,
    MinusCircleOutlined,
    ShoppingCartOutlined,
} from "@ant-design/icons";

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
    // Build a lookup map for quick access to product details
    const productMap = React.useMemo(() => {
        const map = {};
        products.forEach((p) => {
            map[p._id] = p;
        });
        return map;
    }, [products]);

    const handleProductChange = (productId, fieldName) => {
        const product = productMap[productId];
        if (!product) return;

        // Auto-fill the unit cost with the product's buying price
        const details = form.getFieldValue("details");
        if (!details) return;
        details[fieldName] = {
            ...details[fieldName],
            product_id: productId,
            unitcost: product.buying_price,
        };
        form.setFieldsValue({ details });
    };

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
            title={
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg">
                        <ShoppingCartOutlined className="text-blue-600" />
                    </div>
                    <span className="text-lg font-semibold">
                        Add New Purchase
                    </span>
                </div>
            }
            open={visible}
            onCancel={onCancel}
            footer={null}
            width={950}
            className="purchase-form-modal"
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={initialValues}
                className="mt-2"
            >
                <Card className="mb-1 bg-gray-50 border-0">
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12}>
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
                                <Input
                                    placeholder="Enter purchase number"
                                    size="large"
                                    className="rounded-lg"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
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
                                <Select
                                    placeholder="Select supplier"
                                    size="large"
                                    className="rounded-lg"
                                    showSearch
                                    optionFilterProp="children"
                                >
                                    {suppliers.map((supplier) => (
                                        <Option
                                            key={supplier._id}
                                            value={supplier._id}
                                        >
                                            {supplier.name} ({supplier.shopname}
                                            )
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24}>
                            <Form.Item
                                label="Purchase Status"
                                name="purchase_status"
                            >
                                <Select
                                    placeholder="Select status"
                                    size="large"
                                    className="rounded-lg"
                                >
                                    <Option value="pending">Pending</Option>
                                    <Option value="completed">Completed</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>

                <Divider orientation="left">
                    <span className="text-lg font-medium text-gray-700">
                        Purchase Details
                    </span>
                </Divider>

                <Form.List name="details">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => {
                                // Watch the selected product for this row to show stock info
                                const selectedProductId = form.getFieldValue([
                                    "details",
                                    name,
                                    "product_id",
                                ]);
                                const selectedProduct =
                                    productMap[selectedProductId];

                                return (
                                    <Card
                                        key={key}
                                        className="mb-4 border border-gray-200 shadow-sm"
                                    >
                                        <Row gutter={[16, 16]} align="middle">
                                            <Col xs={24} sm={8}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, "product_id"]}
                                                    label="Product"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Select product",
                                                        },
                                                    ]}
                                                >
                                                    <Select
                                                        placeholder="Select product"
                                                        showSearch
                                                        optionFilterProp="label"
                                                        className="rounded-lg"
                                                        onChange={(val) =>
                                                            handleProductChange(
                                                                val,
                                                                name
                                                            )
                                                        }
                                                        options={products.map(
                                                            (product) => ({
                                                                value: product._id,
                                                                label: `${product.product_name} (${product.product_code})`,
                                                            })
                                                        )}
                                                    />
                                                </Form.Item>
                                                {/* Show current stock below the select */}
                                                {selectedProduct && (
                                                    <div className="mt-1 mb-2">
                                                        <Tag
                                                            color={
                                                                selectedProduct.stock ===
                                                                0
                                                                    ? "red"
                                                                    : selectedProduct.stock <
                                                                        10
                                                                      ? "orange"
                                                                      : "green"
                                                            }
                                                        >
                                                            Current Stock:{" "}
                                                            {
                                                                selectedProduct.stock
                                                            }
                                                        </Tag>
                                                    </div>
                                                )}
                                            </Col>
                                            <Col xs={24} sm={6}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, "quantity"]}
                                                    label="Quantity"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Enter quantity",
                                                        },
                                                    ]}
                                                >
                                                    <InputNumber
                                                        placeholder="Quantity"
                                                        min={1}
                                                        style={{
                                                            width: "100%",
                                                        }}
                                                        className="rounded-lg"
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} sm={7}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, "unitcost"]}
                                                    label="Unit Cost"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Enter unit cost",
                                                        },
                                                    ]}
                                                >
                                                    <InputNumber
                                                        placeholder="Unit Cost"
                                                        min={0}
                                                        precision={2}
                                                        style={{
                                                            width: "100%",
                                                        }}
                                                        prefix="₹"
                                                        className="rounded-lg"
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} sm={3}>
                                                <Form.Item label=" ">
                                                    <Button
                                                        type="default"
                                                        onClick={() =>
                                                            remove(name)
                                                        }
                                                        icon={
                                                            <MinusCircleOutlined />
                                                        }
                                                        danger
                                                        className="w-full"
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Card>
                                );
                            })}
                            <Form.Item>
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    block
                                    icon={<PlusOutlined />}
                                    size="large"
                                    className="h-12 border-2 border-dashed border-blue-300 text-blue-600 hover:border-blue-400 hover:text-blue-700 rounded-lg"
                                >
                                    Add Product
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>

                <Form.Item className="mb-0 pt-4">
                    <Row justify="end">
                        <Space size="large">
                            <Button
                                onClick={onCancel}
                                size="large"
                                className="px-8"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                className="px-8 bg-gradient-to-r from-blue-500 to-blue-600 border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                Create Purchase
                            </Button>
                        </Space>
                    </Row>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default PurchaseForm;
