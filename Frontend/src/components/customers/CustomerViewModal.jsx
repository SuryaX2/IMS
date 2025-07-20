import React from "react";
import {
    Modal,
    Button,
    Avatar,
    Descriptions,
    Tag,
    Space,
    Typography,
} from "antd";
import {
    UserOutlined,
    EditOutlined,
    MailOutlined,
    PhoneOutlined,
    HomeOutlined,
    ShopOutlined,
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

    return (
        <Modal
            title={
                <div className="flex items-center space-x-3">
                    <Avatar
                        size={70}
                        src={
                            customer.photo !== "default-customer.png"
                                ? customer.photo
                                : null
                        }
                        icon={<UserOutlined />}
                    />
                    <div>
                        <Title level={4} className="m-0">
                            Customer Details
                        </Title>
                        <Text type="secondary" className="text-sm">
                            {customer.name}
                        </Text>
                    </div>
                </div>
            }
            open={visible}
            onCancel={onCancel}
            footer={[
                <Button
                    key="edit"
                    type="primary"
                    onClick={() => {
                        onCancel();
                        onEdit(customer);
                    }}
                >
                    <EditOutlined /> Edit Customer
                </Button>,
                <Button key="close" onClick={onCancel}>
                    Close
                </Button>,
            ]}
            width={700}
        >
            <Descriptions bordered column={2} size="middle" className="mt-4">
                <Descriptions.Item label="Name" span={2}>
                    <Text strong>{customer.name}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                    <Space>
                        <MailOutlined className="text-blue-500" />
                        {customer.email}
                    </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Phone">
                    <Space>
                        <PhoneOutlined className="text-green-500" />
                        {customer.phone}
                    </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Customer Type">
                    <Tag color={getTypeColor(customer.type)}>
                        {customer.type?.toUpperCase()}
                    </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Address" span={2}>
                    {customer.address ? (
                        <Space>
                            <HomeOutlined className="text-purple-500" />
                            {customer.address}
                        </Space>
                    ) : (
                        <Text type="secondary">Not provided</Text>
                    )}
                </Descriptions.Item>
                <Descriptions.Item label="Store Name">
                    {customer.store_name ? (
                        <Space>
                            <ShopOutlined className="text-orange-500" />
                            {customer.store_name}
                        </Space>
                    ) : (
                        <Text type="secondary">Not provided</Text>
                    )}
                </Descriptions.Item>
                <Descriptions.Item label="Account Holder">
                    {customer.account_holder || (
                        <Text type="secondary">Not provided</Text>
                    )}
                </Descriptions.Item>
                <Descriptions.Item label="Account Number" span={2}>
                    {customer.account_number || (
                        <Text type="secondary">Not provided</Text>
                    )}
                </Descriptions.Item>
            </Descriptions>
        </Modal>
    );
};

export default CustomerViewModal;
