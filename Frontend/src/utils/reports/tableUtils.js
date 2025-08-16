import { Table } from "antd";
import { formatCurrency } from "./reportUtils";
import {
    renderProductName,
    renderSupplierName,
    renderQuantity,
    renderStock,
    renderTotalSales,
    renderTotalPurchases,
    renderQuantitySold,
    renderStatus,
    renderRank,
    renderTopProduct,
    renderSummaryCell,
} from "../../components/common/reports/TableComponents";

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
                    render: renderQuantity,
                },
                {
                    title: "Total Sales",
                    dataIndex: "total",
                    key: "total",
                    sorter: (a, b) => a.total - b.total,
                    render: renderTotalSales,
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
                    render: renderSupplierName,
                },
                {
                    title: "Purchase Count",
                    dataIndex: "count",
                    key: "count",
                    sorter: (a, b) => a.count - b.count,
                    render: renderQuantity,
                },
                {
                    title: "Total Purchases",
                    dataIndex: "total_purchases",
                    key: "total_purchases",
                    sorter: (a, b) => a.total_purchases - b.total_purchases,
                    render: renderTotalPurchases,
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
                    render: renderProductName,
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
                    render: renderStock,
                },
                {
                    title: "Buying Price",
                    dataIndex: "buying_price",
                    key: "buying_price",
                    sorter: (a, b) => a.buying_price - b.buying_price,
                    render: formatCurrency,
                },
                {
                    title: "Selling Price",
                    dataIndex: "selling_price",
                    key: "selling_price",
                    sorter: (a, b) => a.selling_price - b.selling_price,
                    render: formatCurrency,
                },
                {
                    title: "Inventory Value",
                    dataIndex: "inventory_value",
                    key: "inventory_value",
                    sorter: (a, b) => a.inventory_value - b.inventory_value,
                    render: formatCurrency,
                },
                {
                    title: "Status",
                    dataIndex: "status",
                    key: "status",
                    render: renderStatus,
                },
            ],
            summaryFields: ["stock", "inventory_value"],
        },
        topProducts: {
            columns: [
                {
                    title: "Rank",
                    key: "rank",
                    render: renderRank,
                },
                {
                    title: "Product",
                    key: "product",
                    render: renderTopProduct,
                },
                {
                    title: "Quantity Sold",
                    dataIndex: "quantity_sold",
                    key: "quantity_sold",
                    sorter: (a, b) => a.quantity_sold - b.quantity_sold,
                    render: renderQuantitySold,
                },
                {
                    title: "Total Sales",
                    dataIndex: "total_sales",
                    key: "total_sales",
                    sorter: (a, b) => a.total_sales - b.total_sales,
                    render: renderTotalSales,
                },
            ],
            summaryFields: ["quantity_sold", "total_sales"],
        },
    };

    return configs[type] || {};
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
export const createTableSummary = (pageData, summaryFields, type = "") => {
    if (!pageData || pageData.length === 0) return null;

    const totals = {};
    summaryFields.forEach((field) => {
        totals[field] = pageData.reduce(
            (sum, item) => sum + (item[field] || 0),
            0
        );
    });

    const getSummaryClass = (field) => {
        if (field.includes("sales") || field.includes("total"))
            return "text-green-600";
        if (field.includes("purchases")) return "text-blue-600";
        return "";
    };

    return (
        <Table.Summary.Row className="bg-gray-50">
            <Table.Summary.Cell>
                <strong>Page Total</strong>
            </Table.Summary.Cell>
            {summaryFields.map((field) => (
                <Table.Summary.Cell key={field}>
                    {renderSummaryCell(field,totals[field],getSummaryClass(field))}
                </Table.Summary.Cell>
            ))}
        </Table.Summary.Row>
    );
};

// Common table props
export const getTableProps = (type) => ({
    scroll: { x: type === "stock" ? 1200 : 600 },
    size: "middle",
    className: "custom-table",
    pagination: getPaginationConfig(),
});
