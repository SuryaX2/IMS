import React from "react";
import {
    Modal,
    Button,
    Avatar,
    Tag,
    Space,
    Typography,
    Row,
    Col,
    Divider,
} from "antd";
import {
    UserOutlined,
    EditOutlined,
    MailOutlined,
    PhoneOutlined,
    HomeOutlined,
    ShopOutlined,
    BankOutlined,
    IdcardOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const CustomerViewModal = ({ visible, onCancel, customer, onEdit }) => {
    if (!customer) return null;

    const getTypeColor = (type) => {
        const colors = {
            regular: "blue",
            wholesale: "green",
            retail: "orange",
        };
        return colors[type] || "blue";
    };

    const InfoItem = ({ icon, label, value, copyable = false }) => {
        if (!value) return null;

        return (
            <div className="flex items-start space-x-3 py-3">
                <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        {React.cloneElement(icon, {
                            className: "text-sm text-gray-600",
                        })}
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-500 mb-1">
                        {label}
                    </div>
                    <div className="text-base text-gray-900">
                        <Text copyable={copyable ? { text: value } : false}>
                            {value}
                        </Text>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Modal
            title={null}
            open={visible}
            onCancel={onCancel}
            footer={
                <div className="flex justify-end space-x-3 pt-4 border-t">
                    <Button size="large" onClick={onCancel}>
                        Close
                    </Button>
                    <Button
                        type="primary"
                        size="large"
                        icon={<EditOutlined />}
                        onClick={() => {
                            onCancel();
                            onEdit(customer);
                        }}
                        className="min-w-32"
                    >
                        Edit Customer
                    </Button>
                </div>
            }
            width={700}
            className="customer-view-modal"
        >
            <div className="px-6 py-6">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <Avatar
                        size={120}
                        src={
                            customer.photo !== "default-customer.png"
                                ? customer.photo
                                : null
                        }
                        icon={<UserOutlined />}
                        className="shadow-lg mb-4 border-4 border-white"
                        style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
                    />
                    <Title level={2} className="mb-2 text-gray-900">
                        {customer.name}
                    </Title>
                    <Tag
                        color={getTypeColor(customer.type)}
                        className="text-sm px-4 py-1 rounded-full font-medium"
                    >
                        {customer.type?.toUpperCase()} CUSTOMER
                    </Tag>
                </div>

                <Row gutter={[32, 0]}>
                    {/* Contact Information */}
                    <Col xs={24} md={12}>
                        <div className="mb-6">
                            <Title
                                level={4}
                                className="text-gray-800 mb-4 flex items-center"
                            >
                                <MailOutlined className="mr-2 text-blue-600" />
                                Contact Details
                            </Title>
                            <div className="space-y-2">
                                <InfoItem
                                    icon={<MailOutlined />}
                                    label="Email Address"
                                    value={customer.email}
                                    copyable
                                />
                                <InfoItem
                                    icon={<PhoneOutlined />}
                                    label="Phone Number"
                                    value={customer.phone}
                                    copyable
                                />
                                <InfoItem
                                    icon={<HomeOutlined />}
                                    label="Address"
                                    value={customer.address}
                                />
                            </div>
                        </div>
                    </Col>

                    {/* Business Information */}
                    <Col xs={24} md={12}>
                        {(customer.store_name ||
                            customer.account_holder ||
                            customer.account_number) && (
                            <div className="mb-6">
                                <Title
                                    level={4}
                                    className="text-gray-800 mb-4 flex items-center"
                                >
                                    <ShopOutlined className="mr-2 text-purple-600" />
                                    Business Details
                                </Title>
                                <div className="space-y-2">
                                    <InfoItem
                                        icon={<ShopOutlined />}
                                        label="Store Name"
                                        value={customer.store_name}
                                    />
                                    <InfoItem
                                        icon={<IdcardOutlined />}
                                        label="Account Holder"
                                        value={customer.account_holder}
                                    />
                                    <InfoItem
                                        icon={<BankOutlined />}
                                        label="Account Number"
                                        value={customer.account_number}
                                        copyable
                                    />
                                </div>
                            </div>
                        )}

                        {!customer.store_name &&
                            !customer.account_holder &&
                            !customer.account_number && (
                                <div className="text-center py-8">
                                    <div className="text-gray-400 mb-2">
                                        <ShopOutlined className="text-3xl" />
                                    </div>
                                    <Text className="text-gray-500">
                                        No business information available
                                    </Text>
                                </div>
                            )}
                    </Col>
                </Row>
            </div>

            <style jsx>{`
                .customer-view-modal .ant-modal-body {
                    padding: 0;
                }
                .customer-view-modal .ant-modal-footer {
                    border-top: none;
                    padding: 0 24px 24px 24px;
                }
            `}</style>
        </Modal>
    );
};

export default CustomerViewModal;
