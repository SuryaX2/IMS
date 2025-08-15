import dayjs from "dayjs";

// Chart color palette
export const CHART_COLORS = {
    primary: "#1890ff",
    success: "#52c41a",
    warning: "#fa8c16",
    danger: "#f5222d",
    purple: "#722ed1",
    cyan: "#13c2c2",
    gold: "#faad14",
    lime: "#a0d911",
    volcano: "#fa541c",
    magenta: "#eb2f96",
};

export const COLOR_ARRAY = Object.values(CHART_COLORS);

// Format data for line charts
export const formatLineChartData = (data, config) => {
    return data.map((item) => ({
        ...item,
        [config.xAxis]: config.formatX
            ? config.formatX(item[config.xAxis])
            : item[config.xAxis],
    }));
};

// Format data for bar charts
export const formatBarChartData = (
    data,
    maxItems = 10,
    nameField = "name",
    maxLength = 15
) => {
    return data.slice(0, maxItems).map((item) => ({
        ...item,
        [nameField]: truncateText(item[nameField], maxLength),
    }));
};

// Truncate text for chart labels
export const truncateText = (text, maxLength = 15) => {
    if (!text) return "";
    return text.length > maxLength
        ? text.substring(0, maxLength) + "..."
        : text;
};

// Format date for chart x-axis
export const formatChartDate = (date, format = "MMM DD") => {
    return dayjs(date).format(format);
};

// Currency formatter for tooltips
export const formatCurrencyTooltip = (value, name) => [
    `₹${value?.toFixed(2) || 0}`,
    name,
];

// Number formatter for tooltips
export const formatNumberTooltip = (value, name) => [
    value?.toLocaleString() || 0,
    name,
];

// Generate line chart configuration
export const createLineConfig = (lines) => ({
    lines: lines.map((line, index) => ({
        dataKey: line.dataKey,
        stroke:
            CHART_COLORS[line.color] || COLOR_ARRAY[index % COLOR_ARRAY.length],
        strokeWidth: line.strokeWidth || 2,
        name: line.name,
        formatter: line.formatter || formatNumberTooltip,
        dotStrokeWidth: 2,
    })),
});

// Generate bar chart configuration
export const createBarConfig = (bars) => ({
    bars: bars.map((bar, index) => ({
        dataKey: bar.dataKey,
        fill:
            CHART_COLORS[bar.color] || COLOR_ARRAY[index % COLOR_ARRAY.length],
        name: bar.name,
        formatter: bar.formatter || formatNumberTooltip,
        radius: [4, 4, 0, 0],
    })),
});

// Common chart props
export const getCommonChartProps = () => ({
    height: 350,
    xAxisKey: "date",
    emptyDescription: "No data available for the selected period",
});

// Responsive chart container props
export const getResponsiveProps = (height = 350) => ({
    width: "100%",
    height,
});

// Generate color for index
export const getColorByIndex = (index) => {
    return COLOR_ARRAY[index % COLOR_ARRAY.length];
};

// Chart axis configuration
export const getXAxisConfig = (rotateLabels = false) => ({
    tick: { fontSize: 12 },
    angle: rotateLabels ? -45 : 0,
    textAnchor: rotateLabels ? "end" : "middle",
    height: rotateLabels ? 80 : 60,
});

export const getYAxisConfig = () => ({
    tick: { fontSize: 12 },
});

// Tooltip configuration
export const getTooltipConfig = (formatter) => ({
    formatter: formatter || formatNumberTooltip,
});

// Legend configuration
export const getLegendConfig = () => ({
    // Default legend props
});

// Grid configuration
export const getGridConfig = () => ({
    strokeDasharray: "3 3",
});

// Process data for trend analysis
export const processTrendData = (data, dateField, valueFields) => {
    return data.map((item) => {
        const processed = {
            date: formatChartDate(item[dateField]),
            originalDate: item[dateField],
        };

        valueFields.forEach((field) => {
            processed[field] = item[field] || 0;
        });

        return processed;
    });
};

// Calculate percentage change
export const calculatePercentageChange = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
};

// Format percentage
export const formatPercentage = (value, decimals = 1) => {
    return `${value.toFixed(decimals)}%`;
};
