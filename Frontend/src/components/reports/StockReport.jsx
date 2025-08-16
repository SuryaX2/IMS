import React, { useState, useEffect } from "react";
import { Card, Spin, Alert } from "antd";

// Hooks
import useReportData from "../../hooks/reports/useReportData";
import useTableFilters from "../../hooks/reports/useTableFilters";
import useExportCSV from "../../hooks/reports/useExportCSV";

// Utils
import {
    calculateStats,
    createStatisticsConfig,
    getStatusColor,
    getStatusIcon,
} from "../../utils/reports/reportUtils";
import {
    createTableConfig,
    getTableProps,
    createTableSummary,
} from "../../utils/reports/tableUtils";
import { EXPORT_CONFIGS } from "../../utils/reports/exportUtils";

// Components
import StatisticsCards from "../common/reports/StatisticsCards";
import FilterControls from "../common/reports/FilterControls";
import ReportTable from "../common/reports/ReportTable";

const StockReport = () => {
    const [categories, setCategories] = useState([]);

    // Fetch stock data
    const {
        data: stockData = [],
        loading,
        refetch,
    } = useReportData("/reports/stock");

    // Export functionality
    const { exportCustomCSV } = useExportCSV();

    // Filter configuration
    const filterConfig = [
        {
            key: "status",
            placeholder: "Filter by status",
            allowClear: true,
            options: [
                { label: "In Stock", value: "In Stock" },
                { label: "Low Stock", value: "Low Stock" },
                { label: "Out of Stock", value: "Out of Stock" },
            ],
        },
        {
            key: "category",
            placeholder: "Filter by category",
            allowClear: true,
            options: categories.map((cat) => ({
                label: cat.category_name,
                value: cat.category_name,
            })),
        },
    ];

    // Table filters
    const {
        filteredData,
        searchText,
        filters,
        handleSearchChange,
        handleFilterChange,
        resetFilters,
        getActiveFiltersCount,
    } = useTableFilters(stockData, filterConfig);

    // Fetch categories for filter
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { api } = await import("../../api/api");
                const response = await api.get("/categories/user");
                if (response.data.success) {
                    setCategories(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };
        fetchCategories();
    }, []);

    // Calculate statistics
    const stats = calculateStats(stockData, [
        { key: "totalProducts", type: "count" },
        {
            key: "inStock",
            type: "count",
            calculate: (data) =>
                data.filter((item) => item.status === "In Stock").length,
        },
        {
            key: "lowStock",
            type: "count",
            calculate: (data) =>
                data.filter((item) => item.status === "Low Stock").length,
        },
        {
            key: "outOfStock",
            type: "count",
            calculate: (data) =>
                data.filter((item) => item.status === "Out of Stock").length,
        },
        { key: "totalValue", type: "sum", field: "inventory_value" },
    ]);

    // Statistics configuration
    const statisticsConfig = createStatisticsConfig(stats, [
        {
            key: "totalProducts",
            title: "Total Products",
            iconType: "products",
            color: "#1890ff",
        },
        {
            key: "inStock",
            title: "In Stock",
            iconType: "products",
            color: "#52c41a",
        },
        {
            key: "lowStock",
            title: "Low Stock",
            iconType: "products",
            color: "#fa8c16",
        },
        {
            key: "outOfStock",
            title: "Out of Stock",
            iconType: "products",
            color: "#f5222d",
        },
        {
            key: "totalValue",
            title: "Total Inventory Value",
            prefix: "₹",
            precision: 2,
            iconType: "value",
            color: "#722ed1",
            span: 24,
        },
    ]);

    // Export handler
    const handleExport = () => {
        exportCustomCSV(filteredData, EXPORT_CONFIGS.stock, "stock-report");
    };

    // Filter actions
    const filterActions = [
        {
            label: "Export CSV",
            icon: "DownloadOutlined",
            onClick: handleExport,
            disabled: filteredData.length === 0,
            type: "primary",
        },
    ];

    // Table configuration
    const tableConfig = createTableConfig("stock");

    return (
        <div className="space-y-6">
            {/* Statistics Cards */}
            <StatisticsCards statistics={statisticsConfig} />

            {/* Alerts for low and out of stock */}
            {stats.lowStock > 0 && (
                <Alert
                    message={`Warning: ${stats.lowStock} products are running low on stock!`}
                    type="warning"
                    showIcon
                />
            )}

            {stats.outOfStock > 0 && (
                <Alert
                    message={`Critical: ${stats.outOfStock} products are out of stock!`}
                    type="error"
                    showIcon
                />
            )}

            {/* Filter Controls */}
            <FilterControls
                searchText={searchText}
                onSearchChange={handleSearchChange}
                filters={filterConfig.map((config) => ({
                    ...config,
                    value: filters[config.key],
                }))}
                onFilterChange={handleFilterChange}
                onRefresh={refetch}
                actions={filterActions}
            />

            {/* Stock Table */}
            <Card title="Stock Report - Detailed View">
                <Spin spinning={loading}>
                    <ReportTable
                        {...getTableProps("stock")}
                        columns={tableConfig.columns}
                        dataSource={filteredData}
                        loading={loading}
                        summary={(pageData) =>
                            createTableSummary(
                                pageData,
                                tableConfig.summaryFields,
                                "stock"
                            )
                        }
                        emptyDescription="No stock data available"
                    />
                </Spin>
            </Card>
        </div>
    );
};

export default StockReport;
