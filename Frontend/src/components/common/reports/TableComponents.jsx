import React from "react";
import { Tag, Avatar } from "antd";
import {
    CheckCircleOutlined,
    WarningOutlined,
    CloseCircleOutlined,
    InboxOutlined,
    TrophyOutlined,
    ShoppingOutlined,
} from "@ant-design/icons";
import { formatCurrency } from "../../../utils/reports/reportUtils";

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
        "In Stock": () => <CheckCircleOutlined />,
        "Low Stock": () => <WarningOutlined />,
        "Out of Stock": () => <CloseCircleOutlined />,
    };
    const IconComponent = icons[status] || (() => <InboxOutlined />);
    return <IconComponent />;
};

// JSX Render functions
export const renderProductName = (text, record) => (
    <div>
        <div className="font-medium">{text}</div>
        <div className="text-sm text-gray-500">{record.product_code}</div>
    </div>
);

export const renderSupplierName = (text, record) => (
    <div>
        <div className="font-medium">{text}</div>
        <div className="text-sm text-gray-500">{record.shopname}</div>
    </div>
);

export const renderQuantity = (quantity) => (
    <span className="font-medium">{quantity}</span>
);

export const renderStock = (stock) => (
    <span className={stock < 10 ? "text-red-500 font-medium" : ""}>
        {stock}
    </span>
);

export const renderTotalSales = (total) => (
    <span className="text-green-600 font-medium">{formatCurrency(total)}</span>
);

export const renderTotalPurchases = (total) => (
    <span className="text-blue-600 font-medium">{formatCurrency(total)}</span>
);

export const renderQuantitySold = (quantity) => (
    <span className="font-medium text-blue-600">{quantity}</span>
);

export const renderStatus = (status) => (
    <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
        {status}
    </Tag>
);

export const renderRank = (_, __, index) => (
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
);

export const renderTopProduct = (_, record) => (
    <div className="flex items-center gap-3">
        {record.product_image ? (
            <Avatar src={record.product_image} size={40} />
        ) : (
            <Avatar
                icon={<ShoppingOutlined />}
                size={40}
                style={{
                    backgroundColor: "#f0f0f0",
                    color: "#666",
                }}
            />
        )}
        <div>
            <div className="font-medium">{record.product_name}</div>
            <div className="text-sm text-gray-500">{record.product_code}</div>
        </div>
    </div>
);

export const renderSummaryCell = (field, value, className = "") => (
    <strong className={className}>
        {[
            "total",
            "sales",
            "purchases",
            "value",
            "buying_price",
            "selling_price",
            "inventory_value",
        ].some((cf) => field.includes(cf))
            ? formatCurrency(value)
            : value}
    </strong>
);
