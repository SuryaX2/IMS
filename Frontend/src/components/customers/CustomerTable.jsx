import React from "react";
import { Table, Button, Space, Popconfirm, Avatar, Tag, Empty, Tooltip } from "antd";
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
            title: "Customer",
            key: "customer",
            width: 200,
            render: (_, record) => (
                <div className="flex items-center space-x-3">
                    <Avatar
                        size={48}
                        src={record.photo !== "default-customer.png" ? record.photo : null}
                        icon={<UserOutlined />}
                        className="shadow-md"
                    />
                    <div className="min-w-0 flex-1">
                        <Text strong className="block text-gray-800 text-sm">
                            {record.name}
                        </Text>
                        <Tag 
                            color={
                                record.type === 'regular' ? 'blue' :
                                record.type === 'wholesale' ? 'green' : 'orange'
                            } 
                            className="text-xs mt-1"
                        >
                            {record.type?.toUpperCase()}
                        </Tag>
                    </div>
                </div>
            ),
        },
        {
            title: "Contact Information",
            key: "contact",
            width: 250,
            responsive: ['md'],
            render: (_, record) => (
                <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                        <MailOutlined className="mr-2 text-blue-500" />
                        <Tooltip title={record.email}>
                            <span className="truncate max-w-[180px]">
                                {record.email}
                            </span>
                        </Tooltip>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        <PhoneOutlined className="mr-2 text-green-500" />
                        <span>{record.phone}</span>
                    </div>
                </div>
            ),
        },
        {
            title: "Location Details",
            key: "location",
            width: 220,
            responsive: ['lg'],
            render: (_, record) => (
                <div className="space-y-2">
                    {record.address && (
                        <div className="flex items-start text-sm text-gray-600">
                            <HomeOutlined className="mr-2 mt-0.5 text-purple-500 flex-shrink-0" />
                            <Tooltip title={record.address}>
                                <span className="truncate max-w-[160px] leading-5">
                                    {record.address}
                                </span>
                            </Tooltip>
                        </div>
                    )}
                    {record.store_name && (
                        <div className="flex items-center text-sm text-gray-600">
                            <ShopOutlined className="mr-2 text-orange-500 flex-shrink-0" />
                            <Tooltip title={record.store_name}>
                                <span className="truncate max-w-[160px]">
                                    {record.store_name}
                                </span>
                            </Tooltip>
                        </div>
                    )}
                    {!record.address && !record.store_name && (
                        <span className="text-gray-400 text-sm italic">No location data</span>
                    )}
                </div>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            width: 130,
            fixed: "right",
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="View Details">
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            size="small"
                            onClick={() => onView(record)}
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        />
                    </Tooltip>
                    <Tooltip title="Edit Customer">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            size="small"
                            onClick={() => onEdit(record)}
                            className="text-green-600 hover:text-green-800 hover:bg-green-50"
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Delete Customer"
                        description="Are you sure you want to delete this customer? This action cannot be undone."
                        onConfirm={() => onDelete(record._id)}
                        okText="Delete"
                        cancelText="Cancel"
                        okButtonProps={{ danger: true }}
                    >
                        <Tooltip title="Delete Customer">
                            <Button
                                type="text"
                                icon={<DeleteOutlined />}
                                size="small"
                                className="text-red-600 hover:text-red-800 hover:bg-red-50"
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="overflow-hidden">
            <Table
                columns={columns}
                dataSource={customers}
                rowKey="_id"
                loading={loading}
                scroll={{ x: 800 }}
                rowClassName="hover:bg-gray-50 transition-colors"
                className="custom-table"
                pagination={{
                    total: customers.length,
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                        `Showing ${range[0]}-${range[1]} of ${total} customers`,
                    pageSizeOptions: ['10', '25', '50'],
                }}
                locale={{
                    emptyText: (
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={
                                <span className="text-gray-500">
                                    No customers found
                                    <br />
                                    <span className="text-sm">Add your first customer to get started</span>
                                </span>
                            }
                        />
                    ),
                }}
            />
            <style jsx>{`
                .custom-table .ant-table-thead > tr > th {
                    background: #fafafa;
                    font-weight: 600;
                    color: #262626;
                    border-bottom: 2px solid #f0f0f0;
                }
                .custom-table .ant-table-tbody > tr:hover > td {
                    background: #f8faff !important;
                }
            `}</style>
        </div>
    );
};

export default CustomerTable;