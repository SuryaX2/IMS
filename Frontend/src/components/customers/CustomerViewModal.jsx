import React from "react";
import {
    Modal,
    Button,
    Avatar,
    Descriptions,
    Tag,
    Space,
    Typography,
    Card,
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
        return colors[type] || "default";
    };

    const getTypeGradient = (type) => {
        const gradients = {
            regular: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            wholesale: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
            retail: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
        };
        return (
            gradients[type] ||
            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        );
    };

    return (
        <Modal
            title={null}
            open={visible}
            onCancel={onCancel}
            footer={[
                <Button key="close" onClick={onCancel} size="large">
                    Close
                </Button>,
                <Button
                    key="edit"
                    type="primary"
                    onClick={() => {
                        onCancel();
                        onEdit(customer);
                    }}
                    size="large"
                    className="min-w-32"
                >
                    <EditOutlined /> Edit Customer
                </Button>,
            ]}
            width={800}
            className="customer-view-modal"
        >
            {/* Header Section */}
            <div
                className="p-6 mb-6 rounded-lg text-white"
                style={{ background: getTypeGradient(customer.type) }}
            >
                <div className="flex items-center space-x-4">
                    <Avatar
                        size={80}
                        src={
                            customer.photo !== "default-customer.png"
                                ? customer.photo
                                : null
                        }
                        icon={<UserOutlined />}
                        className="shadow-lg border-4 border-white"
                    />
                    <div className="flex-1">
                        <Title level={3} className="m-0 text-white">
                            {customer.name}
                        </Title>
                        <div className="mt-2">
                            <Tag
                                color="white"
                                className="text-gray-800 font-medium px-3 py-1"
                            >
                                {customer.type?.toUpperCase()} CUSTOMER
                            </Tag>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Information */}
            <Card
                title={
                    <span className="flex items-center text-gray-800">
                        <MailOutlined className="mr-2 text-blue-600" />
                        Contact Information
                    </span>
                }
                className="mb-6 shadow-sm"
                size="small"
            >
                <Descriptions column={{ xs: 1, sm: 2 }} size="middle">
                    <Descriptions.Item
                        label="Email Address"
                        labelStyle={{ fontWeight: 600, color: "#595959" }}
                    >
                        <Space>
                            <MailOutlined className="text-blue-500" />
                            <Text copyable={{ text: customer.email }}>
                                {customer.email}
                            </Text>
                        </Space>
                    </Descriptions.Item>
                    <Descriptions.Item
                        label="Phone Number"
                        labelStyle={{ fontWeight: 600, color: "#595959" }}
                    >
                        <Space>
                            <PhoneOutlined className="text-green-500" />
                            <Text copyable={{ text: customer.phone }}>
                                {customer.phone}
                            </Text>
                        </Space>
                    </Descriptions.Item>
                </Descriptions>

                {customer.address && (
                    <>
                        <Divider className="my-4" />
                        <Descriptions column={1} size="middle">
                            <Descriptions.Item
                                label="Address"
                                labelStyle={{
                                    fontWeight: 600,
                                    color: "#595959",
                                }}
                            >
                                <Space align="start">
                                    <HomeOutlined className="text-purple-500 mt-1" />
                                    <Text>{customer.address}</Text>
                                </Space>
                            </Descriptions.Item>
                        </Descriptions>
                    </>
                )}
            </Card>

            {/* Business Information */}
            {(customer.store_name ||
                customer.account_holder ||
                customer.account_number) && (
                <Card
                    title={
                        <span className="flex items-center text-gray-800">
                            <ShopOutlined className="mr-2 text-purple-600" />
                            Business Information
                        </span>
                    }
                    className="mb-6 shadow-sm"
                    size="small"
                >
                    <Descriptions column={{ xs: 1, sm: 2 }} size="middle">
                        {customer.store_name && (
                            <Descriptions.Item
                                label="Store Name"
                                labelStyle={{
                                    fontWeight: 600,
                                    color: "#595959",
                                }}
                            >
                                <Space>
                                    <ShopOutlined className="text-orange-500" />
                                    <Text>{customer.store_name}</Text>
                                </Space>
                            </Descriptions.Item>
                        )}
                        {customer.account_holder && (
                            <Descriptions.Item
                                label="Account Holder"
                                labelStyle={{
                                    fontWeight: 600,
                                    color: "#595959",
                                }}
                            >
                                <Space>
                                    <IdcardOutlined className="text-indigo-500" />
                                    <Text>{customer.account_holder}</Text>
                                </Space>
                            </Descriptions.Item>
                        )}
                    </Descriptions>

                    {customer.account_number && (
                        <>
                            <Divider className="my-4" />
                            <Descriptions column={1} size="middle">
                                <Descriptions.Item
                                    label="Account Number"
                                    labelStyle={{
                                        fontWeight: 600,
                                        color: "#595959",
                                    }}
                                >
                                    <Space>
                                        <BankOutlined className="text-green-600" />
                                        <Text
                                            copyable={{
                                                text: customer.account_number,
                                            }}
                                        >
                                            {customer.account_number}
                                        </Text>
                                    </Space>
                                </Descriptions.Item>
                            </Descriptions>
                        </>
                    )}
                </Card>
            )}

            <style jsx>{`
                .customer-view-modal .ant-modal-body {
                    padding: 0;
                }
                .customer-view-modal .ant-descriptions-item-label {
                    width: 120px;
                }
            `}</style>
        </Modal>
    );
};

export default CustomerViewModal;
