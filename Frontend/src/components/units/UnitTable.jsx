import React from "react";
import { Table, Button, Dropdown, Space, Tag, Modal, Empty } from "antd";
import {
    EditOutlined,
    DeleteOutlined,
    MoreOutlined,
    EyeOutlined,
    AppstoreOutlined,
    UserOutlined,
    CalendarOutlined,
} from "@ant-design/icons";
import { formatDate } from "../../utils/dateUtils";
import {
    canEdit,
    getOwnershipTag,
    getOwnershipText,
} from "../../utils/permissionUtils";
import { PAGINATION_CONFIG, TABLE_SCROLL_CONFIG } from "../../utils/constants";

const UnitTable = ({
    units,
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
            dataIndex: "unit_name",
            key: "unit_name",
            sorter: (a, b) => a.unit_name.localeCompare(b.unit_name),
            render: (text) => (
                <div className="flex items-center space-x-2">
                    <AppstoreOutlined className="text-green-500" />
                    <span className="font-medium">{text}</span>
                </div>
            ),
        },
        {
            title: "Created By",
            dataIndex: "created_by",
            key: "created_by",
            render: (createdBy, record) => (
                <Tag
                    color={getOwnershipTag(record, user)}
                    icon={<UserOutlined />}
                >
                    {getOwnershipText(record, user)}
                </Tag>
            ),
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date) => (
                <div className="flex items-center space-x-1">
                    <CalendarOutlined className="text-gray-400" />
                    <span>{formatDate(date)}</span>
                </div>
            ),
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
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
                                            title: "Delete Unit",
                                            content:
                                                "Are you sure you want to delete this unit?",
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
            dataSource={units}
            rowKey="_id"
            loading={loading}
            pagination={{
                ...PAGINATION_CONFIG,
                showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} units`,
            }}
            locale={{
                emptyText: (
                    <Empty
                        description="No units found"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                ),
            }}
            scroll={TABLE_SCROLL_CONFIG}
        />
    );
};

export default UnitTable;
