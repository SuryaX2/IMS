import React from "react";
import { Table, Button, Space, Popconfirm, Avatar, Tag, Empty, Tooltip, Card } from "antd";
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
    // Mobile card view for small screens
    const MobileCustomerCard = ({ customer }) => (
        <Card
            className="mb-4 shadow-sm hover:shadow-md transition-shadow"
            bodyStyle={{ padding: '16px' }}
        >
            <div className="flex items-start space-x-3">
                <Avatar
                    size={56}
                    src={customer.photo !== "default-customer.png" ? customer.photo : null}
                    icon={<UserOutlined />}
                    className="shadow-sm flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                        <div className="min-w-0 flex-1">
                            <Text strong className="text-base text-gray-900 block truncate">
                                {customer.name}
                            </Text>
                            <Tag 
                                color={
                                    customer.type === 'regular' ? 'blue' :
                                    customer.type === 'wholesale' ? 'green' : 'orange'
                                } 
                                size="small"
                                className="mt-1"
                            >
                                {customer.type?.toUpperCase()}
                            </Tag>
                        </div>
                        <Space size="small">
                            <Button
                                type="text"
                                icon={<EyeOutlined />}
                                size="small"
                                onClick={() => onView(customer)}
                                className="text-blue-600"
                            />
                            <Button
                                type="text"
                                icon={<EditOutlined />}
                                size="small"
                                onClick={() => onEdit(customer)}
                                className="text-green-600"
                            />
                            <Popconfirm
                                title="Delete Customer"
                                description="Are you sure?"
                                onConfirm={() => onDelete(customer._id)}
                                okText="Delete"
                                cancelText="Cancel"
                                okButtonProps={{ danger: true }}
                            >
                                <Button
                                    type="text"
                                    icon={<DeleteOutlined />}
                                    size="small"
                                    className="text-red-600"
                                />
                            </Popconfirm>
                        </Space>
                    </div>
                    
                    <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                            <MailOutlined className="mr-2 text-blue-500 flex-shrink-0" />
                            <span className="truncate">{customer.email}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                            <PhoneOutlined className="mr-2 text-green-500 flex-shrink-0" />
                            <span>{customer.phone}</span>
                        </div>
                        {customer.address && (
                            <div className="flex items-start text-sm text-gray-600">
                                <HomeOutlined className="mr-2 mt-0.5 text-purple-500 flex-shrink-0" />
                                <span className="truncate">{customer.address}</span>
                            </div>
                        )}
                        {customer.store_name && (
                            <div className="flex items-center text-sm text-gray-600">
                                <ShopOutlined className="mr-2 text-orange-500 flex-shrink-0" />
                                <span className="truncate">{customer.store_name}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );

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
                        className="shadow-sm"
                    />
                    <div className="min-w-0 flex-1">
                        <Text strong className="block text-gray-900 text-sm">
                            {record.name}
                        </Text>
                        <Tag 
                            color={
                                record.type === 'regular' ? 'blue' :
                                record.type === 'wholesale' ? 'green' : 'orange'
                            } 
                            size="small"
                            className="mt-1"
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
                    <div className="flex items-center text-sm text-gray-700">
                        <MailOutlined className="mr-2 text-blue-500" />
                        <Tooltip title={record.email}>
                            <span className="truncate max-w-[180px]">
                                {record.email}
                            </span>
                        </Tooltip>
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
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
                        <div className="flex items-start text-sm text-gray-700">
                            <HomeOutlined className="mr-2 mt-0.5 text-purple-500 flex-shrink-0" />
                            <Tooltip title={record.address}>
                                <span className="truncate max-w-[160px] leading-5">
                                    {record.address}
                                </span>
                            </Tooltip>
                        </div>
                    )}
                    {record.store_name && (
                        <div className="flex items-center text-sm text-gray-700">
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
                        description="Are you sure you want to delete this customer?"
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

    if (loading) {
        return (
            <>
                {/* Mobile loading cards */}
                <div className="block md:hidden space-y-4">
                    {[1, 2, 3].map(i => (
                        <Card key={i} loading className="shadow-sm" />
                    ))}
                </div>
                {/* Desktop loading table */}
                <div className="hidden md:block">
                    <Table
                        columns={columns}
                        dataSource={[]}
                        loading={true}
                        pagination={false}
                    />
                </div>
            </>
        );
    }

    if (customers.length === 0) {
        return (
            <div className="text-center py-12">
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                        <div className="text-gray-500">
                            <div className="text-base mb-1">No customers found</div>
                            <div className="text-sm">Add your first customer to get started</div>
                        </div>
                    }
                />
            </div>
        );
    }

    return (
        <>
            {/* Mobile View */}
            <div className="block md:hidden">
                <div className="space-y-0">
                    {customers.map(customer => (
                        <MobileCustomerCard key={customer._id} customer={customer} />
                    ))}
                </div>
                {customers.length > 10 && (
                    <div className="text-center mt-4 pt-4 border-t text-sm text-gray-500">
                        Showing {Math.min(10, customers.length)} of {customers.length} customers
                    </div>
                )}
            </div>

            {/* Desktop View */}
            <div className="hidden md:block">
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
                />
            </div>

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
        </>
    );
};

export default CustomerTable;