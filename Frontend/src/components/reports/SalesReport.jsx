import React, { useState, useEffect } from "react";
import {
    Card,
    DatePicker,
    Row,
    Col,
    Statistic,
    Table,
    Button,
    Spin,
    Empty,
    Typography,
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
} from "recharts";
import {
    CalendarOutlined,
    DollarOutlined,
    ShoppingCartOutlined,
    DownloadOutlined,
    TrendingUpOutlined,
} from "@ant-design/icons";
import { api } from "../../api/api";
import toast from "react-hot-toast";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const { Title } = Typography;

const SalesReport = () => {
    const [salesData, setSalesData] = useState({
        salesByDate: [],
        salesByProduct: [],
        summary: { totalSales: 0, totalOrders: 0 },
    });
    const [loading, setLoading] = useState(false);
    const [dateRange, setDateRange] = useState([
        dayjs().subtract(30, "day"),
        dayjs(),
    ]);

    useEffect(() => {
        fetchSalesReport();
    }, [dateRange]);

    const fetchSalesReport = async () => {
        try {
            setLoading(true);
            const params = {};
            if (dateRange && dateRange[0] && dateRange[1]) {
                params.start_date = dateRange[0].format("YYYY-MM-DD");
                params.end_date = dateRange[1].format("YYYY-MM-DD");
            }

            const response = await api.get("/reports/sales", { params });
            if (response.data.success) {
                setSalesData(response.data.data);
                toast.success("Sales report loaded successfully");
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to fetch sales report"
            );
            setSalesData({
                salesByDate: [],
                salesByProduct: [],
                summary: { totalSales: 0, totalOrders: 0 },
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDateRangeChange = (dates) => {
        setDateRange(dates);
    };

    const exportToCSV = () => {
        const headers = ["Product Name", "Quantity Sold", "Total Sales"];
        const csvContent = [
            headers.join(","),
            ...salesData.salesByProduct.map((row) =>
                [row.product_name, row.quantity, row.total].join(",")
            ),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `sales-report-${dayjs().format("YYYY-MM-DD")}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const formatCurrency = (value) => `₹${value?.toFixed(2) || 0}`;

    const productColumns = [
        {
            title: "Product Name",
            dataIndex: "product_name",
            key: "product_name",
            sorter: (a, b) => a.product_name.localeCompare(b.product_name),
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
    ];

    // Format data for charts
    const chartData = salesData.salesByDate.map((item) => ({
        date: dayjs(item._id).format("MMM DD"),
        sales: item.total,
        orders: item.orders,
    }));

    const productChartData = salesData.salesByProduct
        .slice(0, 10)
        .map((item) => ({
            name:
                item.product_name.length > 15
                    ? item.product_name.substring(0, 15) + "..."
                    : item.product_name,
            sales: item.total,
            quantity: item.quantity,
        }));

    const averageSales =
        salesData.salesByDate.length > 0
            ? salesData.summary.totalSales / salesData.salesByDate.length
            : 0;

    return (
        <div className="space-y-6">
            {/* Date Range Filter */}
            <Card>
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} sm={12} md={8}>
                        <div className="flex items-center gap-2">
                            <CalendarOutlined />
                            <span className="font-medium">
                                Select Date Range:
                            </span>
                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={10}>
                        <RangePicker
                            value={dateRange}
                            onChange={handleDateRangeChange}
                            format="YYYY-MM-DD"
                            style={{ width: "100%" }}
                            allowClear={false}
                        />
                    </Col>
                    <Col xs={24} sm={24} md={6}>
                        <Button
                            type="primary"
                            icon={<DownloadOutlined />}
                            onClick={exportToCSV}
                            disabled={salesData.salesByProduct.length === 0}
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
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic
                                title="Total Sales"
                                value={salesData.summary.totalSales}
                                prefix="₹"
                                precision={2}
                                valueStyle={{ color: "#52c41a" }}
                                suffix={<DollarOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic
                                title="Total Orders"
                                value={salesData.summary.totalOrders}
                                valueStyle={{ color: "#1890ff" }}
                                suffix={<ShoppingCartOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic
                                title="Average Daily Sales"
                                value={averageSales}
                                prefix="₹"
                                precision={2}
                                valueStyle={{ color: "#fa8c16" }}
                                suffix={<TrendingUpOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic
                                title="Average Order Value"
                                value={
                                    salesData.summary.totalOrders > 0
                                        ? salesData.summary.totalSales /
                                          salesData.summary.totalOrders
                                        : 0
                                }
                                prefix="₹"
                                precision={2}
                                valueStyle={{ color: "#722ed1" }}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Sales Trend Chart */}
                <Card title="Sales Trend" className="chart-card">
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={350}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 12 }}
                                    angle={-45}
                                    textAnchor="end"
                                    height={60}
                                />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip
                                    formatter={(value, name) => [
                                        name === "sales"
                                            ? formatCurrency(value)
                                            : value,
                                        name === "sales" ? "Sales" : "Orders",
                                    ]}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="sales"
                                    stroke="#52c41a"
                                    strokeWidth={3}
                                    name="Sales"
                                    dot={{ fill: "#52c41a", strokeWidth: 2 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="orders"
                                    stroke="#1890ff"
                                    strokeWidth={2}
                                    name="Orders"
                                    dot={{ fill: "#1890ff", strokeWidth: 2 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <Empty description="No sales data available for the selected period" />
                    )}
                </Card>

                {/* Top Products Chart */}
                <Card title="Top Selling Products" className="chart-card">
                    {productChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart
                                data={productChartData}
                                layout="horizontal"
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" tick={{ fontSize: 12 }} />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    tick={{ fontSize: 11 }}
                                    width={120}
                                />
                                <Tooltip
                                    formatter={(value, name) => [
                                        name === "sales"
                                            ? formatCurrency(value)
                                            : value,
                                        name === "sales" ? "Sales" : "Quantity",
                                    ]}
                                />
                                <Legend />
                                <Bar
                                    dataKey="sales"
                                    fill="#52c41a"
                                    name="Sales"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <Empty description="No product sales data available" />
                    )}
                </Card>

                {/* Sales by Product Table */}
                <Card title="Sales by Product - Detailed View">
                    {salesData.salesByProduct.length > 0 ? (
                        <Table
                            columns={productColumns}
                            dataSource={salesData.salesByProduct}
                            rowKey="_id"
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
                                const totalQuantity = pageData.reduce(
                                    (sum, item) => sum + item.quantity,
                                    0
                                );
                                const totalSales = pageData.reduce(
                                    (sum, item) => sum + item.total,
                                    0
                                );

                                return (
                                    <Table.Summary.Row className="bg-gray-50">
                                        <Table.Summary.Cell>
                                            <strong>Page Total</strong>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell>
                                            <strong>{totalQuantity}</strong>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell>
                                            <strong className="text-green-600">
                                                {formatCurrency(totalSales)}
                                            </strong>
                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                );
                            }}
                        />
                    ) : (
                        <Empty description="No sales data available for the selected period" />
                    )}
                </Card>
            </Spin>
        </div>
    );
};

export default SalesReport;
