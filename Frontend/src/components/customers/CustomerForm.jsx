import React from "react";
import { Form, Input, Select, Upload, Row, Col, Button, Space } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;
const { TextArea } = Input;

const CustomerForm = ({
    form,
    onSubmit,
    onCancel,
    loading,
    fileList,
    setFileList,
    editingCustomer,
}) => {
    const uploadProps = {
        fileList,
        onChange: ({ fileList: newFileList }) => setFileList(newFileList),
        beforeUpload: () => false,
        maxCount: 1,
        accept: "image/*",
        listType: "picture-card",
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onSubmit}
            className="mt-4"
        >
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        label="Customer Name"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Please enter customer name",
                            },
                            {
                                max: 50,
                                message: "Name cannot exceed 50 characters",
                            },
                        ]}
                    >
                        <Input placeholder="Enter customer name" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: "Please enter email" },
                            {
                                type: "email",
                                message: "Please enter valid email",
                            },
                            {
                                max: 50,
                                message: "Email cannot exceed 50 characters",
                            },
                        ]}
                    >
                        <Input placeholder="Enter email address" />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        label="Phone"
                        name="phone"
                        rules={[
                            {
                                required: true,
                                message: "Please enter phone number",
                            },
                            {
                                max: 15,
                                message: "Phone cannot exceed 15 characters",
                            },
                        ]}
                    >
                        <Input placeholder="Enter phone number" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="Customer Type"
                        name="type"
                        initialValue="regular"
                    >
                        <Select placeholder="Select customer type">
                            <Option value="regular">Regular</Option>
                            <Option value="wholesale">Wholesale</Option>
                            <Option value="retail">Retail</Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item
                label="Address"
                name="address"
                rules={[
                    {
                        max: 100,
                        message: "Address cannot exceed 100 characters",
                    },
                ]}
            >
                <TextArea placeholder="Enter customer address" rows={3} />
            </Form.Item>

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        label="Store Name"
                        name="store_name"
                        rules={[
                            {
                                max: 50,
                                message:
                                    "Store name cannot exceed 50 characters",
                            },
                        ]}
                    >
                        <Input placeholder="Enter store name (optional)" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="Account Holder"
                        name="account_holder"
                        rules={[
                            {
                                max: 50,
                                message:
                                    "Account holder cannot exceed 50 characters",
                            },
                        ]}
                    >
                        <Input placeholder="Enter account holder name (optional)" />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item
                label="Account Number"
                name="account_number"
                rules={[
                    {
                        max: 50,
                        message: "Account number cannot exceed 50 characters",
                    },
                ]}
            >
                <Input placeholder="Enter account number (optional)" />
            </Form.Item>

            <Form.Item label="Customer Photo">
                <Upload {...uploadProps}>
                    {fileList.length === 0 && (
                        <div>
                            <UploadOutlined />
                            <div style={{ marginTop: 8 }}>Upload Photo</div>
                        </div>
                    )}
                </Upload>
            </Form.Item>

            <Form.Item className="mb-0 text-right">
                <Space>
                    <Button onClick={onCancel}>Cancel</Button>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        {editingCustomer ? "Update Customer" : "Add Customer"}
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );
};

export default CustomerForm;
