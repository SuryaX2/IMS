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
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import {
    CalendarOutlined,
    ShoppingOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { api } from "../../api/api";
import AuthContext from "../../context/AuthContext";
import toast from "react-hot-toast";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const PurchaseReport = () => {
    const [purchaseData, setPurchaseData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dateRange, setDateRange] = useState([
        dayjs().subtract(30, "days"),
        dayjs(),
    ]);
    const { user } = useContext(AuthContext);

    const COLORS = [
        "#0088FE",
        "#00C49F",
        "#FFBB28",
        "#FF8042",
        "#8884d8",
        "#82ca9d",
        "#ffc658",
        "#ff7300",
    ];

    useEffect(() => {
        fetchPurchaseReport();
    }, []);

    const fetchPurchaseReport = async (startDate, endDate) => {
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

            const response = await api.get("/reports/purchases", { params });
            if (response.data.success) {
                setPurchaseData(response.data.data);
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Failed to fetch purchase report"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDateRangeChange = (dates) => {
        setDateRange(dates);
        if (dates && dates.length === 2) {
            fetchPurchaseReport(dates[0], dates[1]);
        }
    };

    const supplierColumns = [
        {
            title: "Supplier Name",
            dataIndex: "supplier_name",
            key: "supplier_name",
            sorter: (a, b) => a.supplier_name.localeCompare(b.supplier_name),
        },
        {
            title: "Shop Name",
            dataIndex: "shopname",
            key: "shopname",
            sorter: (a, b) =>
                (a.shopname || "").localeCompare(b.shopname || ""),
            render: (shopname) => shopname || "N/A",
        },
        {
            title: "Total Purchases",
            dataIndex: "total_purchases",
            key: "total_purchases",
            sorter: (a, b) => a.total_purchases - b.total_purchases,
            render: (total) => (
                <span className="font-medium text-green-600">
                    ₹{total.toFixed(2)}
                </span>
            ),
        },
        {
            title: "Purchase Count",
            dataIndex: "count",
            key: "count",
            sorter: (a, b) => a.count - b.count,
            render: (count) => <span className="font-medium">{count}</span>,
        },
    ];

    const calculateSummary = () => {
        if (!purchaseData)
            return {
                totalPurchases: 0,
                totalSuppliers: 0,
                totalTransactions: 0,
            };

        const totalPurchases =
            purchaseData.purchasesBySupplier?.reduce(
                (sum, item) => sum + item.total_purchases,
                0
            ) || 0;
        const totalSuppliers = purchaseData.purchasesBySupplier?.length || 0;
        const totalTransactions =
            purchaseData.purchasesBySupplier?.reduce(
                (sum, item) => sum + item.count,
                0
            ) || 0;

        return { totalPurchases, totalSuppliers, totalTransactions };
    };

    const summary = calculateSummary();

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
                        onClick={() => fetchPurchaseReport()}
                        loading={loading}
                    >
                        Generate Report
                    </Button>
                </Space>
            </Card>

            {purchaseData && (
                <>
                    {/* Summary Cards */}
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={8} lg={8}>
                            <Card>
                                <Statistic
                                    title="Total Purchases"
                                    value={summary.totalPurchases}
                                    precision={2}
                                    prefix="₹"
                                    valueStyle={{ color: "#52c41a" }}
                                    suffix={<ShoppingOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={8} lg={8}>
                            <Card>
                                <Statistic
                                    title="Total Suppliers"
                                    value={summary.totalSuppliers}
                                    valueStyle={{ color: "#1890ff" }}
                                    suffix={<UserOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={8} lg={8}>
                            <Card>
                                <Statistic
                                    title="Total Transactions"
                                    value={summary.totalTransactions}
                                    valueStyle={{ color: "#722ed1" }}
                                />
                            </Card>
                        </Col>
                    </Row>

                    {/* Purchases by Date Chart */}
                    {purchaseData.purchasesByDate?.length > 0 && (
                        <Card title="Purchase Trend by Date" className="w-full">
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart data={purchaseData.purchasesByDate}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="_id"
                                        tick={{ fontSize: 12 }}
                                        angle={-45}
                                        textAnchor="end"
                                        height={80}
                                    />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip
                                        formatter={(value, name) => [
                                            value,
                                            name === "count"
                                                ? "Purchases"
                                                : name,
                                        ]}
                                        labelFormatter={(label) =>
                                            `Date: ${label}`
                                        }
                                    />
                                    <Legend />
                                    <Bar
                                        dataKey="count"
                                        fill="#1890ff"
                                        name="Number of Purchases"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </Card>
                    )}

                    {/* Top Suppliers Bar Chart */}
                    {purchaseData.purchasesBySupplier?.length > 0 && (
                        <Card
                            title="Top Suppliers by Purchase Value"
                            className="h-full"
                        >
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart
                                    data={purchaseData.purchasesBySupplier.slice(
                                        0,
                                        8
                                    )}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="supplier_name"
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
                                            name === "total_purchases"
                                                ? `₹${value.toFixed(2)}`
                                                : value,
                                            name === "total_purchases"
                                                ? "Total Purchases"
                                                : "Purchase Count",
                                        ]}
                                    />
                                    <Legend />
                                    <Bar
                                        dataKey="total_purchases"
                                        fill="#52c41a"
                                        name="Purchase Amount"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </Card>
                    )}

                    {/* Supplier Details Table */}
                    {purchaseData.purchasesBySupplier?.length > 0 && (
                        <Card title="Supplier Purchase Details">
                            <Table
                                columns={supplierColumns}
                                dataSource={purchaseData.purchasesBySupplier}
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

            {!purchaseData && !loading && (
                <Card>
                    <div className="text-center py-8">
                        <p className="text-gray-500">
                            Select a date range to generate purchase report
                        </p>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default PurchaseReport;
