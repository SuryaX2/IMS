import React from "react";
import { Table, Button, Dropdown, Space, Tag, Modal, Empty } from "antd";
import {
    EditOutlined,
    DeleteOutlined,
    MoreOutlined,
    EyeOutlined,
    TagsOutlined,
    UserOutlined,
    CalendarOutlined,
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
    const columns = [
        {
            title: "Name",
            dataIndex: "category_name",
            key: "category_name",
            sorter: (a, b) => a.category_name.localeCompare(b.category_name),
            render: (text) => (
                <div className="flex items-center space-x-2">
                    <TagsOutlined className="text-blue-500" />
                    <span className="font-medium">{text}</span>
                </div>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            fixed: "right",
            width: 200,
            render: (_, record) => {
                const items = [
                    {
                        key: "view",
                        label: "View Details",
                        icon: <EyeOutlined />,
                        onClick: () => onView(record),
                    },
                    {
                        key: "edit",
                        label: "Edit",
                        icon: <EditOutlined />,
                        disabled: !canEdit(record, user, isAdmin),
                        onClick: () => onEdit(record),
                    },
                    {
                        key: "delete",
                        label: "Delete",
                        icon: <DeleteOutlined />,
                        danger: true,
                        disabled: !canEdit(record, user, isAdmin),
                    },
                ];

                return (
                    <Space>
                        <Button
                            type="primary"
                            size="small"
                            icon={<EditOutlined />}
                            disabled={!canEdit(record, user, isAdmin)}
                            onClick={() => onEdit(record)}
                        >
                            Edit
                        </Button>
                        <Dropdown
                            menu={{
                                items,
                                onClick: (e) => {
                                    if (e.key === "delete") {
                                        Modal.confirm({
                                            title: "Delete Category",
                                            content:
                                                "Are you sure you want to delete this category?",
                                            okText: "Yes",
                                            okType: "danger",
                                            cancelText: "No",
                                            onOk: () => onDelete(record._id),
                                        });
                                    }
                                },
                            }}
                            trigger={["click"]}
                        >
                            <Button size="small" icon={<MoreOutlined />} />
                        </Dropdown>
                    </Space>
                );
            },
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={categories}
            rowKey="_id"
            loading={loading}
            pagination={{
                ...PAGINATION_CONFIG,
                showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} categories`,
            }}
            locale={{
                emptyText: (
                    <Empty
                        description="No categories found"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                ),
            }}
            scroll={TABLE_SCROLL_CONFIG}
        />
    );
};

export default CategoryTable;
