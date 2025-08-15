import dayjs from "dayjs";

// CSV Export utility
export const exportToCSV = (data, headers, filename) => {
    if (!data || data.length === 0) {
        console.warn("No data to export");
        return false;
    }

    try {
        // Create CSV content
        const csvContent = createCSVContent(data, headers);

        // Download file
        downloadCSVFile(csvContent, filename);
        return true;
    } catch (error) {
        console.error("Export failed:", error);
        return false;
    }
};

// Create CSV content from data
const createCSVContent = (data, headers) => {
    const csvRows = [];

    // Add headers
    csvRows.push(headers.join(","));

    // Add data rows
    data.forEach((row) => {
        const values = headers.map((header) => {
            const value = getValueByPath(row, header);
            return formatCSVValue(value);
        });
        csvRows.push(values.join(","));
    });

    return csvRows.join("\n");
};

// Get value by path (supports nested objects)
const getValueByPath = (obj, path) => {
    return path.split(".").reduce((current, key) => {
        return current && current[key] !== undefined ? current[key] : "";
    }, obj);
};

// Format value for CSV (handle commas, quotes, etc.)
const formatCSVValue = (value) => {
    if (value === null || value === undefined) return "";

    const stringValue = String(value);

    // If value contains comma, newline, or quote, wrap in quotes and escape quotes
    if (
        stringValue.includes(",") ||
        stringValue.includes("\n") ||
        stringValue.includes('"')
    ) {
        return `"${stringValue.replace(/"/g, '""')}"`;
    }

    return stringValue;
};

// Download CSV file
const downloadCSVFile = (content, filename) => {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = generateFilename(filename);
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};

// Generate filename with timestamp
const generateFilename = (baseName) => {
    const timestamp = dayjs().format("YYYY-MM-DD-HHmm");
    return `${baseName}-${timestamp}.csv`;
};

// Export with custom mapping
export const exportWithMapping = (data, mappingConfig, filename) => {
    if (!data || data.length === 0) return false;

    const transformedData = data.map((item) => {
        const transformed = {};
        Object.entries(mappingConfig).forEach(([key, config]) => {
            if (typeof config === "string") {
                // Simple field mapping
                transformed[key] = item[config];
            } else if (typeof config === "function") {
                // Custom transformation
                transformed[key] = config(item);
            } else if (config.field) {
                // Complex mapping with formatting
                let value = item[config.field];
                if (config.format) {
                    value = config.format(value);
                }
                transformed[key] = value;
            }
        });
        return transformed;
    });

    const headers = Object.keys(mappingConfig);
    return exportToCSV(transformedData, headers, filename);
};

// Common export configurations
export const EXPORT_CONFIGS = {
    sales: {
        "Product Name": "product_name",
        "Quantity Sold": "quantity",
        "Total Sales": (item) => `₹${item.total?.toFixed(2) || 0}`,
        Date: (item) => dayjs(item.date).format("YYYY-MM-DD"),
    },
    purchases: {
        "Supplier Name": "supplier_name",
        "Shop Name": "shopname",
        "Total Purchases": (item) =>
            `₹${item.total_purchases?.toFixed(2) || 0}`,
        "Purchase Count": "count",
    },
    stock: {
        "Product Name": "product_name",
        "Product Code": "product_code",
        Category: "category_name",
        Unit: "unit_name",
        Stock: "stock",
        "Buying Price": (item) => `₹${item.buying_price?.toFixed(2) || 0}`,
        "Selling Price": (item) => `₹${item.selling_price?.toFixed(2) || 0}`,
        "Inventory Value": (item) =>
            `₹${item.inventory_value?.toFixed(2) || 0}`,
        Status: "status",
    },
    topProducts: {
        "Product Name": "product_name",
        "Product Code": "product_code",
        "Quantity Sold": "quantity_sold",
        "Total Sales": (item) => `₹${item.total_sales?.toFixed(2) || 0}`,
    },
};

// Quick export functions for common reports
export const exportSalesReport = (data, filename = "sales-report") => {
    return exportWithMapping(data, EXPORT_CONFIGS.sales, filename);
};

export const exportPurchasesReport = (data, filename = "purchase-report") => {
    return exportWithMapping(data, EXPORT_CONFIGS.purchases, filename);
};

export const exportStockReport = (data, filename = "stock-report") => {
    return exportWithMapping(data, EXPORT_CONFIGS.stock, filename);
};

export const exportTopProductsReport = (
    data,
    filename = "top-products-report"
) => {
    return exportWithMapping(data, EXPORT_CONFIGS.topProducts, filename);
};

// Bulk export multiple sheets (future enhancement)
export const exportMultipleSheets = (sheets, filename) => {
    // This would require additional library like xlsx
    // For now, export as separate CSV files
    sheets.forEach((sheet, index) => {
        const sheetFilename = `${filename}-${sheet.name || index + 1}`;
        exportToCSV(sheet.data, sheet.headers, sheetFilename);
    });
};
