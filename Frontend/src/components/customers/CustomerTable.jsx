import React from "react";
import { Table, Button, Space, Popconfirm, Avatar, Tag, Empty } from "antd";
import {
    EditOutlined,
    DeleteOutlined,
    UserOutlined,
    EyeOutlined,
    MailOutlined,
    PhoneOutlined,
    HomeOutlined,
    ShopOutlined,
} from "@ant-design/icons";
import { Typography } from "antd";

const { Text } = Typography;

const CustomerTable = ({ customers, loading, onEdit, onView, onDelete }) => {
    const columns = [
        {
            title: "Photo",
            dataIndex: "photo",
            key: "photo",
            width: 80,
            render: (photo) => (
                <Avatar
                    size={48}
                    src={photo !== "default-customer.png" ? photo : null}
                    icon={<UserOutlined />}
                />
            ),
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            width: 150,
            sorter: (a, b) => a.name.localeCompare(b.name),
            render: (name) => (
                <Text strong style={{ fontSize: "14px" }}>
                    {name}
                </Text>
            ),
        },
        {
            title: "Contact",
            key: "contact",
            width: 200,
            render: (_, record) => (
                <div className="space-y-1">
                    <div className="flex items-center text-xs text-gray-600">
                        <MailOutlined className="mr-1" />
                        <span
                            className="truncate max-w-[140px]"
                            title={record.email}
                        >
                            {record.email}
                        </span>
                    </div>
                    <div className="flex items-center text-xs text-gray-600">
                        <PhoneOutlined className="mr-1" />
                        <span>{record.phone}</span>
                    </div>
                </div>
            ),
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            width: 100,
            render: (type) => {
                const colors = {
                    regular: "blue",
                    wholesale: "green",
                    retail: "orange",
                };
                return (
                    <Tag color={colors[type] || "default"} className="text-xs">
                        {type?.toUpperCase()}
                    </Tag>
                );
            },
            filters: [
                { text: "Regular", value: "regular" },
                { text: "Wholesale", value: "wholesale" },
                { text: "Retail", value: "retail" },
            ],
            onFilter: (value, record) => record.type === value,
        },
        {
            title: "Location",
            key: "location",
            width: 180,
            render: (_, record) => (
                <div className="space-y-1">
                    {record.address && (
                        <div className="flex items-center text-xs text-gray-600">
                            <HomeOutlined className="mr-1 flex-shrink-0" />
                            <span
                                className="truncate max-w-[130px]"
                                title={record.address}
                            >
                                {record.address}
                            </span>
                        </div>
                    )}
                    {record.store_name && (
                        <div className="flex items-center text-xs text-gray-600">
                            <ShopOutlined className="mr-1 flex-shrink-0" />
                            <span
                                className="truncate max-w-[130px]"
                                title={record.store_name}
                            >
                                {record.store_name}
                            </span>
                        </div>
                    )}
                    {!record.address && !record.store_name && (
                        <span className="text-gray-400 text-xs">-</span>
                    )}
                </div>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            width: 150,
            fixed: "right",
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="default"
                        icon={<EyeOutlined />}
                        size="small"
                        onClick={() => onView(record)}
                        title="View Details"
                    />
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => onEdit(record)}
                        title="Edit Customer"
                    />
                    <Popconfirm
                        title="Are you sure you want to delete this customer?"
                        onConfirm={() => onDelete(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                            title="Delete Customer"
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={customers}
            rowKey="_id"
            loading={loading}
            scroll={{ x: 800 }}
            pagination={{
                total: customers.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} customers`,
            }}
            locale={{
                emptyText: (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="No customers found"
                    />
                ),
            }}
        />
    );
};

export default CustomerTable;
