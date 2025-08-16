import { Tag } from "antd";
import {
    CheckCircleOutlined,
    WarningOutlined,
    CloseCircleOutlined,
    InboxOutlined,
    TrophyOutlined,
} from "@ant-design/icons";
import { formatCurrency } from "./reportUtils";

// Common table configurations
export const createTableConfig = (type) => {
    const configs = {
        sales: {
            columns: [
                {
                    title: "Product Name",
                    dataIndex: "product_name",
                    key: "product_name",
                    sorter: (a, b) =>
                        a.product_name.localeCompare(b.product_name),
                },
                {
                    title: "Quantity Sold",
                    dataIndex: "quantity",
                    key: "quantity",
                    sorter: (a, b) => a.quantity - b.quantity,
                    render: (quantity) => (
                        <span className="font-medium">{quantity}</span>
                    ),
                },
                {
                    title: "Total Sales",
                    dataIndex: "total",
                    key: "total",
                    sorter: (a, b) => a.total - b.total,
                    render: (total) => (
                        <span className="text-green-600 font-medium">
                            {formatCurrency(total)}
                        </span>
                    ),
                },
            ],
            summaryFields: ["quantity", "total"],
        },
        purchases: {
            columns: [
                {
                    title: "Supplier Name",
                    dataIndex: "supplier_name",
                    key: "supplier_name",
                    sorter: (a, b) =>
                        a.supplier_name.localeCompare(b.supplier_name),
                    render: (text, record) => (
                        <div>
                            <div className="font-medium">{text}</div>
                            <div className="text-sm text-gray-500">
                                {record.shopname}
                            </div>
                        </div>
                    ),
                },
                {
                    title: "Purchase Count",
                    dataIndex: "count",
                    key: "count",
                    sorter: (a, b) => a.count - b.count,
                    render: (count) => (
                        <span className="font-medium">{count}</span>
                    ),
                },
                {
                    title: "Total Purchases",
                    dataIndex: "total_purchases",
                    key: "total_purchases",
                    sorter: (a, b) => a.total_purchases - b.total_purchases,
                    render: (total) => (
                        <span className="text-blue-600 font-medium">
                            {formatCurrency(total)}
                        </span>
                    ),
                },
            ],
            summaryFields: ["count", "total_purchases"],
        },
        stock: {
            columns: [
                {
                    title: "Product Name",
                    dataIndex: "product_name",
                    key: "product_name",
                    sorter: (a, b) =>
                        a.product_name.localeCompare(b.product_name),
                    render: (text, record) => (
                        <div>
                            <div className="font-medium">{text}</div>
                            <div className="text-sm text-gray-500">
                                {record.product_code}
                            </div>
                        </div>
                    ),
                },
                {
                    title: "Category",
                    dataIndex: "category_name",
                    key: "category_name",
                    sorter: (a, b) =>
                        a.category_name.localeCompare(b.category_name),
                },
                {
                    title: "Unit",
                    dataIndex: "unit_name",
                    key: "unit_name",
                },
                {
                    title: "Stock",
                    dataIndex: "stock",
                    key: "stock",
                    sorter: (a, b) => a.stock - b.stock,
                    render: (stock) => (
                        <span
                            className={
                                stock < 10 ? "text-red-500 font-medium" : ""
                            }
                        >
                            {stock}
                        </span>
                    ),
                },
                {
                    title: "Buying Price",
                    dataIndex: "buying_price",
                    key: "buying_price",
                    sorter: (a, b) => a.buying_price - b.buying_price,
                    render: (price) => formatCurrency(price),
                },
                {
                    title: "Selling Price",
                    dataIndex: "selling_price",
                    key: "selling_price",
                    sorter: (a, b) => a.selling_price - b.selling_price,
                    render: (price) => formatCurrency(price),
                },
                {
                    title: "Inventory Value",
                    dataIndex: "inventory_value",
                    key: "inventory_value",
                    sorter: (a, b) => a.inventory_value - b.inventory_value,
                    render: (value) => formatCurrency(value),
                },
                {
                    title: "Status",
                    dataIndex: "status",
                    key: "status",
                    render: (status) => (
                        <Tag
                            color={getStatusColor(status)}
                            icon={getStatusIcon(status)}
                        >
                            {status}
                        </Tag>
                    ),
                },
            ],
        },
        topProducts: {
            columns: [
                {
                    title: "Rank",
                    key: "rank",
                    render: (_, __, index) => (
                        <div className="flex items-center gap-2">
                            {index < 3 && (
                                <TrophyOutlined
                                    style={{
                                        color:
                                            index === 0
                                                ? "#FFD700"
                                                : index === 1
                                                  ? "#C0C0C0"
                                                  : "#CD7F32",
                                        fontSize: "16px",
                                    }}
                                />
                            )}
                            <span className="font-medium">#{index + 1}</span>
                        </div>
                    ),
                },
                {
                    title: "Product",
                    key: "product",
                    render: (_, record) => (
                        <div>
                            <div className="font-medium">
                                {record.product_name}
                            </div>
                            <div className="text-sm text-gray-500">
                                {record.product_code}
                            </div>
                        </div>
                    ),
                },
                {
                    title: "Quantity Sold",
                    dataIndex: "quantity_sold",
                    key: "quantity_sold",
                    sorter: (a, b) => a.quantity_sold - b.quantity_sold,
                    render: (quantity) => (
                        <span className="font-medium text-blue-600">
                            {quantity}
                        </span>
                    ),
                },
                {
                    title: "Total Sales",
                    dataIndex: "total_sales",
                    key: "total_sales",
                    sorter: (a, b) => a.total_sales - b.total_sales,
                    render: (total) => (
                        <span className="text-green-600 font-medium">
                            {formatCurrency(total)}
                        </span>
                    ),
                },
            ],
            summaryFields: ["quantity_sold", "total_sales"],
        },
    };

    return configs[type] || {};
};

// Status utilities
export const getStatusColor = (status) => {
    const colors = {
        "In Stock": "green",
        "Low Stock": "orange",
        "Out of Stock": "red",
    };
    return colors[status] || "default";
};

export const getStatusIcon = (status) => {
    const icons = {
        "In Stock": CheckCircleOutlined,
        "Low Stock": WarningOutlined,
        "Out of Stock": CloseCircleOutlined,
    };
    return icons[status] || InboxOutlined;
};

// Common pagination configuration
export const getPaginationConfig = () => ({
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
    defaultPageSize: 10,
    pageSizeOptions: ["10", "25", "50"],
});

// Table summary generator
export const createTableSummary = (pageData, summaryFields, type) => {
    const totals = {};

    summaryFields.forEach((field) => {
        totals[field] = pageData.reduce(
            (sum, item) => sum + (item[field] || 0),
            0
        );
    });

    return (
        <Table.Summary.Row className="bg-gray-50">
            <Table.Summary.Cell>
                <strong>Page Total</strong>
            </Table.Summary.Cell>
            {summaryFields.map((field, index) => (
                <Table.Summary.Cell key={field}>
                    <strong className={getSummaryClass(field)}>
                        {field.includes("total") ||
                        field.includes("sales") ||
                        field.includes("purchases") ||
                        field.includes("value")
                            ? formatCurrency(totals[field])
                            : totals[field]}
                    </strong>
                </Table.Summary.Cell>
            ))}
        </Table.Summary.Row>
    );
};

// Summary cell class helper
const getSummaryClass = (field) => {
    if (field.includes("sales") || field.includes("total"))
        return "text-green-600";
    if (field.includes("purchases")) return "text-blue-600";
    return "";
};

// Common table props
export const getTableProps = (type) => ({
    scroll: { x: type === "stock" ? 1200 : 600 },
    size: "middle",
    className: "custom-table",
    pagination: getPaginationConfig(),
});
