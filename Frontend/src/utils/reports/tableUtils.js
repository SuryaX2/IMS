import { Table } from "antd";
import { formatCurrency } from "./reportUtils";

// Common table configurations
export const DEFAULT_TABLE_CONFIG = {
    rowKey: "_id",
    size: "middle",
    className: "custom-table",
    scroll: { x: 600 },
    pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        defaultPageSize: 10,
        pageSizeOptions: ["10", "25", "50", "100"],
    },
};

// Create column with common formatting
export const createColumn = (config) => {
    const column = {
        title: config.title,
        dataIndex: config.dataIndex,
        key: config.key || config.dataIndex,
    };

    if (config.sorter) {
        column.sorter = config.sorter;
    }

    if (config.render) {
        column.render = config.render;
    } else if (config.type) {
        column.render = getRenderer(config.type);
    }

    return column;
};

// Get renderer based on type
const getRenderer = (type) => {
    switch (type) {
        case "currency":
            return (value) => (
                <span className="text-green-600 font-medium">
                    {formatCurrency(value)}
                </span>
            );
        case "number":
            return (value) => <span className="font-medium">{value}</span>;
        case "status":
            return (status, record) => (
                <Tag
                    color={getStatusColor(status)}
                    icon={getStatusIcon(status)}
                >
                    {status}
                </Tag>
            );
        default:
            return undefined;
    }
};

// Create table summary
export const createTableSummary = (calculations, className = "bg-gray-50") => {
    return (pageData) => {
        const summaryData = {};
        calculations.forEach((calc) => {
            summaryData[calc.key] = pageData.reduce((sum, item) => {
                return sum + (item[calc.field] || 0);
            }, 0);
        });

        return (
            <Table.Summary.Row className={className}>
                {calculations.map((calc, index) => (
                    <Table.Summary.Cell key={index} colSpan={calc.colSpan || 1}>
                        {calc.render ? calc.render(summaryData) : calc.label}
                    </Table.Summary.Cell>
                ))}
            </Table.Summary.Row>
        );
    };
};

// Common column definitions
export const COMMON_COLUMNS = {
    product: (options = {}) => ({
        title: "Product Name",
        dataIndex: "product_name",
        key: "product_name",
        sorter: (a, b) => a.product_name.localeCompare(b.product_name),
        render: (text, record) => (
            <div>
                <div className="font-medium">{text}</div>
                <div className="text-sm text-gray-500">
                    {record.product_code}
                </div>
            </div>
        ),
        ...options,
    }),
    currency: (dataIndex, title, options = {}) => ({
        title,
        dataIndex,
        key: dataIndex,
        sorter: (a, b) => a[dataIndex] - b[dataIndex],
        render: (value) => (
            <span className="text-green-600 font-medium">
                {formatCurrency(value)}
            </span>
        ),
        ...options,
    }),
    number: (dataIndex, title, options = {}) => ({
        title,
        dataIndex,
        key: dataIndex,
        sorter: (a, b) => a[dataIndex] - b[dataIndex],
        render: (value) => <span className="font-medium">{value}</span>,
        ...options,
    }),
};

export default {
    DEFAULT_TABLE_CONFIG,
    createColumn,
    createTableSummary,
    COMMON_COLUMNS,
};
