import React, { useState } from "react";
import { Table, Button, Space, Modal, Empty, Tooltip } from "antd";
import {
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    AppstoreOutlined,
} from "@ant-design/icons";
import { formatDate } from "../../utils/category_units/dateUtils";
import {
    canEdit,
    getOwnershipTag,
    getOwnershipText,
} from "../../utils/category_units/permissionUtils";
import {
    PAGINATION_CONFIG,
    TABLE_SCROLL_CONFIG,
} from "../../utils/category_units/constants";

const UnitTable = ({
    units,
    loading,
    user,
    isAdmin,
    onEdit,
    onView,
    onDelete,
}) => {
    const [hoveredRow, setHoveredRow] = useState(null);

    const columns = [
        {
            title: "Unit Name",
            dataIndex: "unit_name",
            key: "unit_name",
            sorter: (a, b) => a.unit_name.localeCompare(b.unit_name),
            render: (text) => (
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center">
                        <AppstoreOutlined className="text-green-500 text-sm" />
                    </div>
                    <span className="font-medium text-gray-800">{text}</span>
                </div>
            ),
        },
        {
            title: "Created By",
            dataIndex: "created_by",
            key: "created_by",
            responsive: ["md"],
            render: (_, record) => (
                <span className="text-gray-600">
                    {getOwnershipText(record, user)}
                </span>
            ),
        },
        {
            title: "Created Date",
            dataIndex: "createdAt",
            key: "createdAt",
            responsive: ["lg"],
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
            render: (date) => (
                <span className="text-gray-600">{formatDate(date)}</span>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            width: 120,
            render: (_, record) => {
                const canEditRecord = canEdit(record, user, isAdmin);

                return (
                    <div className="flex items-center justify-end space-x-1">
                        <Tooltip title="View Details">
                            <Button
                                type="text"
                                size="small"
                                icon={<EyeOutlined className="text-blue-500" />}
                                onClick={() => onView(record)}
                                className="text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-md"
                            />
                        </Tooltip>
                        <Tooltip
                            title={
                                canEditRecord ? "Edit" : "No permission to edit"
                            }
                        >
                            <Button
                                type="text"
                                size="small"
                                icon={
                                    <EditOutlined className="text-green-500" />
                                }
                                disabled={!canEditRecord}
                                onClick={() => onEdit(record)}
                                className={
                                    canEditRecord
                                        ? "text-gray-500 hover:text-green-500 hover:bg-green-50 rounded-md"
                                        : "text-gray-300 cursor-not-allowed"
                                }
                            />
                        </Tooltip>
                        <Tooltip
                            title={
                                canEditRecord
                                    ? "Delete"
                                    : "No permission to delete"
                            }
                        >
                            <Button
                                type="text"
                                size="small"
                                icon={
                                    <DeleteOutlined className="text-red-500" />
                                }
                                disabled={!canEditRecord}
                                onClick={() => {
                                    Modal.confirm({
                                        title: "Delete Unit",
                                        content:
                                            "Are you sure you want to delete this unit?",
                                        okText: "Delete",
                                        okType: "danger",
                                        cancelText: "Cancel",
                                        onOk: () => onDelete(record._id),
                                    });
                                }}
                                className={
                                    canEditRecord
                                        ? "text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-md"
                                        : "text-gray-300 cursor-not-allowed"
                                }
                            />
                        </Tooltip>
                    </div>
                );
            },
        },
    ];

    return (
        <div className="overflow-hidden mt-4">
            <Table
                columns={columns}
                dataSource={units}
                rowKey="_id"
                loading={loading}
                pagination={{
                    ...PAGINATION_CONFIG,
                    showTotal: (total, range) =>
                        `Showing ${range[0]}-${range[1]} of ${total} units`,
                    className: "px-4 py-3",
                    showSizeChanger: false,
                }}
                locale={{
                    emptyText: (
                        <div className="py-12">
                            <Empty
                                description="No units found"
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                            />
                        </div>
                    ),
                }}
                scroll={TABLE_SCROLL_CONFIG}
                className="unit-table"
                rowClassName={(record, index) =>
                    `hover:bg-gray-50 transition-colors duration-150 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                    }`
                }
                onRow={(record) => ({
                    onMouseEnter: () => setHoveredRow(record._id),
                    onMouseLeave: () => setHoveredRow(null),
                })}
            />
            <style jsx>{`
                .unit-table .ant-table-thead > tr > th {
                    background: #fafafa;
                    border-bottom: 2px solid #e5e7eb;
                    font-weight: 600;
                    color: #374151;
                    font-size: 13px;
                    padding: 16px;
                }
                .unit-table .ant-table-tbody > tr > td {
                    padding: 16px;
                    border-bottom: 1px solid #f3f4f6;
                }
                .unit-table .ant-table-tbody > tr:last-child > td {
                    border-bottom: none;
                }
                .unit-table .ant-pagination {
                    border-top: 1px solid #f3f4f6;
                }
            `}</style>
        </div>
    );
};

export default UnitTable;
