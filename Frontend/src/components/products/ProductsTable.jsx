import React from "react";
import {
    Table,
    Button,
    Space,
    Badge,
    Tooltip,
    Popconfirm,
    Image,
    Typography,
} from "antd";
import {
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

const ProductsTable = ({
    products,
    loading,
    categories,
    onEdit,
    onDelete,
    onViewDetails,
}) => {
    const columns = [
        {
            title: "Image",
            dataIndex: "product_image",
            key: "product_image",
            width: 80,
            render: (image) => (
                <Image
                    src={image}
                    alt="Product"
                    width={50}
                    height={50}
                    style={{ objectFit: "cover" }}
                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6U"
                />
            ),
        },
        {
            title: "Product Name",
            dataIndex: "product_name",
            key: "product_name",
            sorter: (a, b) => a.product_name.localeCompare(b.product_name),
            render: (text, record) => (
                <div className="flex flex-col">
                    <Text strong>{text}</Text>
                    <Text type="secondary" className="text-xs">
                        Code: {record.product_code}
                    </Text>
                </div>
            ),
        },
        {
            title: "Category",
            dataIndex: ["category_id", "category_name"],
            key: "category",
            responsive: ["md"],
            filters: categories.map((cat) => ({
                text: cat.category_name,
                value: cat._id,
            })),
            onFilter: (value, record) => record.category_id._id === value,
        },
        {
            title: "Stock",
            dataIndex: "stock",
            key: "stock",
            width: 100,
            sorter: (a, b) => a.stock - b.stock,
            render: (stock) => {
                let color = "success";
                let status = "In Stock";

                if (stock === 0) {
                    color = "error";
                    status = "Out of Stock";
                } else if (stock <= 10) {
                    color = "warning";
                    status = "Low Stock";
                }

                return (
                    <div className="flex flex-col items-center">
                        <Badge status={color} />
                        <Text>{stock}</Text>
                        <Text type="secondary" className="text-xs">
                            {status}
                        </Text>
                    </div>
                );
            },
        },
        {
            title: "Price",
            key: "price",
            render: (_, record) => (
                <div className="flex flex-col">
                    <Text strong>${record.selling_price.toFixed(2)}</Text>
                    <Text type="secondary" className="text-xs">
                        Buy: ${record.buying_price.toFixed(2)}
                    </Text>
                </div>
            ),
            sorter: (a, b) => a.selling_price - b.selling_price,
        },
        {
            title: "Unit",
            dataIndex: ["unit_id", "unit_name"],
            key: "unit",
            responsive: ["lg"],
        },
        {
            title: "Actions",
            key: "actions",
            width: 150,
            render: (_, record) => (
                <Space>
                    <Tooltip title="View Details">
                        <Button
                            icon={<EyeOutlined />}
                            onClick={() => onViewDetails(record)}
                            type="text"
                        />
                    </Tooltip>
                    <Tooltip title="Edit">
                        <Button
                            icon={<EditOutlined />}
                            onClick={() => onEdit(record)}
                            type="text"
                        />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Popconfirm
                            title="Delete this product?"
                            description="This action cannot be undone. Are you sure?"
                            onConfirm={() => onDelete(record._id)}
                            okText="Yes"
                            cancelText="No"
                            icon={
                                <ExclamationCircleOutlined
                                    style={{ color: "red" }}
                                />
                            }
                        >
                            <Button
                                icon={<DeleteOutlined />}
                                danger
                                type="text"
                            />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <Table
            dataSource={products}
            columns={columns}
            rowKey="_id"
            loading={loading}
            pagination={{
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} products`,
            }}
        />
    );
};

export default ProductsTable;
