import React, { useState, useEffect, useContext } from "react";
import {
    Card,
    DatePicker,
    Button,
    Space,
    Row,
    Col,
    Statistic,
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
} from "recharts";
import {
    CalendarOutlined,
    DollarOutlined,
    ShoppingCartOutlined,
} from "@ant-design/icons";
import { api } from "../../api/api";
import AuthContext from "../../context/AuthContext";
import toast from "react-hot-toast";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const SalesReport = () => {
    const [salesData, setSalesData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dateRange, setDateRange] = useState([
        dayjs().subtract(30, "days"),
        dayjs(),
    ]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchSalesReport();
    }, []);

    const fetchSalesReport = async (startDate, endDate) => {
        try {
            setLoading(true);
            const params = {};

            if (startDate && endDate) {
                params.start_date = startDate.format("YYYY-MM-DD");
                params.end_date = endDate.format("YYYY-MM-DD");
            } else if (dateRange?.length === 2) {
                params.start_date = dateRange[0].format("YYYY-MM-DD");
                params.end_date = dateRange[1].format("YYYY-MM-DD");
            }

            const response = await api.get("/reports/sales", { params });
            if (response.data.success) {
                setSalesData(response.data.data);
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to fetch sales report"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDateRangeChange = (dates) => {
        setDateRange(dates);
        if (dates && dates.length === 2) {
            fetchSalesReport(dates[0], dates[1]);
        }
    };

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
                <span className="font-medium text-green-600">
                    ₹{total.toFixed(2)}
                </span>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            {/* Date Range Filter */}
            <Card title="Filter by Date Range">
                <Space>
                    <RangePicker
                        value={dateRange}
                        onChange={handleDateRangeChange}
                        format="YYYY-MM-DD"
                        allowClear={false}
                    />
                    <Button
                        type="primary"
                        icon={<CalendarOutlined />}
                        onClick={() => fetchSalesReport()}
                        loading={loading}
                    >
                        Generate Report
                    </Button>
                </Space>
            </Card>

            {salesData && (
                <>
                    {/* Summary Cards */}
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} lg={8}>
                            <Card>
                                <Statistic
                                    title="Total Sales"
                                    value={salesData.summary.totalSales}
                                    precision={2}
                                    prefix="₹"
                                    valueStyle={{ color: "#52c41a" }}
                                    suffix={<DollarOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <Card>
                                <Statistic
                                    title="Total Orders"
                                    value={salesData.summary.totalOrders}
                                    valueStyle={{ color: "#1890ff" }}
                                    suffix={<ShoppingCartOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <Card>
                                <Statistic
                                    title="Average Order Value"
                                    value={
                                        salesData.summary.totalOrders > 0
                                            ? salesData.summary.totalSales /
                                              salesData.summary.totalOrders
                                            : 0
                                    }
                                    precision={2}
                                    prefix="₹"
                                    valueStyle={{ color: "#722ed1" }}
                                />
                            </Card>
                        </Col>
                    </Row>

                    {/* Sales by Date Chart */}
                    {salesData.salesByDate?.length > 0 && (
                        <Card title="Sales Trend" className="w-full">
                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart data={salesData.salesByDate}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="_id"
                                        tick={{ fontSize: 12 }}
                                        angle={-45}
                                        textAnchor="end"
                                        height={80}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 12 }}
                                        tickFormatter={(value) => `₹${value}`}
                                        yAxisId="right"
                                    />
                                    <Tooltip
                                        formatter={(value, name) => [
                                            name === "total"
                                                ? `₹${value.toFixed(2)}`
                                                : value,
                                            name === "total"
                                                ? "Sales"
                                                : "Orders",
                                        ]}
                                        labelFormatter={(label) =>
                                            `Date: ${label}`
                                        }
                                    />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="total"
                                        stroke="#52c41a"
                                        strokeWidth={2}
                                        dot={{
                                            fill: "#52c41a",
                                            strokeWidth: 2,
                                            r: 4,
                                        }}
                                        name="Sales Amount"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="orders"
                                        stroke="#1890ff"
                                        strokeWidth={2}
                                        dot={{
                                            fill: "#1890ff",
                                            strokeWidth: 2,
                                            r: 4,
                                        }}
                                        name="Number of Orders"
                                        yAxisId="right"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </Card>
                    )}

                    {/* Top Products Chart */}
                    {salesData.salesByProduct?.length > 0 && (
                        <Card title="Top Selling Products" className="w-full">
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart
                                    data={salesData.salesByProduct.slice(0, 10)}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="product_name"
                                        tick={{ fontSize: 10 }}
                                        angle={-45}
                                        textAnchor="end"
                                        height={120}
                                        interval={0}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 12 }}
                                        tickFormatter={(value) => `₹${value}`}
                                    />
                                    <Tooltip
                                        formatter={(value, name) => [
                                            name === "total"
                                                ? `₹${value.toFixed(2)}`
                                                : value,
                                            name === "total"
                                                ? "Sales"
                                                : "Quantity",
                                        ]}
                                    />
                                    <Legend />
                                    <Bar
                                        dataKey="total"
                                        fill="#52c41a"
                                        name="Sales Amount"
                                        radius={[4, 4, 0, 0]}
                                    />
                                    <Bar
                                        dataKey="quantity"
                                        fill="#1890ff"
                                        name="Quantity Sold"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </Card>
                    )}

                    {/* Sales by Product Table */}
                    {salesData.salesByProduct?.length > 0 && (
                        <Card title="Product Sales Details">
                            <Table
                                columns={productColumns}
                                dataSource={salesData.salesByProduct}
                                rowKey="_id"
                                loading={loading}
                                pagination={{
                                    pageSize: 10,
                                    showSizeChanger: true,
                                    showTotal: (total, range) =>
                                        `${range[0]}-${range[1]} of ${total} items`,
                                }}
                                scroll={{ x: 800 }}
                            />
                        </Card>
                    )}
                </>
            )}

            {!salesData && !loading && (
                <Card>
                    <div className="text-center py-8">
                        <p className="text-gray-500">
                            Select a date range to generate sales report
                        </p>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default SalesReport;
