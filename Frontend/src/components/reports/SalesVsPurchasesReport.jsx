import React, { useState, useEffect } from "react";
import {
    Card,
    Row,
    Col,
    Statistic,
    Button,
    Spin,
    Empty,
    Typography,
    Select,
    Table,
} from "antd";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
    ComposedChart,
} from "recharts";
import {
    CalendarOutlined,
    DollarOutlined,
    ShoppingOutlined,
    DownloadOutlined,
    RiseOutlined,
} from "@ant-design/icons";
import { api } from "../../api/api";
import toast from "react-hot-toast";

const { Title } = Typography;
const { Option } = Select;

const SalesVsPurchasesReport = () => {
    const [reportData, setReportData] = useState({
        period: "monthly",
        data: [],
        summary: {
            totalSales: 0,
            totalPurchases: 0,
            totalProfit: 0,
        },
    });
    const [loading, setLoading] = useState(false);
    const [period, setPeriod] = useState("monthly");
    const [year, setYear] = useState(new Date().getFullYear());

    useEffect(() => {
        fetchReport();
    }, [period, year]);

    const fetchReport = async () => {
        try {
            setLoading(true);
            const params = { period, year };
            
            const response = await api.get("/reports/sales-vs-purchases", { params });
            if (response.data.success) {
                setReportData(response.data.data);
                toast.success("Sales vs Purchases report loaded successfully");
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Failed to fetch sales vs purchases report"
            );
            setReportData({
                period: "monthly",
                data: [],
                summary: {
                    totalSales: 0,
                    totalPurchases: 0,
                    totalProfit: 0,
                },
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePeriodChange = (newPeriod) => {
        setPeriod(newPeriod);
    };

    const handleYearChange = (newYear) => {
        setYear(newYear);
    };

    const exportToCSV = () => {
        const headers = ["Date", "Sales", "Purchases", "Profit"];
        const csvContent = [
            headers.join(","),
            ...reportData.data.map((row) =>
                [row.date, row.sales, row.purchases, row.profit].join(",")
            ),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `sales-vs-purchases-${period}-${year}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const formatCurrency = (value) => `₹${value?.toFixed(2) || 0}`;

    const formatDateLabel = (date) => {
        if (period === "daily") {
            return new Date(date).toLocaleDateString("en-IN", {
                month: "short",
                day: "numeric",
            });
        } else if (period === "monthly") {
            const [year, month] = date.split("-");
            return new Date(year, month - 1).toLocaleDateString("en-IN", {
                month: "short",
                year: "numeric",
            });
        } else if (period === "yearly") {
            return date;
        } else if (period === "weekly") {
            return date;
        }
        return date;
    };

    // Generate year options (current year and 4 years back)
    const yearOptions = [];
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < 5; i++) {
        yearOptions.push(currentYear - i);
    }

    // Format data for charts
    const chartData = reportData.data.map((item) => ({
        ...item,
        dateLabel: formatDateLabel(item.date),
    }));

    const columns = [
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            render: (date) => formatDateLabel(date),
            sorter: (a, b) => a.date.localeCompare(b.date),
        },
        {
            title: "Sales",
            dataIndex: "sales",
            key: "sales",
            render: (sales) => (
                <span className="text-green-600 font-medium">
                    {formatCurrency(sales)}
                </span>
            ),
            sorter: (a, b) => a.sales - b.sales,
        },
        {
            title: "Purchases",
            dataIndex: "purchases",
            key: "purchases",
            render: (purchases) => (
                <span className="text-blue-600 font-medium">
                    {formatCurrency(purchases)}
                </span>
            ),
            sorter: (a, b) => a.purchases - b.purchases,
        },
        {
            title: "Profit",
            dataIndex: "profit",
            key: "profit",
            render: (profit) => (
                <span
                    className={`font-medium ${
                        profit >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                >
                    {formatCurrency(profit)}
                </span>
            ),
            sorter: (a, b) => a.profit - b.profit,
        },
    ];

    return (
        <div className="space-y-6">
            {/* Filters */}
            <Card>
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} sm={12} md={6}>
                        <div className="flex items-center gap-2">
                            <CalendarOutlined />
                            <span className="font-medium">Period:</span>
                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Select
                            value={period}
                            onChange={handlePeriodChange}
                            style={{ width: "100%" }}
                        >
                            <Option value="daily">Daily</Option>
                            <Option value="weekly">Weekly</Option>
                            <Option value="monthly">Monthly</Option>
                            <Option value="yearly">Yearly</Option>
                        </Select>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Select
                            value={year}
                            onChange={handleYearChange}
                            style={{ width: "100%" }}
                            placeholder="Select Year"
                        >
                            {yearOptions.map((yearOption) => (
                                <Option key={yearOption} value={yearOption}>
                                    {yearOption}
                                </Option>
                            ))}
                        </Select>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Button
                            type="primary"
                            icon={<DownloadOutlined />}
                            onClick={exportToCSV}
                            disabled={reportData.data.length === 0}
                            block
                        >
                            Export CSV
                        </Button>
                    </Col>
                </Row>
            </Card>

            <Spin spinning={loading}>
                {/* Summary Statistics */}
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={8}>
                        <Card>
                            <Statistic
                                title="Total Sales"
                                value={reportData.summary.totalSales}
                                prefix="₹"
                                precision={2}
                                valueStyle={{ color: "#52c41a" }}
                                suffix={<DollarOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card>
                            <Statistic
                                title="Total Purchases"
                                value={reportData.summary.totalPurchases}
                                prefix="₹"
                                precision={2}
                                valueStyle={{ color: "#1890ff" }}
                                suffix={<ShoppingOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card>
                            <Statistic
                                title="Total Profit"
                                value={reportData.summary.totalProfit}
                                prefix="₹"
                                precision={2}
                                valueStyle={{
                                    color:
                                        reportData.summary.totalProfit >= 0
                                            ? "#52c41a"
                                            : "#f5222d",
                                }}
                                suffix={<RiseOutlined />}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Combined Chart */}
                <Card title="Sales vs Purchases Trend" className="chart-card">
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={400}>
                            <ComposedChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="dateLabel"
                                    tick={{ fontSize: 12 }}
                                    angle={period === "daily" ? -45 : 0}
                                    textAnchor={period === "daily" ? "end" : "middle"}
                                    height={period === "daily" ? 80 : 60}
                                />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip
                                    formatter={(value, name) => [
                                        formatCurrency(value),
                                        name === "sales"
                                            ? "Sales"
                                            : name === "purchases"
                                            ? "Purchases"
                                            : "Profit",
                                    ]}
                                />
                                <Legend />
                                <Bar
                                    dataKey="sales"
                                    fill="#52c41a"
                                    name="Sales"
                                    opacity={0.7}
                                />
                                <Bar
                                    dataKey="purchases"
                                    fill="#1890ff"
                                    name="Purchases"
                                    opacity={0.7}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="profit"
                                    stroke="#fa8c16"
                                    strokeWidth={3}
                                    name="Profit"
                                    dot={{ fill: "#fa8c16", strokeWidth: 2 }}
                                />
                            </ComposedChart>
                        </ResponsiveContainer>
                    ) : (
                        <Empty description="No data available for the selected period" />
                    )}
                </Card>

                {/* Profit Trend Line Chart */}
                <Card title="Profit Trend" className="chart-card">
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={350}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="dateLabel"
                                    tick={{ fontSize: 12 }}
                                    angle={period === "daily" ? -45 : 0}
                                    textAnchor={period === "daily" ? "end" : "middle"}
                                    height={period === "daily" ? 80 : 60}
                                />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip
                                    formatter={(value) => [
                                        formatCurrency(value),
                                        "Profit",
                                    ]}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="profit"
                                    stroke="#fa8c16"
                                    strokeWidth={3}
                                    name="Profit"
                                    dot={{ fill: "#fa8c16", strokeWidth: 2 }}
                                />
                                {/* Add a zero line for reference */}
                                <Line
                                    type="monotone"
                                    dataKey={() => 0}
                                    stroke="#d9d9d9"
                                    strokeWidth={1}
                                    strokeDasharray="5 5"
                                    name="Break-even"
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <Empty description="No profit data available for the selected period" />
                    )}
                </Card>

                {/* Detailed Data Table */}
                <Card title="Sales vs Purchases - Detailed View">
                    {reportData.data.length > 0 ? (
                        <Table
                            columns={columns}
                            dataSource={reportData.data}
                            rowKey="date"
                            pagination={{
                                showSizeChanger: true,
                                showQuickJumper: true,
                                showTotal: (total, range) =>
                                    `${range[0]}-${range[1]} of ${total} items`,
                                defaultPageSize: 10,
                                pageSizeOptions: ["10", "25", "50"],
                            }}
                            scroll={{ x: 600 }}
                            size="middle"
                            className="custom-table"
                            summary={(pageData) => {
                                const totalSales = pageData.reduce(
                                    (sum, item) => sum + item.sales,
                                    0
                                );
                                const totalPurchases = pageData.reduce(
                                    (sum, item) => sum + item.purchases,
                                    0
                                );
                                const totalProfit = pageData.reduce(
                                    (sum, item) => sum + item.profit,
                                    0
                                );

                                return (
                                    <Table.Summary.Row className="bg-gray-50">
                                        <Table.Summary.Cell>
                                            <strong>Page Total</strong>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell>
                                            <strong className="text-green-600">
                                                {formatCurrency(totalSales)}
                                            </strong>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell>
                                            <strong className="text-blue-600">
                                                {formatCurrency(totalPurchases)}
                                            </strong>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell>
                                            <strong
                                                className={
                                                    totalProfit >= 0
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                }
                                            >
                                                {formatCurrency(totalProfit)}
                                            </strong>
                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                );
                            }}
                        />
                    ) : (
                        <Empty description="No data available for the selected period" />
                    )}
                </Card>
            </Spin>
        </div>
    );
};

export default SalesVsPurchasesReport;