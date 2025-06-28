import React from "react";
import { Table, Button, Select, Tag, Space, Tooltip, Card } from "antd";
import { EyeOutlined, FilePdfOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import {
    getStatusColor,
    getStatusIcon,
    ORDER_STATUSES,
} from "../../utils/orderHelpers";

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
            render: (text) => (
                <span className="font-medium text-blue-600">#{text}</span>
            ),
        },
        {
            title: "Customer",
            dataIndex: ["customer_id", "name"],
            key: "customer",
            render: (text, record) => record.customer_id?.name || "N/A",
        },
        {
            title: "Date",
            dataIndex: "order_date",
            key: "order_date",
            render: (date) => dayjs(date).format("MMM DD, YYYY"),
        },
        {
            title: "Status",
            dataIndex: "order_status",
            key: "order_status",
            render: (status) => (
                <Tag
                    icon={getStatusIcon(status)}
                    color={getStatusColor(status)}
                >
                    {status.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: "Items",
            dataIndex: "total_products",
            key: "total_products",
            render: (count) => <span className="font-medium">{count}</span>,
        },
        {
            title: "Total",
            dataIndex: "total",
            key: "total",
            render: (amount) => (
                <span className="font-semibold text-green-600">
                    ${amount.toFixed(2)}
                </span>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="View Details">
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            onClick={() => onViewDetails(record)}
                            className="text-blue-600 hover:text-blue-800"
                        />
                    </Tooltip>

                    <Tooltip title="Update Status">
                        <Select
                            value={record.order_status}
                            size="small"
                            style={{ width: 100 }}
                            onChange={(value) =>
                                onUpdateStatus(record._id, value)
                            }
                        >
                            {ORDER_STATUSES.map((status) => (
                                <Option key={status.value} value={status.value}>
                                    {status.label}
                                </Option>
                            ))}
                        </Select>
                    </Tooltip>

                    <Tooltip title="Download Invoice">
                        <Button
                            type="text"
                            icon={<FilePdfOutlined />}
                            onClick={() =>
                                onGenerateInvoice(record._id, record.invoice_no)
                            }
                            className="text-red-600 hover:text-red-800"
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <Card className="border-0 shadow-sm">
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
                }}
                onChange={onTableChange}
                className="overflow-x-auto"
                scroll={{ x: 800 }}
            />
        </Card>
    );
};

export default OrdersTable;
