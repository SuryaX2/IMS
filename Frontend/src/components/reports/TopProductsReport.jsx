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
} from "@ant-design/icons";
import { api } from "../../api/api";
import AuthContext from "../../context/AuthContext";
import toast from "react-hot-toast";

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

    const columns = [
        {
            title: "Rank",
            key: "rank",
            render: (_, __, index) => (
                <div className="flex items-center">
                    {index < 3 ? (
                        <TrophyOutlined
                            className={`mr-2 ${
                                index === 0
                                    ? "text-yellow-500"
                                    : index === 1
                                      ? "text-gray-400"
                                      : "text-orange-600"
                            }`}
                            style={{ fontSize: "18px" }}
                        />
                    ) : null}
                    <span className="font-medium">#{index + 1}</span>
                </div>
            ),
            width: 80,
        },
        {
            title: "Product",
            key: "product",
            render: (record) => (
                <div className="flex items-center space-x-3">
                    <Avatar
                        src={record.product_image}
                        size="large"
                        className="bg-gray-200"
                    >
                        {record.product_name?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    <div>
                        <div className="font-medium">{record.product_name}</div>
                        <div className="text-gray-500 text-sm">
                            {record.product_code}
                        </div>
                    </div>
                </div>
            ),
            sorter: (a, b) => a.product_name.localeCompare(b.product_name),
        },
        {
            title: "Quantity Sold",
            dataIndex: "quantity_sold",
            key: "quantity_sold",
            sorter: (a, b) => a.quantity_sold - b.quantity_sold,
            render: (quantity) => (
                <div className="text-center">
                    <div className="font-bold text-lg text-blue-600">
                        {quantity}
                    </div>
                    <div className="text-gray-500 text-xs">units</div>
                </div>
            ),
        },
        {
            title: "Total Sales",
            dataIndex: "total_sales",
            key: "total_sales",
            sorter: (a, b) => a.total_sales - b.total_sales,
            render: (sales) => (
                <div className="text-center">
                    <div className="font-bold text-lg text-green-600">
                        ₹{sales.toFixed(2)}
                    </div>
                    <div className="text-gray-500 text-xs">revenue</div>
                </div>
            ),
        },
        {
            title: "Avg. Sale Price",
            key: "avg_price",
            render: (record) => {
                const avgPrice =
                    record.quantity_sold > 0
                        ? record.total_sales / record.quantity_sold
                        : 0;
                return (
                    <div className="text-center">
                        <div className="font-medium text-purple-600">
                            ₹{avgPrice.toFixed(2)}
                        </div>
                        <div className="text-gray-500 text-xs">per unit</div>
                    </div>
                );
            },
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
        <div className="space-y-6">
            {/* Controls */}
            <Card title="Top Products Configuration">
                <Space>
                    <span>Show top:</span>
                    <Select
                        value={limit}
                        onChange={setLimit}
                        style={{ width: 120 }}
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
                    >
                        Refresh
                    </Button>
                </Space>
            </Card>

            {/* Summary Cards */}
            {topProducts.length > 0 && (
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={8} lg={8}>
                        <Card>
                            <Statistic
                                title="Total Products"
                                value={summary.totalProducts}
                                valueStyle={{ color: "#1890ff" }}
                                prefix={<TrophyOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8} lg={8}>
                        <Card>
                            <Statistic
                                title="Total Quantity Sold"
                                value={summary.totalQuantitySold}
                                valueStyle={{ color: "#52c41a" }}
                                prefix={<ShoppingCartOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8} lg={8}>
                        <Card>
                            <Statistic
                                title="Total Revenue"
                                value={summary.totalRevenue}
                                precision={2}
                                prefix="₹"
                                valueStyle={{ color: "#722ed1" }}
                                suffix={<DollarOutlined />}
                            />
                        </Card>
                    </Col>
                </Row>
            )}

            {topProducts.length > 0 && (
                <Row gutter={[16, 16]}>
                    {/* Quantity Sold Chart */}
                    <Col xs={24} lg={12}>
                        <Card
                            title="Top Products by Quantity Sold"
                            className="h-full"
                        >
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart data={topProducts.slice(0, 10)}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="product_name"
                                        tick={{ fontSize: 10 }}
                                        angle={-45}
                                        textAnchor="end"
                                        height={120}
                                        interval={0}
                                    />
                                    <YAxis tick={{ fontSize: 12 }} />
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
                        </Card>
                    </Col>

                    {/* Revenue Chart */}
                    <Col xs={24} lg={12}>
                        <Card
                            title="Top Products by Revenue"
                            className="h-full"
                        >
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart data={topProducts.slice(0, 10)}>
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
                        </Card>
                    </Col>
                </Row>
            )}

            {/* Revenue Distribution Pie Chart */}
            {topProducts.length > 0 && (
                <Card title="Revenue Distribution" className="w-full">
                    <ResponsiveContainer width="100%" height={500}>
                        <PieChart>
                            <Pie
                                data={topProducts.slice(0, 10)}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({
                                    product_name,
                                    percent,
                                    total_sales,
                                }) =>
                                    `${product_name.substring(0, 15)}${product_name.length > 15 ? "..." : ""} (${(percent * 100).toFixed(1)}%)`
                                }
                                outerRadius={150}
                                fill="#8884d8"
                                dataKey="total_sales"
                            >
                                {topProducts
                                    .slice(0, 10)
                                    .map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
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
                                formatter={(value, entry) =>
                                    `${entry.payload.product_name} - ₹${entry.payload.total_sales.toFixed(2)}`
                                }
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
            )}

            {/* Top Products Table */}
            <Card title={`Top ${limit} Best Selling Products`}>
                <Table
                    columns={columns}
                    dataSource={topProducts}
                    rowKey="_id"
                    loading={loading}
                    pagination={false}
                    scroll={{ x: 800 }}
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
            </Card>

            {topProducts.length === 0 && !loading && (
                <Card>
                    <div className="text-center py-12">
                        <TrophyOutlined
                            style={{ fontSize: "48px", color: "#d9d9d9" }}
                        />
                        <p className="text-gray-500 mt-4">
                            No top products data available
                        </p>
                        <p className="text-gray-400">
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
