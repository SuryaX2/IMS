import React from "react";
import {
    Modal,
    Form,
    Input,
    Upload,
    Button,
    Space,
    Row,
    Col,
    Select,
    Divider,
} from "antd";
import {
    UserOutlined,
    ShopOutlined,
    PhoneOutlined,
    MailOutlined,
    BankOutlined,
    UploadOutlined,
} from "@ant-design/icons";

const { Option } = Select;

const SupplierForm = ({
    visible,
    onCancel,
    onSubmit,
    form,
    editMode,
    fileList,
    uploadProps,
}) => {
    return (
        <Modal
            title={editMode ? "Edit Supplier" : "Add New Supplier"}
            open={visible}
            onCancel={onCancel}
            footer={null}
            width={800}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onSubmit}
                autoComplete="off"
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="name"
                            label="Supplier Name"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter supplier name",
                                },
                                {
                                    max: 50,
                                    message:
                                        "Name must be less than 50 characters",
                                },
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined />}
                                placeholder="Enter supplier name"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter email",
                                },
                                {
                                    type: "email",
                                    message: "Please enter valid email",
                                },
                                {
                                    max: 50,
                                    message:
                                        "Email must be less than 50 characters",
                                },
                            ]}
                        >
                            <Input
                                prefix={<MailOutlined />}
                                placeholder="Enter email"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="phone"
                            label="Phone"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter phone number",
                                },
                                {
                                    max: 15,
                                    message:
                                        "Phone must be less than 15 characters",
                                },
                            ]}
                        >
                            <Input
                                prefix={<PhoneOutlined />}
                                placeholder="Enter phone number"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="type" label="Supplier Type">
                            <Select placeholder="Select supplier type">
                                <Option value="individual">Individual</Option>
                                <Option value="wholesale">Wholesale</Option>
                                <Option value="retail">Retail</Option>
                                <Option value="company">Company</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="shopname"
                            label="Shop Name"
                            rules={[
                                {
                                    max: 50,
                                    message:
                                        "Shop name must be less than 50 characters",
                                },
                            ]}
                        >
                            <Input
                                prefix={<ShopOutlined />}
                                placeholder="Enter shop name"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="address"
                            label="Address"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter address",
                                },
                                {
                                    max: 100,
                                    message:
                                        "Address must be less than 100 characters",
                                },
                            ]}
                        >
                            <Input placeholder="Enter address" />
                        </Form.Item>
                    </Col>
                </Row>

                <Divider>Banking Information (Optional)</Divider>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="bank_name"
                            label="Bank Name"
                            rules={[
                                {
                                    max: 50,
                                    message:
                                        "Bank name must be less than 50 characters",
                                },
                            ]}
                        >
                            <Input
                                prefix={<BankOutlined />}
                                placeholder="Enter bank name"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="account_holder"
                            label="Account Holder"
                            rules={[
                                {
                                    max: 50,
                                    message:
                                        "Account holder must be less than 50 characters",
                                },
                            ]}
                        >
                            <Input placeholder="Enter account holder name" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="account_number"
                            label="Account Number"
                            rules={[
                                {
                                    max: 50,
                                    message:
                                        "Account number must be less than 50 characters",
                                },
                            ]}
                        >
                            <Input placeholder="Enter account number" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="photo" label="Supplier Photo">
                            <Upload {...uploadProps} maxCount={1}>
                                <Button icon={<UploadOutlined />}>
                                    Upload Photo
                                </Button>
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item className="mb-0 mt-4">
                    <Space className="w-full justify-end">
                        <Button onClick={onCancel}>Cancel</Button>
                        <Button type="primary" htmlType="submit">
                            {editMode ? "Update Supplier" : "Create Supplier"}
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default SupplierForm;
