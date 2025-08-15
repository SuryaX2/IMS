import React, { useState, useEffect } from "react";
import {
    Card,
    Row,
    Col,
    Statistic,
    Table,
    Button,
    Spin,
    Empty,
    Typography,
    Select,
    Avatar,
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
} from "recharts";
import {
    TrophyOutlined,
    ShoppingOutlined,
    DollarOutlined,
    DownloadOutlined,
    StarOutlined,
} from "@ant-design/icons";
import { api } from "../../api/api";
import toast from "react-hot-toast";

const { Title } = Typography;
const { Option } = Select;

const TopProductsReport = () => {
    const [topProductsData, setTopProductsData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [limit, setLimit] = useState(10);

    useEffect(() => {
        fetchTopProductsReport();
    }, [limit]);

    const fetchTopProductsReport = async () => {
        try {
            setLoading(true);
            const response = await api.get(
                `/reports/top-products?limit=${limit}`
            );
            if (response.data.success) {
                setTopProductsData(response.data.data);
                toast.success("Top products report loaded successfully");
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Failed to fetch top products report"
            );
            setTopProductsData([]);
        } finally {
            setLoading(false);
        }
    };

    const handleLimitChange = (value) => {
        setLimit(value);
    };

    const exportToCSV = () => {
        const headers = [
            "Product Name",
            "Product Code",
            "Quantity Sold",
            "Total Sales",
        ];
        const csvContent = [
            headers.join(","),
            ...topProductsData.map((row) =>
                [
                    row.product_name,
                    row.product_code,
                    row.quantity_sold,
                    row.total_sales,
                ].join(",")
            ),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `top-products-report-${
            new Date().toISOString().split("T")[0]
        }.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const formatCurrency = (value) => `₹${value?.toFixed(2) || 0}`;

    const productColumns = [
        {
            title: "Rank",
            key: "rank",
            render: (_, __, index) => (
                <div className="flex items-center gap-2">
                    {index < 3 && (
                        <TrophyOutlined
                            style={{
                                color:
                                    index === 0
                                        ? "#FFD700"
                                        : index === 1
                                          ? "#C0C0C0"
                                          : "#CD7F32",
                                fontSize: "16px",
                            }}
                        />
                    )}
                    <span className="font-medium">#{index + 1}</span>
                </div>
            ),
        },
        {
            title: "Product",
            key: "product",
            render: (_, record) => (
                <div className="flex items-center gap-3">
                    {record.product_image ? (
                        <Avatar src={record.product_image} size={40} />
                    ) : (
                        <Avatar
                            icon={<ShoppingOutlined />}
                            size={40}
                            style={{
                                backgroundColor: "#f0f0f0",
                                color: "#666",
                            }}
                        />
                    )}
                    <div>
                        <div className="font-medium">{record.product_name}</div>
                        <div className="text-sm text-gray-500">
                            {record.product_code}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: "Quantity Sold",
            dataIndex: "quantity_sold",
            key: "quantity_sold",
            sorter: (a, b) => a.quantity_sold - b.quantity_sold,
            render: (quantity) => (
                <span className="font-medium text-blue-600">{quantity}</span>
            ),
        },
        {
            title: "Total Sales",
            dataIndex: "total_sales",
            key: "total_sales",
            sorter: (a, b) => a.total_sales - b.total_sales,
            render: (total) => (
                <span className="text-green-600 font-medium">
                    {formatCurrency(total)}
                </span>
            ),
        },
    ];

    // Format data for chart
    const chartData = topProductsData.slice(0, 8).map((item) => ({
        name:
            item.product_name.length > 12
                ? item.product_name.substring(0, 12) + "..."
                : item.product_name,
        quantity: item.quantity_sold,
        sales: item.total_sales,
    }));

    // Calculate summary statistics
    const totalQuantitySold = topProductsData.reduce(
        (sum, item) => sum + item.quantity_sold,
        0
    );

    const totalSalesValue = topProductsData.reduce(
        (sum, item) => sum + item.total_sales,
        0
    );

    const averageSalesPerProduct =
        topProductsData.length > 0
            ? totalSalesValue / topProductsData.length
            : 0;

    return (
        <div className="space-y-6">
            {/* Controls */}
            <Card>
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} sm={12} md={8}>
                        <div className="flex items-center gap-2">
                            <StarOutlined />
                            <span className="font-medium">Show Top:</span>
                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={10}>
                        <Select
                            value={limit}
                            onChange={handleLimitChange}
                            style={{ width: "100%" }}
                        >
                            <Option value={5}>Top 5 Products</Option>
                            <Option value={10}>Top 10 Products</Option>
                            <Option value={20}>Top 20 Products</Option>
                            <Option value={50}>Top 50 Products</Option>
                        </Select>
                    </Col>
                    <Col xs={24} sm={24} md={6}>
                        <Button
                            type="primary"
                            icon={<DownloadOutlined />}
                            onClick={exportToCSV}
                            disabled={topProductsData.length === 0}
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
                                title="Total Quantity Sold"
                                value={totalQuantitySold}
                                valueStyle={{ color: "#1890ff" }}
                                suffix={<ShoppingOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <Card>
                            <Statistic
                                title="Total Sales Value"
                                value={totalSalesValue}
                                prefix="₹"
                                precision={2}
                                valueStyle={{ color: "#52c41a" }}
                                suffix={<DollarOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <Card>
                            <Statistic
                                title="Average Sales per Product"
                                value={averageSalesPerProduct}
                                prefix="₹"
                                precision={2}
                                valueStyle={{ color: "#fa8c16" }}
                                suffix={<TrophyOutlined />}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Top Products Charts */}
                <Row gutter={[16, 16]}>
                    <Col xs={24} lg={12}>
                        <Card
                            title="Top Products by Quantity Sold"
                            className="chart-card"
                        >
                            {chartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={350}>
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                            dataKey="name"
                                            tick={{ fontSize: 12 }}
                                            angle={-45}
                                            textAnchor="end"
                                            height={80}
                                        />
                                        <YAxis tick={{ fontSize: 12 }} />
                                        <Tooltip
                                            formatter={(value) => [
                                                value,
                                                "Quantity Sold",
                                            ]}
                                        />
                                        <Legend />
                                        <Bar
                                            dataKey="quantity"
                                            fill="#1890ff"
                                            name="Quantity Sold"
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <Empty description="No top products data available" />
                            )}
                        </Card>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Card
                            title="Top Products by Sales Value"
                            className="chart-card"
                        >
                            {chartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={350}>
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                            dataKey="name"
                                            tick={{ fontSize: 12 }}
                                            angle={-45}
                                            textAnchor="end"
                                            height={80}
                                        />
                                        <YAxis tick={{ fontSize: 12 }} />
                                        <Tooltip
                                            formatter={(value) => [
                                                formatCurrency(value),
                                                "Total Sales",
                                            ]}
                                        />
                                        <Legend />
                                        <Bar
                                            dataKey="sales"
                                            fill="#52c41a"
                                            name="Total Sales (₹)"
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <Empty description="No top products data available" />
                            )}
                        </Card>
                    </Col>
                </Row>

                {/* Top Products Table */}
                <Card title={`Top ${limit} Best Selling Products`}>
                    {topProductsData.length > 0 ? (
                        <Table
                            columns={productColumns}
                            dataSource={topProductsData}
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
                                    (sum, item) => sum + item.quantity_sold,
                                    0
                                );
                                const totalSales = pageData.reduce(
                                    (sum, item) => sum + item.total_sales,
                                    0
                                );

                                return (
                                    <Table.Summary.Row className="bg-gray-50">
                                        <Table.Summary.Cell colSpan={2}>
                                            <strong>Page Total</strong>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell>
                                            <strong className="text-blue-600">
                                                {totalQuantity}
                                            </strong>
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
                        <Empty description="No top products data available" />
                    )}
                </Card>
            </Spin>
        </div>
    );
};

export default TopProductsReport;
