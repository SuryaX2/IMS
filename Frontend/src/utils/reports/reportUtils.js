import dayjs from "dayjs";
import {
    DollarOutlined,
    ShoppingCartOutlined,
    ShoppingOutlined,
    RiseOutlined,
    TrophyOutlined,
    InboxOutlined,
    WarningOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    FileTextOutlined,
    TeamOutlined,
    StarOutlined,
} from "@ant-design/icons";

// Currency formatting
export const formatCurrency = (value) => `₹${value?.toFixed(2) || 0}`;

// Date formatting for charts
export const formatDateForChart = (date) => dayjs(date).format("MMM DD");

// Chart data transformation
export const transformChartData = (data, config) => {
    return data.map((item) => {
        const transformed = {};

        Object.keys(config).forEach((key) => {
            const mapping = config[key];
            if (mapping.source) {
                transformed[key] = item[mapping.source];
            }
            if (mapping.transform) {
                transformed[key] = mapping.transform(item);
            }
        });

        return transformed;
    });
};

// Statistics calculations
export const calculateStats = (data, calculations) => {
    const stats = {};

    calculations.forEach((calc) => {
        switch (calc.type) {
            case "sum":
                stats[calc.key] = data.reduce(
                    (sum, item) => sum + (item[calc.field] || 0),
                    0
                );
                break;
            case "count":
                stats[calc.key] = data.length;
                break;
            case "average":
                const total = data.reduce(
                    (sum, item) => sum + (item[calc.field] || 0),
                    0
                );
                stats[calc.key] = data.length > 0 ? total / data.length : 0;
                break;
            case "max":
                stats[calc.key] = Math.max(
                    ...data.map((item) => item[calc.field] || 0)
                );
                break;
            case "min":
                stats[calc.key] = Math.min(
                    ...data.map((item) => item[calc.field] || 0)
                );
                break;
            default:
                if (calc.calculate) {
                    stats[calc.key] = calc.calculate(data);
                }
        }
    });

    return stats;
};

// Status utilities
export const getStatusColor = (status) => {
    const statusColors = {
        "In Stock": "green",
        "Low Stock": "orange",
        "Out of Stock": "red",
        active: "green",
        inactive: "red",
        pending: "orange",
        completed: "green",
        cancelled: "red",
    };
    return statusColors[status] || "default";
};

export const getStatusIcon = (status) => {
    const statusIcons = {
        "In Stock": CheckCircleOutlined,
        "Low Stock": WarningOutlined,
        "Out of Stock": CloseCircleOutlined,
    };
    return statusIcons[status] || InboxOutlined;
};

// Icon mappings for statistics
export const getStatisticIcon = (type) => {
    const icons = {
        sales: DollarOutlined,
        orders: ShoppingCartOutlined,
        purchases: ShoppingOutlined,
        products: InboxOutlined,
        average: RiseOutlined,
        total: TrophyOutlined,
        count: FileTextOutlined,
        value: TeamOutlined,
        rating: StarOutlined,
    };
    return icons[type] || InboxOutlined;
};

// Create statistics configuration
export const createStatisticsConfig = (stats, config) => {
    return config.map((item) => ({
        title: item.title,
        value: stats[item.key] || 0,
        prefix: item.prefix,
        suffix: item.suffix || getStatisticIcon(item.iconType),
        precision: item.precision,
        valueStyle: { color: item.color },
        span: item.span,
    }));
};

// Truncate text for display
export const truncateText = (text, maxLength = 15) => {
    if (!text) return "";
    return text.length > maxLength
        ? text.substring(0, maxLength) + "..."
        : text;
};

// Format data for table summary
export const createTableSummary = (pageData, summaryConfig) => {
    const summaryData = {};

    summaryConfig.calculations?.forEach((calc) => {
        summaryData[calc.key] = pageData.reduce((sum, item) => {
            return sum + (item[calc.field] || 0);
        }, 0);
    });

    return summaryData;
};

// Default date range (last 30 days)
export const getDefaultDateRange = (days = 30) => [
    dayjs().subtract(days, "day"),
    dayjs(),
];

// Format date range for API params
export const formatDateRangeForAPI = (dateRange) => {
    if (!dateRange || !dateRange[0] || !dateRange[1]) return {};

    return {
        start_date: dateRange[0].format("YYYY-MM-DD"),
        end_date: dateRange[1].format("YYYY-MM-DD"),
    };
};

// Chart color schemes
export const CHART_COLORS = {
    primary: "#1890ff",
    success: "#52c41a",
    warning: "#fa8c16",
    danger: "#f5222d",
    purple: "#722ed1",
    cyan: "#13c2c2",
};

// Common chart configurations
export const getLineChartConfig = (lines) => ({
    chartType: "line",
    lines: lines.map((line) => ({
        dataKey: line.dataKey,
        stroke: CHART_COLORS[line.color] || line.stroke,
        strokeWidth: line.strokeWidth || 2,
        name: line.name,
        formatter: line.formatter,
        dotStrokeWidth: 2,
    })),
});

export const getBarChartConfig = (bars) => ({
    chartType: "bar",
    bars: bars.map((bar) => ({
        dataKey: bar.dataKey,
        fill: CHART_COLORS[bar.color] || bar.fill,
        name: bar.name,
        formatter: bar.formatter,
        radius: [4, 4, 0, 0],
    })),
});

// API endpoints
export const REPORT_ENDPOINTS = {
    sales: "/reports/sales",
    purchases: "/reports/purchases",
    stock: "/reports/stock",
    topProducts: "/reports/top-products",
    categories: "/categories/user",
};
