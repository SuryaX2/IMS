import { Modal, Form, Row, Col, Select, Input, Button, Divider } from "antd";
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
            title={
                <div className="text-xl text-center uppercase tracking-wider font-bold text-gray-900">
                    Create New Order
                </div>
            }
            open={visible}
            onCancel={onCancel}
            footer={null}
            width={800}
            centered
            destroyOnClose
            className="create-order-modal"
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onSubmit}
                className="mt-6"
            >
                <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                        Order Information
                    </h4>
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="customer_id"
                                label={
                                    <span className="font-medium text-gray-700">
                                        Customer
                                    </span>
                                }
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
                                    className="w-full"
                                    size="large"
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
                                label={
                                    <span className="font-medium text-gray-700">
                                        Invoice Number
                                    </span>
                                }
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter invoice number",
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="INV-XXXX"
                                    maxLength={10}
                                    size="large"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="order_status"
                        label={
                            <span className="font-medium text-gray-700">
                                Order Status
                            </span>
                        }
                        initialValue="pending"
                    >
                        <Select size="large">
                            <Option value="pending">Pending</Option>
                            <Option value="processing">Processing</Option>
                            <Option value="completed">Completed</Option>
                        </Select>
                    </Form.Item>
                </div>

                <Divider className="my-6" />

                <Form.List name="orderItems" initialValue={[{}]}>
                    {(fields, { add, remove }) => (
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                    Order Items
                                </h4>
                                <Button
                                    type="primary"
                                    onClick={() => add()}
                                    icon={<PlusOutlined />}
                                    size="middle"
                                    className="font-medium"
                                >
                                    Add Item
                                </Button>
                            </div>
                            <div className="space-y-4">
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
                        </div>
                    )}
                </Form.List>

                <Divider className="my-6" />

                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
                    <Button
                        onClick={onCancel}
                        size="large"
                        className="w-full sm:w-auto min-w-[120px]"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        className="w-full sm:w-auto min-w-[120px] font-medium"
                    >
                        Create Order
                    </Button>
                </div>
            </Form>

            <style jsx>{`
                .create-order-modal :global(.ant-modal-header) {
                    border-bottom: 1px solid #f0f0f0;
                    padding: 20px 24px;
                }

                .create-order-modal :global(.ant-modal-body) {
                    padding: 24px;
                    max-height: calc(100vh - 200px);
                    overflow-y: auto;
                }

                .create-order-modal :global(.ant-form-item-label > label) {
                    font-size: 14px;
                }

                @media (max-width: 640px) {
                    .create-order-modal :global(.ant-modal) {
                        max-width: calc(100vw - 32px);
                        margin: 16px;
                    }

                    .create-order-modal :global(.ant-modal-body) {
                        padding: 16px;
                        max-height: calc(100vh - 150px);
                    }
                }
            `}</style>
        </Modal>
    );
};

export default CreateOrderModal;
