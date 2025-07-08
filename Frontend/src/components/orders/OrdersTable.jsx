import React from "react";
import { Table, Button, Select, Tag, Space, Tooltip, Card } from "antd";
import { EyeOutlined, FilePdfOutlined, UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { getStatusColor, ORDER_STATUSES } from "../../utils/orderHelpers";
import { getStatusIcon } from "../../data";

const { Option } = Select;

const OrdersTable = ({
    orders,
    loading,
    pagination,
    onTableChange,
    onViewDetails,
    onUpdateStatus,
    onGenerateInvoice,
}) => {
    const columns = [
        {
            title: "Invoice No",
            dataIndex: "invoice_no",
            key: "invoice_no",
            width: 130,
            render: (text) => (
                <span className="font-medium text-blue-600">
                    #{text}
                </span>
            ),
        },
        {
            title: "Customer",
            dataIndex: ["customer_id", "name"],
            key: "customer",
            width: 200,
            ellipsis: true,
            render: (text, record) => (
                <div className="flex items-center gap-2">
                    <UserOutlined className="text-gray-400" />
                    <span className="font-medium">
                        {record.customer_id?.name || "N/A"}
                    </span>
                </div>
            ),
        },
        {
            title: "Date",
            dataIndex: "order_date",
            key: "order_date",
            width: 120,
            render: (date) => (
                <span className="text-gray-600">
                    {dayjs(date).format("MMM DD, YYYY")}
                </span>
            ),
        },
        {
            title: "Status",
            dataIndex: "order_status",
            key: "order_status",
            width: 130,
            render: (status) => (
                <Tag
                    icon={getStatusIcon(status)}
                    color={getStatusColor(status)}
                    className="font-medium"
                >
                    {status.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: "Items",
            dataIndex: "total_products",
            key: "total_products",
            width: 80,
            align: "center",
            render: (count) => (
                <span className="font-medium">{count}</span>
            ),
        },
        {
            title: "Total",
            dataIndex: "total",
            key: "total",
            width: 100,
            align: "right",
            render: (amount) => (
                <span className="font-semibold text-green-600">
                    ${amount.toFixed(2)}
                </span>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            width: 180,
            align: "center",
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="View Details">
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            onClick={() => onViewDetails(record)}
                            className="text-blue-600 hover:text-blue-700"
                        />
                    </Tooltip>

                    <Select
                        value={record.order_status}
                        size="small"
                        style={{ width: 90 }}
                        onChange={(value) => onUpdateStatus(record._id, value)}
                    >
                        {ORDER_STATUSES.map((status) => (
                            <Option key={status.value} value={status.value}>
                                {status.label}
                            </Option>
                        ))}
                    </Select>

                    <Tooltip title="Download Invoice">
                        <Button
                            type="text"
                            icon={<FilePdfOutlined />}
                            onClick={() => onGenerateInvoice(record._id, record.invoice_no)}
                            className="text-red-600 hover:text-red-700"
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    // Mobile card view
    const MobileOrderCard = ({ order }) => (
        <Card className="mb-4 shadow-sm">
            <div className="space-y-3">
                <div className="flex justify-between items-start">
                    <div>
                        <span className="font-medium text-blue-600">
                            #{order.invoice_no}
                        </span>
                        <p className="text-sm text-gray-600 mt-1">
                            {order.customer_id?.name || "N/A"}
                        </p>
                    </div>
                    <Tag
                        icon={getStatusIcon(order.order_status)}
                        color={getStatusColor(order.order_status)}
                        className="font-medium"
                    >
                        {order.order_status.toUpperCase()}
                    </Tag>
                </div>

                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">
                        {dayjs(order.order_date).format("MMM DD, YYYY")}
                    </span>
                    <span className="font-semibold text-green-600">
                        ${order.total.toFixed(2)}
                    </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm text-gray-500">
                        {order.total_products} items
                    </span>
                    <Space size="small">
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            onClick={() => onViewDetails(order)}
                            className="text-blue-600"
                            size="small"
                        />
                        <Button
                            type="text"
                            icon={<FilePdfOutlined />}
                            onClick={() => onGenerateInvoice(order._id, order.invoice_no)}
                            className="text-red-600"
                            size="small"
                        />
                    </Space>
                </div>
            </div>
        </Card>
    );

    return (
        <>
            {/* Mobile view */}
            <div className="block sm:hidden p-4">
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Orders ({pagination.total})
                    </h3>
                </div>
                
                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-2 text-gray-500">Loading orders...</p>
                    </div>
                ) : (
                    <div>
                        {orders.map((order) => (
                            <MobileOrderCard key={order._id} order={order} />
                        ))}
                    </div>
                )}

                {/* Mobile pagination */}
                <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-gray-500">
                        {(pagination.current - 1) * pagination.pageSize + 1}-
                        {Math.min(pagination.current * pagination.pageSize, pagination.total)} of {pagination.total}
                    </span>
                    <Space>
                        <Button
                            size="small"
                            disabled={pagination.current === 1}
                            onClick={() => onTableChange({
                                current: pagination.current - 1,
                                pageSize: pagination.pageSize,
                            })}
                        >
                            Previous
                        </Button>
                        <Button
                            size="small"
                            disabled={pagination.current * pagination.pageSize >= pagination.total}
                            onClick={() => onTableChange({
                                current: pagination.current + 1,
                                pageSize: pagination.pageSize,
                            })}
                        >
                            Next
                        </Button>
                    </Space>
                </div>
            </div>

            {/* Desktop table view */}
            <div className="hidden sm:block">
                <Table
                    columns={columns}
                    dataSource={orders}
                    rowKey="_id"
                    loading={loading}
                    pagination={{
                        current: pagination.current,
                        pageSize: pagination.pageSize,
                        total: pagination.total,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} orders`,
                        pageSizeOptions: ["10", "20", "50", "100"],
                    }}
                    onChange={onTableChange}
                    scroll={{ x: 900 }}
                    className="orders-table"
                />
            </div>

            <style jsx>{`
                .orders-table .ant-table-thead > tr > th {
                    background-color: #f9fafb;
                    border-bottom: 1px solid #e5e7eb;
                    font-weight: 600;
                    color: #374151;
                }
                
                .orders-table .ant-table-tbody > tr > td {
                    border-bottom: 1px solid #f3f4f6;
                }
                
                .orders-table .ant-table-tbody > tr:hover > td {
                    background-color: #f9fafb;
                }
            `}</style>
        </>
    );
};

export default OrdersTable;