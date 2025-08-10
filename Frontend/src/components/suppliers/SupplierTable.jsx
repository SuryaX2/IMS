import React from "react";
import { Table, Button, Modal, Dropdown, Avatar, Tag, Card } from "antd";
import {
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    MoreOutlined,
    UserOutlined,
} from "@ant-design/icons";

const SupplierTable = ({ suppliers, loading, onView, onEdit, onDelete }) => {
    const columns = [
        {
            title: "Photo",
            dataIndex: "photo",
            key: "photo",
            width: 80,
            render: (photo) => (
                <Avatar
                    size={40}
                    src={photo !== "default-supplier.png" ? photo : null}
                    icon={<UserOutlined />}
                />
            ),
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Phone",
            dataIndex: "phone",
            key: "phone",
        },
        {
            title: "Shop Name",
            dataIndex: "shopname",
            key: "shopname",
            render: (shopname) => shopname || "-",
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            render: (type) => (
                <Tag color={type === "company" ? "blue" : "green"}>
                    {type?.toUpperCase() || "N/A"}
                </Tag>
            ),
        },
        {
            title: "Address",
            dataIndex: "address",
            key: "address",
            ellipsis: true,
        },
        {
            title: "Actions",
            key: "actions",
            width: 120,
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
                        onClick: () => onEdit(record),
                    },
                    {
                        key: "delete",
                        label: "Delete",
                        icon: <DeleteOutlined />,
                        danger: true,
                        onClick: () => {
                            Modal.confirm({
                                title: "Delete Supplier",
                                content: `Are you sure you want to delete ${record.name}?`,
                                okText: "Yes",
                                okType: "danger",
                                cancelText: "No",
                                onOk: () => onDelete(record._id),
                            });
                        },
                    },
                ];

                return (
                    <Dropdown menu={{ items }} trigger={["click"]}>
                        <Button type="text" icon={<MoreOutlined />} />
                    </Dropdown>
                );
            },
        },
    ];

    return (
        <Card>
            <Table
                columns={columns}
                dataSource={suppliers}
                rowKey="_id"
                loading={loading}
                pagination={{
                    total: suppliers.length,
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} of ${total} suppliers`,
                }}
                scroll={{ x: 800 }}
            />
        </Card>
    );
};

export default SupplierTable;
