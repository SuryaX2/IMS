import React from "react";
import { Table, Button, Select, Tag, Space, Tooltip, Card } from "antd";
import { EyeOutlined, FilePdfOutlined } from "@ant-design/icons";
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
            width: 120,
            fixed: "left",
            render: (text) => (
                <span className="font-medium text-blue-600 text-xs sm:text-sm">
                    #{text}
                </span>
            ),
        },
        {
            title: "Customer",
            dataIndex: ["customer_id", "name"],
            key: "customer",
            width: 150,
            ellipsis: true,
            render: (text, record) => (
                <Tooltip title={record.customer_id?.name || "N/A"}>
                    <span className="text-xs sm:text-sm">
                        {record.customer_id?.name || "N/A"}
                    </span>
                </Tooltip>
            ),
        },
        {
            title: "Date",
            dataIndex: "order_date",
            key: "order_date",
            width: 100,
            responsive: ["md"],
            render: (date) => (
                <span className="text-xs sm:text-sm">
                    {dayjs(date).format("MMM DD, YYYY")}
                </span>
            ),
        },
        {
            title: "Status",
            dataIndex: "order_status",
            key: "order_status",
            width: 100,
            render: (status) => (
                <Tag
                    icon={getStatusIcon(status)}
                    color={getStatusColor(status)}
                    className="text-xs"
                >
                    <span className="hidden xs:inline">
                        {status.toUpperCase()}
                    </span>
                    <span className="xs:hidden">
                        {status.charAt(0).toUpperCase()}
                    </span>
                </Tag>
            ),
        },
        {
            title: "Items",
            dataIndex: "total_products",
            key: "total_products",
            width: 70,
            responsive: ["sm"],
            render: (count) => (
                <span className="font-medium text-xs sm:text-sm">{count}</span>
            ),
        },
        {
            title: "Total",
            dataIndex: "total",
            key: "total",
            width: 100,
            render: (amount) => (
                <span className="font-semibold text-green-600 text-xs sm:text-sm">
                    ${amount.toFixed(2)}
                </span>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            width: 180,
            fixed: "right",
            render: (_, record) => (
                <Space size="small" className="flex flex-wrap">
                    <Tooltip title="View Details">
                        <Button
                            type="text"
                            icon={
                                <EyeOutlined className="text-xs sm:text-sm" />
                            }
                            onClick={() => onViewDetails(record)}
                            className="text-blue-600 hover:text-blue-800 p-1 sm:p-2"
                            size="small"
                        />
                    </Tooltip>

                    <Tooltip title="Update Status">
                        <Select
                            value={record.order_status}
                            size="small"
                            style={{ width: 80, fontSize: "12px" }}
                            className="sm:w-24"
                            onChange={(value) =>
                                onUpdateStatus(record._id, value)
                            }
                            dropdownMatchSelectWidth={false}
                        >
                            {ORDER_STATUSES.map((status) => (
                                <Option key={status.value} value={status.value}>
                                    <span className="text-xs">
                                        {status.label}
                                    </span>
                                </Option>
                            ))}
                        </Select>
                    </Tooltip>

                    <Tooltip title="Download Invoice">
                        <Button
                            type="text"
                            icon={
                                <FilePdfOutlined className="text-xs sm:text-sm" />
                            }
                            onClick={() =>
                                onGenerateInvoice(record._id, record.invoice_no)
                            }
                            className="text-red-600 hover:text-red-800 p-1 sm:p-2"
                            size="small"
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    // Mobile card view for very small screens
    const MobileOrderCard = ({ order }) => (
        <Card size="small" className="mb-3 border border-gray-200">
            <div className="space-y-2">
                <div className="flex justify-between items-start">
                    <div>
                        <span className="font-medium text-blue-600 text-sm">
                            #{order.invoice_no}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                            {order.customer_id?.name || "N/A"}
                        </p>
                    </div>
                    <Tag
                        icon={getStatusIcon(order.order_status)}
                        color={getStatusColor(order.order_status)}
                        className="text-xs"
                    >
                        {order.order_status.toUpperCase()}
                    </Tag>
                </div>

                <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">
                        {dayjs(order.order_date).format("MMM DD, YYYY")}
                    </span>
                    <span className="font-semibold text-green-600">
                        ${order.total.toFixed(2)}
                    </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-xs text-gray-500">
                        {order.total_products} items
                    </span>
                    <Space size="small">
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            onClick={() => onViewDetails(order)}
                            className="text-blue-600 hover:text-blue-800"
                            size="small"
                        />
                        <Button
                            type="text"
                            icon={<FilePdfOutlined />}
                            onClick={() =>
                                onGenerateInvoice(order._id, order.invoice_no)
                            }
                            className="text-red-600 hover:text-red-800"
                            size="small"
                        />
                    </Space>
                </div>
            </div>
        </Card>
    );

    return (
        <Card className="border-0 shadow-sm">
            {/* Mobile view for screens smaller than 640px */}
            <div className="block sm:hidden">
                <div className="mb-4">
                    <h3 className="text-lg font-medium mb-3">
                        Orders ({pagination.total})
                    </h3>
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {orders.map((order) => (
                                <MobileOrderCard
                                    key={order._id}
                                    order={order}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Mobile pagination */}
                <div className="flex justify-between items-center pt-4 border-t">
                    <span className="text-sm text-gray-500">
                        {(pagination.current - 1) * pagination.pageSize + 1}-
                        {Math.min(
                            pagination.current * pagination.pageSize,
                            pagination.total
                        )}{" "}
                        of {pagination.total}
                    </span>
                    <Space>
                        <Button
                            size="small"
                            disabled={pagination.current === 1}
                            onClick={() =>
                                onTableChange({
                                    current: pagination.current - 1,
                                    pageSize: pagination.pageSize,
                                })
                            }
                        >
                            Previous
                        </Button>
                        <Button
                            size="small"
                            disabled={
                                pagination.current * pagination.pageSize >=
                                pagination.total
                            }
                            onClick={() =>
                                onTableChange({
                                    current: pagination.current + 1,
                                    pageSize: pagination.pageSize,
                                })
                            }
                        >
                            Next
                        </Button>
                    </Space>
                </div>
            </div>

            {/* Desktop table view for screens 640px and larger */}
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
                            `${range[0]}-${range[1]} of ${total} items`,
                        responsive: true,
                        size: "small",
                    }}
                    onChange={onTableChange}
                    className="overflow-x-auto"
                    scroll={{ x: 800 }}
                    size="small"
                />
            </div>
        </Card>
    );
};

export default OrdersTable;
