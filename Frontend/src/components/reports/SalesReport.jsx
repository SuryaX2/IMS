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
    ShoppingCartOutlined,
    DollarOutlined,
    FileExcelOutlined,
} from "@ant-design/icons";
import { api } from "../../api/api";
import AuthContext from "../../context/AuthContext";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import StatCard from "../dashboard/StatCard";

const { RangePicker } = DatePicker;

const SalesReport = () => {
    const [salesData, setSalesData] = useState(null);
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

    const exportToCSV = () => {
        if (!salesData) {
            toast.error("No data to export");
            return;
        }

        // Prepare CSV data
        const csvData = [];

        // Add summary
        csvData.push(["Sales Report Summary"]);
        csvData.push([
            "Total Sales",
            `₹${salesData.summary.totalSales.toFixed(2)}`,
        ]);
        csvData.push(["Total Orders", salesData.summary.totalOrders]);
        csvData.push([""]);

        // Add sales by date
        csvData.push(["Sales by Date"]);
        csvData.push(["Date", "Total Sales", "Number of Orders"]);
        salesData.salesByDate.forEach((item) => {
            csvData.push([item._id, `₹${item.total.toFixed(2)}`, item.orders]);
        });
        csvData.push([""]);

        // Add sales by product
        csvData.push(["Top Selling Products"]);
        csvData.push(["Product Name", "Quantity Sold", "Total Sales"]);
        salesData.salesByProduct.forEach((item) => {
            csvData.push([
                item.product_name,
                item.quantity,
                `₹${item.total.toFixed(2)}`,
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
                `sales-report-${dayjs().format("YYYY-MM-DD")}.csv`
            );
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        toast.success("Sales report exported successfully!");
    };

    const productColumns = [
        {
            title: "Product Name",
            dataIndex: "product_name",
            key: "product_name",
            sorter: (a, b) => a.product_name.localeCompare(b.product_name),
            width: 150,
            ellipsis: true,
        },
        {
            title: "Quantity Sold",
            dataIndex: "quantity",
            key: "quantity",
            sorter: (a, b) => a.quantity - b.quantity,
            render: (quantity) => (
                <span className="font-medium text-blue-600">{quantity}</span>
            ),
            width: 100,
            responsive: ["sm"],
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
            width: 120,
        },
        {
            title: "Avg. Price",
            key: "avg_price",
            render: (record) => {
                const avgPrice =
                    record.quantity > 0 ? record.total / record.quantity : 0;
                return (
                    <span className="font-medium text-purple-600">
                        ₹{avgPrice.toFixed(2)}
                    </span>
                );
            },
            width: 100,
            responsive: ["md"],
        },
    ];

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
                            onClick={() => fetchSalesReport()}
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
                        disabled={!salesData}
                        className="bg-green-500 text-white hover:bg-green-600 w-full sm:w-auto"
                    >
                        <span className="hidden sm:inline">Export to CSV</span>
                        <span className="sm:hidden">Export</span>
                    </Button>
                </div>
            </Card>

            {salesData && (
                <>
                    {/* Summary Cards */}
                    <Row gutter={[16, 16]} className="mb-4 sm:mb-6">
                        <Col xs={24} sm={12}>
                            <StatCard
                                title="Total Sales Revenue"
                                value={salesData.summary.totalSales}
                                icon={
                                    <DollarOutlined className="text-xl sm:text-2xl text-green" />
                                }
                                valueStyle={{ color: "#52c41a" }}
                                className="dashboard-stat-card"
                                formatter={(value) =>
                                    `₹${value.toLocaleString()}`
                                }
                                precision={2}
                            />
                        </Col>
                        <Col xs={24} sm={12}>
                            <StatCard
                                title="Total Orders"
                                value={salesData.summary.totalOrders}
                                icon={
                                    <ShoppingCartOutlined className="text-xl sm:text-2xl text-blue" />
                                }
                                valueStyle={{ color: "#1890ff" }}
                                className="dashboard-stat-card"
                            />
                        </Col>
                    </Row>

                    {/* Sales Trend Chart */}
                    {salesData.salesByDate?.length > 0 && (
                        <Card title="Sales Trend Over Time" className="w-full">
                            <div className="w-full overflow-x-auto">
                                <ResponsiveContainer
                                    width="100%"
                                    height={window.innerWidth < 768 ? 300 : 400}
                                    minWidth={300}
                                >
                                    <LineChart data={salesData.salesByDate}>
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
                                            strokeWidth={3}
                                            name="Sales (₹)"
                                            dot={{
                                                r:
                                                    window.innerWidth < 768
                                                        ? 4
                                                        : 6,
                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="orders"
                                            stroke="#1890ff"
                                            strokeWidth={2}
                                            name="Orders"
                                            dot={{
                                                r:
                                                    window.innerWidth < 768
                                                        ? 3
                                                        : 4,
                                            }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    )}

                    <Row gutter={[12, 12]}>
                        {/* Sales by Product Bar Chart */}
                        {salesData.salesByProduct?.length > 0 && (
                            <Col xs={24} lg={12}>
                                <Card
                                    title="Top Products by Sales"
                                    className="h-full"
                                >
                                    <div className="w-full overflow-x-auto">
                                        <ResponsiveContainer
                                            width="100%"
                                            height={
                                                window.innerWidth < 768
                                                    ? 300
                                                    : 400
                                            }
                                            minWidth={280}
                                        >
                                            <BarChart
                                                data={salesData.salesByProduct.slice(
                                                    0,
                                                    window.innerWidth < 768
                                                        ? 5
                                                        : 8
                                                )}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis
                                                    dataKey="product_name"
                                                    tick={{
                                                        fontSize:
                                                            window.innerWidth <
                                                            768
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
                                                            window.innerWidth <
                                                            768
                                                                ? 10
                                                                : 12,
                                                    }}
                                                    tickFormatter={(value) =>
                                                        `₹${value}`
                                                    }
                                                />
                                                <Tooltip
                                                    formatter={(
                                                        value,
                                                        name
                                                    ) => [
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
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </Card>
                            </Col>
                        )}

                        {/* Product Sales Distribution Pie Chart */}
                        {salesData.salesByProduct?.length > 0 && (
                            <Col xs={24} lg={12}>
                                <Card
                                    title="Sales Distribution by Product"
                                    className="h-full"
                                >
                                    <div className="w-full overflow-x-auto">
                                        <ResponsiveContainer
                                            width="100%"
                                            height={
                                                window.innerWidth < 768
                                                    ? 300
                                                    : 400
                                            }
                                            minWidth={280}
                                        >
                                            <PieChart>
                                                <Pie
                                                    data={salesData.salesByProduct.slice(
                                                        0,
                                                        window.innerWidth < 768
                                                            ? 5
                                                            : 8
                                                    )}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={({
                                                        product_name,
                                                        percent,
                                                    }) => {
                                                        const maxLength =
                                                            window.innerWidth <
                                                            768
                                                                ? 8
                                                                : 10;
                                                        const displayName =
                                                            product_name.length >
                                                            maxLength
                                                                ? `${product_name.substring(0, maxLength)}...`
                                                                : product_name;
                                                        return `${displayName} (${(percent * 100).toFixed(1)}%)`;
                                                    }}
                                                    outerRadius={
                                                        window.innerWidth < 768
                                                            ? 80
                                                            : 120
                                                    }
                                                    fill="#8884d8"
                                                    dataKey="total"
                                                >
                                                    {salesData.salesByProduct
                                                        .slice(
                                                            0,
                                                            window.innerWidth <
                                                                768
                                                                ? 5
                                                                : 8
                                                        )
                                                        .map((entry, index) => (
                                                            <Cell
                                                                key={`cell-${index}`}
                                                                fill={
                                                                    COLORS[
                                                                        index %
                                                                            COLORS.length
                                                                    ]
                                                                }
                                                            />
                                                        ))}
                                                </Pie>
                                                <Tooltip
                                                    formatter={(value) => [
                                                        `₹${value.toFixed(2)}`,
                                                        "Sales",
                                                    ]}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </Card>
                            </Col>
                        )}
                    </Row>

                    {/* Product Sales Table */}
                    {salesData.salesByProduct?.length > 0 && (
                        <Card title="Product Sales Details">
                            <div className="overflow-x-auto">
                                <Table
                                    columns={productColumns}
                                    dataSource={salesData.salesByProduct}
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
                                    scroll={{ x: 450 }}
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

            {!salesData && !loading && (
                <Card>
                    <div className="text-center py-8">
                        <p className="text-gray-500 text-sm sm:text-base px-4">
                            Select a date range to generate sales report
                        </p>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default SalesReport;
