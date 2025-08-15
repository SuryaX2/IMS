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
    ShoppingOutlined,
    TeamOutlined,
    DownloadOutlined,
    FileTextOutlined,
} from "@ant-design/icons";
import { api } from "../../api/api";
import toast from "react-hot-toast";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const { Title } = Typography;

const PurchaseReport = () => {
    const [purchaseData, setPurchaseData] = useState({
        purchasesByDate: [],
        purchasesBySupplier: [],
    });
    const [loading, setLoading] = useState(false);
    const [dateRange, setDateRange] = useState([
        dayjs().subtract(30, "day"),
        dayjs(),
    ]);

    useEffect(() => {
        fetchPurchaseReport();
    }, [dateRange]);

    const fetchPurchaseReport = async () => {
        try {
            setLoading(true);
            const params = {};
            if (dateRange && dateRange[0] && dateRange[1]) {
                params.start_date = dateRange[0].format("YYYY-MM-DD");
                params.end_date = dateRange[1].format("YYYY-MM-DD");
            }

            const response = await api.get("/reports/purchases", { params });
            if (response.data.success) {
                setPurchaseData(response.data.data);
                toast.success("Purchase report loaded successfully");
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Failed to fetch purchase report"
            );
            setPurchaseData({
                purchasesByDate: [],
                purchasesBySupplier: [],
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDateRangeChange = (dates) => {
        setDateRange(dates);
    };

    const exportToCSV = () => {
        const headers = [
            "Supplier Name",
            "Shop Name",
            "Total Purchases",
            "Purchase Count",
        ];
        const csvContent = [
            headers.join(","),
            ...purchaseData.purchasesBySupplier.map((row) =>
                [
                    row.supplier_name,
                    row.shopname,
                    row.total_purchases,
                    row.count,
                ].join(",")
            ),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `purchase-report-${dayjs().format("YYYY-MM-DD")}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const formatCurrency = (value) => `₹${value?.toFixed(2) || 0}`;

    const supplierColumns = [
        {
            title: "Supplier Name",
            dataIndex: "supplier_name",
            key: "supplier_name",
            sorter: (a, b) => a.supplier_name.localeCompare(b.supplier_name),
            render: (text, record) => (
                <div>
                    <div className="font-medium">{text}</div>
                    <div className="text-sm text-gray-500">
                        {record.shopname}
                    </div>
                </div>
            ),
        },
        {
            title: "Purchase Count",
            dataIndex: "count",
            key: "count",
            sorter: (a, b) => a.count - b.count,
            render: (count) => <span className="font-medium">{count}</span>,
        },
        {
            title: "Total Purchases",
            dataIndex: "total_purchases",
            key: "total_purchases",
            sorter: (a, b) => a.total_purchases - b.total_purchases,
            render: (total) => (
                <span className="text-blue-600 font-medium">
                    {formatCurrency(total)}
                </span>
            ),
        },
    ];

    // Format data for charts
    const chartData = purchaseData.purchasesByDate.map((item) => ({
        date: dayjs(item._id).format("MMM DD"),
        purchases: item.count,
    }));

    const supplierChartData = purchaseData.purchasesBySupplier
        .slice(0, 10)
        .map((item) => ({
            name:
                item.supplier_name.length > 15
                    ? item.supplier_name.substring(0, 15) + "..."
                    : item.supplier_name,
            purchases: item.total_purchases,
            count: item.count,
        }));

    const totalPurchases = purchaseData.purchasesBySupplier.reduce(
        (sum, item) => sum + item.total_purchases,
        0
    );

    const totalOrders = purchaseData.purchasesBySupplier.reduce(
        (sum, item) => sum + item.count,
        0
    );

    const averagePurchaseValue =
        totalOrders > 0 ? totalPurchases / totalOrders : 0;

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
                            disabled={
                                purchaseData.purchasesBySupplier.length === 0
                            }
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
                    <Col xs={24} sm={12} lg={8}>
                        <Card>
                            <Statistic
                                title="Total Purchase Value"
                                value={totalPurchases}
                                prefix="₹"
                                precision={2}
                                valueStyle={{ color: "#1890ff" }}
                                suffix={<ShoppingOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <Card>
                            <Statistic
                                title="Total Purchase Orders"
                                value={totalOrders}
                                valueStyle={{ color: "#52c41a" }}
                                suffix={<FileTextOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <Card>
                            <Statistic
                                title="Average Purchase Value"
                                value={averagePurchaseValue}
                                prefix="₹"
                                precision={2}
                                valueStyle={{ color: "#fa8c16" }}
                                suffix={<TeamOutlined />}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Purchase Trend Chart */}
                <Card title="Purchase Trend" className="chart-card">
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
                                        value,
                                        "Purchase Orders",
                                    ]}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="purchases"
                                    stroke="#1890ff"
                                    strokeWidth={3}
                                    name="Purchase Orders"
                                    dot={{ fill: "#1890ff", strokeWidth: 2 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <Empty description="No purchase data available for the selected period" />
                    )}
                </Card>

                {/* Purchases by Supplier Table */}
                <Card title="Purchases by Supplier - Detailed View">
                    {purchaseData.purchasesBySupplier.length > 0 ? (
                        <Table
                            columns={supplierColumns}
                            dataSource={purchaseData.purchasesBySupplier}
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
                                const totalCount = pageData.reduce(
                                    (sum, item) => sum + item.count,
                                    0
                                );
                                const totalValue = pageData.reduce(
                                    (sum, item) => sum + item.total_purchases,
                                    0
                                );

                                return (
                                    <Table.Summary.Row className="bg-gray-50">
                                        <Table.Summary.Cell>
                                            <strong>Page Total</strong>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell>
                                            <strong>{totalCount}</strong>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell>
                                            <strong className="text-blue-600">
                                                {formatCurrency(totalValue)}
                                            </strong>
                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                );
                            }}
                        />
                    ) : (
                        <Empty description="No purchase data available for the selected period" />
                    )}
                </Card>
            </Spin>
        </div>
    );
};

export default PurchaseReport;
