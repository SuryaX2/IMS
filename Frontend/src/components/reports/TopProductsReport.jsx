import React, { useState, useEffect, useContext } from "react";
import {
    Card,
    Select,
    Button,
    Space,
    Table,
    Avatar,
    Row,
    Col,
    Statistic,
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
    TrophyOutlined,
    ShoppingCartOutlined,
    DollarOutlined,
    ReloadOutlined,
    FileExcelOutlined,
} from "@ant-design/icons";
import { api } from "../../api/api";
import AuthContext from "../../context/AuthContext";
import toast from "react-hot-toast";
import dayjs from "dayjs";

const { Option } = Select;

const TopProductsReport = () => {
    const [topProducts, setTopProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [limit, setLimit] = useState(10);
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
        "#a4de6c",
        "#ffc0cb",
    ];

    useEffect(() => {
        fetchTopProducts();
    }, [limit]);

    const fetchTopProducts = async () => {
        try {
            setLoading(true);
            const response = await api.get(
                `/reports/top-products?limit=${limit}`
            );
            if (response.data.success) {
                setTopProducts(response.data.data);
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Failed to fetch top products report"
            );
        } finally {
            setLoading(false);
        }
    };

    const exportToCSV = () => {
        if (topProducts.length === 0) {
            toast.error("No data to export");
            return;
        }

        // Prepare CSV data
        const csvData = [];

        // Add summary
        csvData.push(["Top Products Report Summary"]);
        const summary = calculateSummary();
        csvData.push(["Total Products", summary.totalProducts]);
        csvData.push(["Total Quantity Sold", summary.totalQuantitySold]);
        csvData.push([
            "Total Revenue (in rupees)",
            `${summary.totalRevenue.toFixed(2)}`,
        ]);
        csvData.push([""]);

        // Add headers
        csvData.push([
            "Rank",
            "Product Code",
            "Product Name",
            "Quantity Sold",
            "Total Sales (in rupees)",
            "Average Price (in rupees)",
        ]);

        // Add product data
        topProducts.forEach((item, index) => {
            const avgPrice =
                item.quantity_sold > 0
                    ? item.total_sales / item.quantity_sold
                    : 0;
            csvData.push([
                index + 1,
                item.product_code,
                item.product_name,
                item.quantity_sold,
                `${item.total_sales.toFixed(2)}`,
                `${avgPrice.toFixed(2)}`,
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
                `top-products-report-${dayjs().format("YYYY-MM-DD")}.csv`
            );
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        toast.success("Top products report exported successfully!");
    };

    const columns = [
        {
            title: "Rank",
            key: "rank",
            render: (_, __, index) => (
                <div className="flex items-center">
                    {index < 3 ? (
                        <TrophyOutlined
                            className={`mr-1 sm:mr-2 ${
                                index === 0
                                    ? "text-yellow-500"
                                    : index === 1
                                      ? "text-gray-400"
                                      : "text-orange-600"
                            }`}
                            style={{
                                fontSize:
                                    window.innerWidth < 768 ? "14px" : "18px",
                            }}
                        />
                    ) : null}
                    <span className="font-medium text-xs sm:text-sm">
                        #{index + 1}
                    </span>
                </div>
            ),
            width: window.innerWidth < 768 ? 60 : 80,
        },
        {
            title: "Product",
            key: "product",
            render: (record) => (
                <div className="flex items-center space-x-2 sm:space-x-3">
                    <Avatar
                        src={record.product_image}
                        size={window.innerWidth < 768 ? "small" : "large"}
                        className="bg-gray-200 flex-shrink-0"
                    >
                        {record.product_name?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    <div className="min-w-0 flex-1">
                        <div className="font-medium text-xs sm:text-sm truncate">
                            {record.product_name}
                        </div>
                        <div className="text-gray-500 text-xs truncate">
                            {record.product_code}
                        </div>
                    </div>
                </div>
            ),
            sorter: (a, b) => a.product_name.localeCompare(b.product_name),
            width: window.innerWidth < 768 ? 140 : 250,
            ellipsis: true,
        },
        {
            title: window.innerWidth < 768 ? "Qty" : "Quantity Sold",
            dataIndex: "quantity_sold",
            key: "quantity_sold",
            sorter: (a, b) => a.quantity_sold - b.quantity_sold,
            render: (quantity) => (
                <div className="text-center">
                    <div
                        className={`font-bold text-blue-600 ${
                            window.innerWidth < 768 ? "text-sm" : "text-lg"
                        }`}
                    >
                        {quantity}
                    </div>
                    <div className="text-gray-500 text-xs hidden sm:block">
                        units
                    </div>
                </div>
            ),
            width: window.innerWidth < 768 ? 60 : 120,
        },
        {
            title: window.innerWidth < 768 ? "Sales" : "Total Sales",
            dataIndex: "total_sales",
            key: "total_sales",
            sorter: (a, b) => a.total_sales - b.total_sales,
            render: (sales) => (
                <div className="text-center">
                    <div
                        className={`font-bold text-green-600 ${
                            window.innerWidth < 768 ? "text-xs" : "text-lg"
                        }`}
                    >
                        ₹
                        {window.innerWidth < 768
                            ? sales.toFixed(0)
                            : sales.toFixed(2)}
                    </div>
                    <div className="text-gray-500 text-xs hidden sm:block">
                        revenue
                    </div>
                </div>
            ),
            width: window.innerWidth < 768 ? 70 : 120,
        },
        {
            title: "Avg. Price",
            key: "avg_price",
            render: (record) => {
                const avgPrice =
                    record.quantity_sold > 0
                        ? record.total_sales / record.quantity_sold
                        : 0;
                return (
                    <div className="text-center">
                        <div
                            className={`font-medium text-purple-600 ${
                                window.innerWidth < 768
                                    ? "text-xs"
                                    : "text-base"
                            }`}
                        >
                            ₹
                            {window.innerWidth < 768
                                ? avgPrice.toFixed(0)
                                : avgPrice.toFixed(2)}
                        </div>
                        <div className="text-gray-500 text-xs hidden md:block">
                            per unit
                        </div>
                    </div>
                );
            },
            width: window.innerWidth < 768 ? 70 : 120,
            responsive: ["sm"],
        },
    ];

    const calculateSummary = () => {
        const totalQuantitySold = topProducts.reduce(
            (sum, product) => sum + product.quantity_sold,
            0
        );
        const totalRevenue = topProducts.reduce(
            (sum, product) => sum + product.total_sales,
            0
        );
        const totalProducts = topProducts.length;

        return { totalQuantitySold, totalRevenue, totalProducts };
    };

    const summary = calculateSummary();

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Controls */}
            <Card
                title={
                    <span className="text-sm sm:text-base">
                        Top Products Configuration
                    </span>
                }
            >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <span className="text-sm">Show top:</span>
                        <Select
                            value={limit}
                            onChange={setLimit}
                            className="w-full sm:w-32"
                            size={window.innerWidth < 768 ? "middle" : "large"}
                        >
                            <Option value={5}>5 Products</Option>
                            <Option value={10}>10 Products</Option>
                            <Option value={15}>15 Products</Option>
                            <Option value={20}>20 Products</Option>
                            <Option value={25}>25 Products</Option>
                        </Select>
                        <Button
                            type="primary"
                            icon={<ReloadOutlined />}
                            onClick={fetchTopProducts}
                            loading={loading}
                            className="w-full sm:w-auto"
                            size={window.innerWidth < 768 ? "middle" : "large"}
                        >
                            <span className="hidden sm:inline">Refresh</span>
                            <span className="sm:hidden">Refresh</span>
                        </Button>
                    </div>
                    <Button
                        icon={<FileExcelOutlined />}
                        onClick={exportToCSV}
                        disabled={topProducts.length === 0}
                        className="bg-green-500 text-white hover:bg-green-600 w-full sm:w-auto"
                        size={window.innerWidth < 768 ? "middle" : "large"}
                    >
                        <span className="hidden sm:inline">Export to CSV</span>
                        <span className="sm:hidden">Export</span>
                    </Button>
                </div>
            </Card>

            {/* Summary Cards */}
            {topProducts.length > 0 && (
                <Row gutter={[12, 12]} className="mb-4 sm:mb-6">
                    <Col xs={24} sm={8} lg={8}>
                        <Card className="h-full">
                            <Statistic
                                title={
                                    <span className="text-xs sm:text-sm">
                                        {window.innerWidth < 768
                                            ? "Products"
                                            : "Total Products"}
                                    </span>
                                }
                                value={summary.totalProducts}
                                valueStyle={{
                                    color: "#1890ff",
                                    fontSize: "clamp(1rem, 4vw, 1.5rem)",
                                }}
                                prefix={<TrophyOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8} lg={8}>
                        <Card className="h-full">
                            <Statistic
                                title={
                                    <span className="text-xs sm:text-sm">
                                        {window.innerWidth < 768
                                            ? "Qty Sold"
                                            : "Total Quantity Sold"}
                                    </span>
                                }
                                value={summary.totalQuantitySold}
                                valueStyle={{
                                    color: "#52c41a",
                                    fontSize: "clamp(1rem, 4vw, 1.5rem)",
                                }}
                                prefix={<ShoppingCartOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8} lg={8}>
                        <Card className="h-full">
                            <Statistic
                                title={
                                    <span className="text-xs sm:text-sm">
                                        {window.innerWidth < 768
                                            ? "Revenue"
                                            : "Total Revenue"}
                                    </span>
                                }
                                value={summary.totalRevenue}
                                precision={window.innerWidth < 768 ? 0 : 2}
                                prefix="₹"
                                valueStyle={{
                                    color: "#722ed1",
                                    fontSize: "clamp(1rem, 4vw, 1.5rem)",
                                }}
                                suffix={<DollarOutlined />}
                            />
                        </Card>
                    </Col>
                </Row>
            )}

            {topProducts.length > 0 && (
                <Row gutter={[12, 12]}>
                    {/* Quantity Sold Chart */}
                    <Col xs={24} lg={12}>
                        <Card
                            title={
                                <span className="text-sm sm:text-base">
                                    {window.innerWidth < 768
                                        ? "Top by Quantity"
                                        : "Top Products by Quantity Sold"}
                                </span>
                            }
                            className="h-full"
                        >
                            <div className="w-full overflow-x-auto">
                                <ResponsiveContainer
                                    width="100%"
                                    height={window.innerWidth < 768 ? 300 : 400}
                                    minWidth={280}
                                >
                                    <BarChart
                                        data={topProducts.slice(
                                            0,
                                            window.innerWidth < 768 ? 5 : 10
                                        )}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                            dataKey="product_name"
                                            tick={{
                                                fontSize:
                                                    window.innerWidth < 768
                                                        ? 8
                                                        : 10,
                                            }}
                                            angle={
                                                window.innerWidth < 768
                                                    ? -90
                                                    : -30
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
                                        />
                                        <Tooltip
                                            formatter={(value, name) => [
                                                value,
                                                "Quantity Sold",
                                            ]}
                                            labelFormatter={(label) =>
                                                `Product: ${label}`
                                            }
                                        />
                                        <Legend />
                                        <Bar
                                            dataKey="quantity_sold"
                                            fill="#1890ff"
                                            name="Quantity Sold"
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </Col>

                    {/* Revenue Chart */}
                    <Col xs={24} lg={12}>
                        <Card
                            title={
                                <span className="text-sm sm:text-base">
                                    {window.innerWidth < 768
                                        ? "Top by Revenue"
                                        : "Top Products by Revenue"}
                                </span>
                            }
                            className="h-full"
                        >
                            <div className="w-full overflow-x-auto">
                                <ResponsiveContainer
                                    width="100%"
                                    height={window.innerWidth < 768 ? 300 : 400}
                                    minWidth={280}
                                >
                                    <BarChart
                                        data={topProducts.slice(
                                            0,
                                            window.innerWidth < 768 ? 5 : 10
                                        )}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                            dataKey="product_name"
                                            tick={{
                                                fontSize:
                                                    window.innerWidth < 768
                                                        ? 8
                                                        : 10,
                                            }}
                                            angle={
                                                window.innerWidth < 768
                                                    ? -90
                                                    : -30
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
                                                `₹${value.toFixed(2)}`,
                                                "Revenue",
                                            ]}
                                            labelFormatter={(label) =>
                                                `Product: ${label}`
                                            }
                                        />
                                        <Legend />
                                        <Bar
                                            dataKey="total_sales"
                                            fill="#52c41a"
                                            name="Revenue"
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </Col>
                </Row>
            )}

            {/* Revenue Distribution Pie Chart */}
            {topProducts.length > 0 && (
                <Card
                    title={
                        <span className="text-sm sm:text-base">
                            {window.innerWidth < 768
                                ? "Revenue Distribution"
                                : "Revenue Distribution by Product"}
                        </span>
                    }
                    className="w-full"
                >
                    <div className="w-full overflow-x-auto">
                        <ResponsiveContainer
                            width="100%"
                            height={window.innerWidth < 768 ? 350 : 500}
                            minWidth={300}
                        >
                            <PieChart>
                                <Pie
                                    data={topProducts.slice(
                                        0,
                                        window.innerWidth < 768 ? 5 : 10
                                    )}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({
                                        product_name,
                                        percent,
                                        total_sales,
                                    }) => {
                                        const maxLength =
                                            window.innerWidth < 768 ? 8 : 15;
                                        const displayName =
                                            product_name.length > maxLength
                                                ? `${product_name.substring(0, maxLength)}...`
                                                : product_name;
                                        return `${displayName} (${(percent * 100).toFixed(1)}%)`;
                                    }}
                                    outerRadius={
                                        window.innerWidth < 768 ? 100 : 150
                                    }
                                    fill="#8884d8"
                                    dataKey="total_sales"
                                >
                                    {topProducts
                                        .slice(
                                            0,
                                            window.innerWidth < 768 ? 5 : 10
                                        )
                                        .map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={
                                                    COLORS[
                                                        index % COLORS.length
                                                    ]
                                                }
                                            />
                                        ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value, name) => [
                                        `₹${value.toFixed(2)}`,
                                        "Revenue",
                                    ]}
                                />
                                <Legend
                                    wrapperStyle={{ paddingTop: "20px" }}
                                    formatter={(value, entry) => {
                                        const name = entry.payload.product_name;
                                        const maxLength =
                                            window.innerWidth < 768 ? 12 : 25;
                                        const displayName =
                                            name.length > maxLength
                                                ? `${name.substring(0, maxLength)}...`
                                                : name;
                                        return `${displayName} - ₹${entry.payload.total_sales.toFixed(window.innerWidth < 768 ? 0 : 2)}`;
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            )}

            {/* Top Products Table */}
            <Card
                title={
                    <span className="text-sm sm:text-base">
                        {window.innerWidth < 768
                            ? `Top ${limit} Products`
                            : `Top ${limit} Best Selling Products`}
                    </span>
                }
            >
                <div className="overflow-x-auto">
                    <Table
                        columns={columns}
                        dataSource={topProducts}
                        rowKey="_id"
                        loading={loading}
                        pagination={{
                            pageSize: window.innerWidth < 768 ? 5 : 10,
                            showSizeChanger: window.innerWidth >= 768,
                            showQuickJumper: window.innerWidth >= 1024,
                            showTotal: (total, range) =>
                                window.innerWidth >= 768
                                    ? `${range[0]}-${range[1]} of ${total} items`
                                    : `${range[0]}-${range[1]}/${total}`,
                            simple: window.innerWidth < 768,
                        }}
                        scroll={{ x: 400 }}
                        size={window.innerWidth < 768 ? "small" : "middle"}
                        className="top-products-table"
                        rowClassName={(record, index) => {
                            if (index === 0)
                                return "bg-yellow-50 border-l-4 border-yellow-400";
                            if (index === 1)
                                return "bg-gray-50 border-l-4 border-gray-400";
                            if (index === 2)
                                return "bg-orange-50 border-l-4 border-orange-400";
                            return "";
                        }}
                    />
                </div>
            </Card>

            {topProducts.length === 0 && !loading && (
                <Card>
                    <div className="text-center py-8 sm:py-12">
                        <TrophyOutlined
                            style={{
                                fontSize:
                                    window.innerWidth < 768 ? "36px" : "48px",
                                color: "#d9d9d9",
                            }}
                        />
                        <p className="text-gray-500 mt-4 text-sm sm:text-base px-4">
                            No top products data available
                        </p>
                        <p className="text-gray-400 text-xs sm:text-sm px-4">
                            Make some sales to see your best-selling products
                            here!
                        </p>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default TopProductsReport;
