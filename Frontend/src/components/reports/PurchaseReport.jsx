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
    FileExcelOutlined,
    FileTextOutlined,
} from "@ant-design/icons";
import { api } from "../../api/api";
import AuthContext from "../../context/AuthContext";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import StatCard from "../dashboard/StatCard";

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

    const exportToCSV = () => {
        if (!purchaseData) {
            toast.error("No data to export");
            return;
        }

        // Prepare CSV data
        const csvData = [];

        // Add summary
        csvData.push(["Purchase Report Summary"]);
        const summary = calculateSummary();
        csvData.push([
            "Total Purchases",
            `₹${summary.totalPurchases.toFixed(2)}`,
        ]);
        csvData.push(["Total Suppliers", summary.totalSuppliers]);
        csvData.push(["Total Transactions", summary.totalTransactions]);
        csvData.push([""]);

        // Add purchases by date
        csvData.push(["Purchases by Date"]);
        csvData.push(["Date", "Number of Purchases"]);
        purchaseData.purchasesByDate.forEach((item) => {
            csvData.push([item._id, item.count]);
        });
        csvData.push([""]);

        // Add purchases by supplier
        csvData.push(["Purchases by Supplier"]);
        csvData.push([
            "Supplier Name",
            "Shop Name",
            "Total Purchases",
            "Purchase Count",
        ]);
        purchaseData.purchasesBySupplier.forEach((item) => {
            csvData.push([
                item.supplier_name,
                item.shopname || "N/A",
                `₹${item.total_purchases.toFixed(2)}`,
                item.count,
            ]);
        });

        // Convert to CSV string
        const csvContent = csvData
            .map((row) => row.map((field) => `"${field}"`).join(","))
            .join("\n");

        // Download CSV
        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
        });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute(
                "download",
                `purchase-report-${dayjs().format("YYYY-MM-DD")}.csv`
            );
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        toast.success("Purchase report exported successfully!");
    };

    const supplierColumns = [
        {
            title: "Supplier Name",
            dataIndex: "supplier_name",
            key: "supplier_name",
            sorter: (a, b) => a.supplier_name.localeCompare(b.supplier_name),
            width: 150,
            ellipsis: true,
        },
        {
            title: "Shop Name",
            dataIndex: "shopname",
            key: "shopname",
            sorter: (a, b) =>
                (a.shopname || "").localeCompare(b.shopname || ""),
            render: (shopname) => shopname || "N/A",
            width: 120,
            ellipsis: true,
            responsive: ["sm"],
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
            width: 130,
        },
        {
            title: "Purchase Count",
            dataIndex: "count",
            key: "count",
            sorter: (a, b) => a.count - b.count,
            render: (count) => <span className="font-medium">{count}</span>,
            width: 120,
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
        <div className="space-y-4 sm:space-y-6">
            {/* Date Range Filter and Export */}
            <Card title="Filter and Export Options">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <RangePicker
                            value={dateRange}
                            onChange={handleDateRangeChange}
                            format="YYYY-MM-DD"
                            allowClear={false}
                            className="w-full sm:w-auto"
                            size="middle"
                        />
                        <Button
                            type="primary"
                            icon={<CalendarOutlined />}
                            onClick={() => fetchPurchaseReport()}
                            loading={loading}
                            className="w-full sm:w-auto"
                        >
                            <span className="hidden sm:inline">
                                Refresh Report
                            </span>
                            <span className="sm:hidden">Refresh</span>
                        </Button>
                    </div>
                    <Button
                        icon={<FileExcelOutlined />}
                        onClick={exportToCSV}
                        disabled={!purchaseData}
                        className="bg-green-500 text-white hover:bg-green-600 w-full sm:w-auto"
                    >
                        <span className="hidden sm:inline">Export to CSV</span>
                        <span className="sm:hidden">Export</span>
                    </Button>
                </div>
            </Card>

            {purchaseData && (
                <>
                    {/* Summary Cards */}
                    <Row gutter={[16, 16]} className="mb-4 sm:mb-6">
                        <Col xs={24} sm={12} lg={8}>
                            <StatCard
                                title="Total Purchases"
                                value={summary.totalPurchases}
                                icon={
                                    <ShoppingOutlined className="text-xl sm:text-2xl text-green" />
                                }
                                valueStyle={{ color: "#52c41a" }}
                                className="dashboard-stat-card"
                                formatter={(value) =>
                                    `₹${value.toLocaleString()}`
                                }
                                precision={2}
                            />
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <StatCard
                                title="Total Suppliers"
                                value={summary.totalSuppliers}
                                icon={
                                    <UserOutlined className="text-xl sm:text-2xl text-blue" />
                                }
                                valueStyle={{ color: "#1890ff" }}
                                className="dashboard-stat-card"
                            />
                        </Col>
                        <Col xs={24} sm={24} lg={8}>
                            <StatCard
                                title="Total Transactions"
                                value={summary.totalTransactions}
                                icon={
                                    <FileTextOutlined className="text-xl sm:text-2xl text-purple" />
                                }
                                valueStyle={{ color: "#722ed1" }}
                                className="dashboard-stat-card"
                            />
                        </Col>
                    </Row>

                    {/* Purchases by Date Chart */}
                    {purchaseData.purchasesByDate?.length > 0 && (
                        <Card title="Purchase Trend by Date" className="w-full">
                            <div className="w-full overflow-x-auto">
                                <ResponsiveContainer
                                    width="100%"
                                    height={window.innerWidth < 768 ? 300 : 400}
                                    minWidth={300}
                                >
                                    <BarChart
                                        data={purchaseData.purchasesByDate}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                            dataKey="_id"
                                            tick={{
                                                fontSize:
                                                    window.innerWidth < 768
                                                        ? 10
                                                        : 12,
                                            }}
                                            angle={
                                                window.innerWidth < 768
                                                    ? -90
                                                    : -45
                                            }
                                            textAnchor="end"
                                            height={
                                                window.innerWidth < 768
                                                    ? 100
                                                    : 80
                                            }
                                            interval={0}
                                        />
                                        <YAxis
                                            tick={{
                                                fontSize:
                                                    window.innerWidth < 768
                                                        ? 10
                                                        : 12,
                                            }}
                                        />
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
                            </div>
                        </Card>
                    )}

                    {/* Top Suppliers Bar Chart */}
                    {purchaseData.purchasesBySupplier?.length > 0 && (
                        <Card
                            title="Top Suppliers by Purchase Value"
                            className="h-full"
                        >
                            <div className="w-full overflow-x-auto">
                                <ResponsiveContainer
                                    width="100%"
                                    height={window.innerWidth < 768 ? 350 : 400}
                                    minWidth={300}
                                >
                                    <BarChart
                                        data={purchaseData.purchasesBySupplier.slice(
                                            0,
                                            window.innerWidth < 768 ? 5 : 8
                                        )}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                            dataKey="supplier_name"
                                            tick={{
                                                fontSize:
                                                    window.innerWidth < 768
                                                        ? 8
                                                        : 10,
                                            }}
                                            angle={
                                                window.innerWidth < 768
                                                    ? -90
                                                    : -45
                                            }
                                            textAnchor="end"
                                            height={
                                                window.innerWidth < 768
                                                    ? 140
                                                    : 120
                                            }
                                            interval={0}
                                        />
                                        <YAxis
                                            tick={{
                                                fontSize:
                                                    window.innerWidth < 768
                                                        ? 10
                                                        : 12,
                                            }}
                                            tickFormatter={(value) =>
                                                `₹${value}`
                                            }
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
                            </div>
                        </Card>
                    )}

                    {/* Supplier Details Table */}
                    {purchaseData.purchasesBySupplier?.length > 0 && (
                        <Card title="Supplier Purchase Details">
                            <div className="overflow-x-auto">
                                <Table
                                    columns={supplierColumns}
                                    dataSource={
                                        purchaseData.purchasesBySupplier
                                    }
                                    rowKey="_id"
                                    loading={loading}
                                    pagination={{
                                        pageSize:
                                            window.innerWidth < 768 ? 5 : 10,
                                        showSizeChanger:
                                            window.innerWidth >= 768,
                                        showQuickJumper:
                                            window.innerWidth >= 1024,
                                        showTotal: (total, range) =>
                                            window.innerWidth >= 768
                                                ? `${range[0]}-${range[1]} of ${total} items`
                                                : `${range[0]}-${range[1]}/${total}`,
                                        simple: window.innerWidth < 768,
                                    }}
                                    scroll={{ x: 500 }}
                                    size={
                                        window.innerWidth < 768
                                            ? "small"
                                            : "middle"
                                    }
                                />
                            </div>
                        </Card>
                    )}
                </>
            )}

            {!purchaseData && !loading && (
                <Card>
                    <div className="text-center py-8">
                        <p className="text-gray-500 text-sm sm:text-base px-4">
                            Select a date range to generate purchase report
                        </p>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default PurchaseReport;
