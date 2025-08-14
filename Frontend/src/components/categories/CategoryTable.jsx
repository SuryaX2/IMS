import React, { useState } from "react";
import { Table, Button, Space, Modal, Empty, Tooltip } from "antd";
import {
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    TagsOutlined,
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

const CategoryTable = ({
    categories,
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
            title: "Category Name",
            dataIndex: "category_name",
            key: "category_name",
            sorter: (a, b) => a.category_name.localeCompare(b.category_name),
            width: "50%",
            render: (text) => (
                <div className="flex items-center space-x-3 py-1">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                        <TagsOutlined className="text-white text-base" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-900 text-base leading-tight">
                            {text}
                        </span>
                        <span className="text-sm text-gray-500 mt-0.5">
                            Category
                        </span>
                    </div>
                </div>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            width: "50%",
            align: "center",
            render: (_, record) => {
                const canEditRecord = canEdit(record, user, isAdmin);

                return (
                    <div className="flex items-center justify-center space-x-2">
                        <Tooltip title="View Details">
                            <Button
                                type="text"
                                size="middle"
                                icon={<EyeOutlined />}
                                onClick={() => onView(record)}
                                className="h-9 w-9 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:bg-blue-50 border-0 rounded-lg transition-all duration-200"
                            />
                        </Tooltip>
                        <Tooltip
                            title={
                                canEditRecord ? "Edit" : "No permission to edit"
                            }
                        >
                            <Button
                                type="text"
                                size="middle"
                                icon={<EditOutlined />}
                                disabled={!canEditRecord}
                                onClick={() => onEdit(record)}
                                className={
                                    canEditRecord
                                        ? "h-9 w-9 flex items-center justify-center text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 border-0 rounded-lg transition-all duration-200"
                                        : "h-9 w-9 flex items-center justify-center text-gray-300 cursor-not-allowed border-0 rounded-lg"
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
                                size="middle"
                                icon={<DeleteOutlined />}
                                disabled={!canEditRecord}
                                onClick={() => {
                                    Modal.confirm({
                                        title: "Delete Category",
                                        content:
                                            "Are you sure you want to delete this category?",
                                        okText: "Delete",
                                        okType: "danger",
                                        cancelText: "Cancel",
                                        onOk: () => onDelete(record._id),
                                    });
                                }}
                                className={
                                    canEditRecord
                                        ? "h-9 w-9 flex items-center justify-center text-gray-600 hover:text-red-600 hover:bg-red-50 border-0 rounded-lg transition-all duration-200"
                                        : "h-9 w-9 flex items-center justify-center text-gray-300 cursor-not-allowed border-0 rounded-lg"
                                }
                            />
                        </Tooltip>
                    </div>
                );
            },
        },
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <Table
                columns={columns}
                dataSource={categories}
                rowKey="_id"
                loading={loading}
                pagination={{
                    ...PAGINATION_CONFIG,
                    showTotal: (total, range) =>
                        `Showing ${range[0]}-${range[1]} of ${total} categories`,
                    className: "px-6 py-4 bg-gray-50/50",
                    showSizeChanger: false,
                    size: "default",
                }}
                locale={{
                    emptyText: (
                        <div className="py-16">
                            <Empty
                                description={
                                    <div className="text-center">
                                        <div className="text-gray-500 text-base font-medium mb-1">
                                            No categories found
                                        </div>
                                        <div className="text-gray-400 text-sm">
                                            Create your first category to get
                                            started
                                        </div>
                                    </div>
                                }
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                            />
                        </div>
                    ),
                }}
                scroll={{ x: 768, ...TABLE_SCROLL_CONFIG }}
                className="category-table"
                rowClassName={(record, index) =>
                    `hover:bg-blue-50/30 transition-all duration-200 cursor-pointer ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                    }`
                }
                onRow={(record) => ({
                    onMouseEnter: () => setHoveredRow(record._id),
                    onMouseLeave: () => setHoveredRow(null),
                })}
                size="large"
            />
            <style jsx>{`
                .category-table .ant-table {
                    font-size: 14px;
                }
                .category-table .ant-table-thead > tr > th {
                    background: linear-gradient(
                        135deg,
                        #f8fafc 0%,
                        #f1f5f9 100%
                    );
                    border-bottom: 2px solid #e2e8f0;
                    font-weight: 600;
                    color: #334155;
                    font-size: 14px;
                    padding: 20px 24px;
                    border-top: none;
                }
                .category-table .ant-table-thead > tr > th:first-child {
                    border-top-left-radius: 0;
                }
                .category-table .ant-table-thead > tr > th:last-child {
                    border-top-right-radius: 0;
                }
                .category-table .ant-table-tbody > tr > td {
                    padding: 20px 24px;
                    border-bottom: 1px solid #f1f5f9;
                    vertical-align: middle;
                }
                .category-table .ant-table-tbody > tr:last-child > td {
                    border-bottom: 1px solid #e2e8f0;
                }
                .category-table .ant-table-tbody > tr:hover > td {
                    background-color: rgba(59, 130, 246, 0.04) !important;
                }
                .category-table .ant-pagination {
                    margin: 0 !important;
                    border-top: 1px solid #e2e8f0;
                }
                .category-table .ant-pagination .ant-pagination-item {
                    border-radius: 8px;
                    border: 1px solid #e2e8f0;
                }
                .category-table .ant-pagination .ant-pagination-item-active {
                    background: #3b82f6;
                    border-color: #3b82f6;
                }
                .category-table .ant-pagination .ant-pagination-item-active a {
                    color: white;
                }

                @media (max-width: 768px) {
                    .category-table .ant-table-thead > tr > th,
                    .category-table .ant-table-tbody > tr > td {
                        padding: 16px 12px;
                    }

                    .category-table
                        .ant-table-tbody
                        > tr
                        > td:first-child
                        > div {
                        flex-direction: column;
                        align-items: flex-start;
                        space-x: 0;
                        gap: 8px;
                    }
                }

                @media (max-width: 640px) {
                    .category-table .ant-table-thead > tr > th,
                    .category-table .ant-table-tbody > tr > td {
                        padding: 12px 8px;
                    }

                    .category-table .ant-pagination {
                        padding: 16px 8px;
                    }
                }
            `}</style>
        </div>
    );
};

export default CategoryTable;
