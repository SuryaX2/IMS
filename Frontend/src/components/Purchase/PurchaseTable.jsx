import React from "react";
import { Table, Button, Space, Tag, Tooltip, Popconfirm } from "antd";
import {
    EyeOutlined,
    CheckCircleOutlined,
    InfoCircleOutlined,
    UndoOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { getStatusColor } from "../../utils/purchaseUtils";
import { getStatusIconPurchase } from "../../data";

const PurchaseTable = ({
    purchases,
    loading,
    searchText,
    onViewDetails,
    onUpdateStatus,
    onReturnPreview,
}) => {
    const columns = [
        {
            title: "Purchase No",
            dataIndex: "purchase_no",
            key: "purchase_no",
            filteredValue: [searchText],
            onFilter: (value, record) =>
                record.purchase_no
                    .toLowerCase()
                    .includes(value.toLowerCase()) ||
                record.supplier_id?.name
                    ?.toLowerCase()
                    .includes(value.toLowerCase()),
        },
        {
            title: "Supplier",
            dataIndex: ["supplier_id", "name"],
            key: "supplier",
            render: (_, record) => record.supplier_id?.name || "N/A",
        },
        {
            title: "Purchase Date",
            dataIndex: "purchase_date",
            key: "purchase_date",
            render: (date) => dayjs(date).format("DD/MM/YYYY"),
        },
        {
            title: "Status",
            dataIndex: "purchase_status",
            key: "status",
            render: (status) => (
                <Tag
                    color={getStatusColor(status)}
                    icon={getStatusIconPurchase(status)}
                >
                    {status.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: "Created By",
            dataIndex: ["created_by", "username"],
            key: "created_by",
            render: (_, record) => record.created_by?.username || "N/A",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="View Details">
                        <Button
                            icon={<EyeOutlined />}
                            size="small"
                            onClick={() => onViewDetails(record)}
                        />
                    </Tooltip>

                    {record.purchase_status === "pending" && (
                        <Tooltip title="Mark as Completed">
                            <Popconfirm
                                title="Mark this purchase as completed?"
                                description="This will update the stock for all products in this purchase."
                                onConfirm={() =>
                                    onUpdateStatus(record._id, "completed")
                                }
                            >
                                <Button
                                    icon={<CheckCircleOutlined />}
                                    size="small"
                                    type="primary"
                                />
                            </Popconfirm>
                        </Tooltip>
                    )}

                    {(record.purchase_status === "completed" ||
                        record.purchase_status === "approved") && (
                        <>
                            <Tooltip title="Preview Return">
                                <Button
                                    icon={<InfoCircleOutlined />}
                                    size="small"
                                    onClick={() => onReturnPreview(record._id)}
                                />
                            </Tooltip>
                            <Tooltip title="Process Return">
                                <Popconfirm
                                    title="Process return for this purchase?"
                                    description="This will reduce stock and calculate refund amounts."
                                    onConfirm={() =>
                                        onUpdateStatus(record._id, "returned")
                                    }
                                >
                                    <Button
                                        icon={<UndoOutlined />}
                                        size="small"
                                        danger
                                    />
                                </Popconfirm>
                            </Tooltip>
                        </>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={purchases}
            loading={loading}
            rowKey="_id"
            pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} items`,
            }}
            scroll={{ x: 800 }}
        />
    );
};

export default PurchaseTable;
