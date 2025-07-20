import React from "react";
import {
    Form,
    Input,
    Select,
    Upload,
    Row,
    Col,
    Button,
    Space,
    Divider,
} from "antd";
import {
    UploadOutlined,
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    ShopOutlined,
} from "@ant-design/icons";

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
        className: "avatar-uploader",
    };

    return (
        <div className="p-6 bg-gray-50 min-h-full">
            <Form
                form={form}
                layout="vertical"
                onFinish={onSubmit}
                className="bg-white p-6 rounded-lg shadow-sm"
                scrollToFirstError
            >
                {/* Personal Information Section */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <UserOutlined className="mr-2 text-blue-600" />
                        Personal Information
                    </h3>

                    <Row gutter={[16, 0]}>
                        <Col xs={24} sm={12}>
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
                                        message:
                                            "Name cannot exceed 50 characters",
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="Enter full name"
                                    size="large"
                                    prefix={
                                        <UserOutlined className="text-gray-400" />
                                    }
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Customer Type"
                                name="type"
                                initialValue="regular"
                            >
                                <Select
                                    placeholder="Select customer type"
                                    size="large"
                                >
                                    <Option value="regular">
                                        Regular Customer
                                    </Option>
                                    <Option value="wholesale">
                                        Wholesale Customer
                                    </Option>
                                    <Option value="retail">
                                        Retail Customer
                                    </Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </div>

                <Divider />

                {/* Contact Information Section */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <PhoneOutlined className="mr-2 text-green-600" />
                        Contact Information
                    </h3>

                    <Row gutter={[16, 0]}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Email Address"
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter email address",
                                    },
                                    {
                                        type: "email",
                                        message:
                                            "Please enter a valid email address",
                                    },
                                    {
                                        max: 50,
                                        message:
                                            "Email cannot exceed 50 characters",
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="customer@example.com"
                                    size="large"
                                    prefix={
                                        <MailOutlined className="text-gray-400" />
                                    }
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Phone Number"
                                name="phone"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter phone number",
                                    },
                                    {
                                        max: 15,
                                        message:
                                            "Phone cannot exceed 15 characters",
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="Enter phone number"
                                    size="large"
                                    prefix={
                                        <PhoneOutlined className="text-gray-400" />
                                    }
                                />
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
                        <TextArea
                            placeholder="Enter complete address"
                            rows={3}
                            size="large"
                        />
                    </Form.Item>
                </div>

                <Divider />

                {/* Business Information Section */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <ShopOutlined className="mr-2 text-purple-600" />
                        Business Information
                        <span className="text-sm font-normal text-gray-500 ml-2">
                            (Optional)
                        </span>
                    </h3>

                    <Row gutter={[16, 0]}>
                        <Col xs={24} sm={12}>
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
                                <Input
                                    placeholder="Enter store/business name"
                                    size="large"
                                    prefix={
                                        <ShopOutlined className="text-gray-400" />
                                    }
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
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
                                <Input
                                    placeholder="Enter account holder name"
                                    size="large"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label="Account Number"
                        name="account_number"
                        rules={[
                            {
                                max: 50,
                                message:
                                    "Account number cannot exceed 50 characters",
                            },
                        ]}
                    >
                        <Input
                            placeholder="Enter account number"
                            size="large"
                        />
                    </Form.Item>
                </div>

                <Divider />

                {/* Photo Upload Section */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Customer Photo
                    </h3>

                    <Form.Item label="">
                        <Upload {...uploadProps}>
                            {fileList.length === 0 && (
                                <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors">
                                    <UploadOutlined className="text-2xl text-gray-400 mb-2" />
                                    <div className="text-gray-600">
                                        Upload Photo
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">
                                        JPG, PNG up to 5MB
                                    </div>
                                </div>
                            )}
                        </Upload>
                    </Form.Item>
                </div>

                {/* Form Actions */}
                <Form.Item className="mb-0 text-right bg-gray-50 -mx-6 -mb-6 px-6 py-4 rounded-b-lg">
                    <Space size="middle">
                        <Button
                            size="large"
                            onClick={onCancel}
                            className="min-w-20"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            size="large"
                            className="min-w-28"
                        >
                            {editingCustomer
                                ? "Update Customer"
                                : "Add Customer"}
                        </Button>
                    </Space>
                </Form.Item>
            </Form>

            <style jsx>{`
                .avatar-uploader .ant-upload-select {
                    width: 120px !important;
                    height: 120px !important;
                }
                .ant-form-item-label > label {
                    font-weight: 600;
                    color: #262626;
                }
            `}</style>
        </div>
    );
};

export default CustomerForm;
