import React, { useState, useEffect, useContext } from "react";
import {
    Table,
    Card,
    Statistic,
    Row,
    Col,
    Tag,
    Button,
    Space,
    Input,
} from "antd";
import {
    SearchOutlined,
    WarningOutlined,
    CheckCircleOutlined,
    StopOutlined,
} from "@ant-design/icons";
import { api } from "../../api/api";
import AuthContext from "../../context/AuthContext";
import toast from "react-hot-toast";

const StockReport = () => {
    const [stockData, setStockData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchStockReport();
    }, []);

    useEffect(() => {
        const filtered = stockData.filter(
            (item) =>
                item.product_name
                    .toLowerCase()
                    .includes(searchText.toLowerCase()) ||
                item.product_code
                    .toLowerCase()
                    .includes(searchText.toLowerCase()) ||
                item.category_name
                    .toLowerCase()
                    .includes(searchText.toLowerCase())
        );
        setFilteredData(filtered);
    }, [searchText, stockData]);

    const fetchStockReport = async () => {
        try {
            setLoading(true);
            const response = await api.get("/reports/stock");
            if (response.data.success) {
                setStockData(response.data.data);
                setFilteredData(response.data.data);
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to fetch stock report"
            );
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Out of Stock":
                return "red";
            case "Low Stock":
                return "orange";
            case "In Stock":
                return "green";
            default:
                return "default";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "Out of Stock":
                return <StopOutlined />;
            case "Low Stock":
                return <WarningOutlined />;
            case "In Stock":
                return <CheckCircleOutlined />;
            default:
                return null;
        }
    };

    const columns = [
        {
            title: "Product Code",
            dataIndex: "product_code",
            key: "product_code",
            sorter: (a, b) => a.product_code.localeCompare(b.product_code),
        },
        {
            title: "Product Name",
            dataIndex: "product_name",
            key: "product_name",
            sorter: (a, b) => a.product_name.localeCompare(b.product_name),
        },
        {
            title: "Category",
            dataIndex: "category_name",
            key: "category_name",
            sorter: (a, b) => a.category_name.localeCompare(b.category_name),
        },
        {
            title: "Unit",
            dataIndex: "unit_name",
            key: "unit_name",
        },
        {
            title: "Stock",
            dataIndex: "stock",
            key: "stock",
            sorter: (a, b) => a.stock - b.stock,
            render: (stock) => (
                <span
                    className={`font-medium ${stock <= 0 ? "text-red-500" : stock < 10 ? "text-orange-500" : "text-green-500"}`}
                >
                    {stock}
                </span>
            ),
        },
        {
            title: "Buying Price",
            dataIndex: "buying_price",
            key: "buying_price",
            sorter: (a, b) => a.buying_price - b.buying_price,
            render: (price) => `₹${price.toFixed(2)}`,
        },
        {
            title: "Selling Price",
            dataIndex: "selling_price",
            key: "selling_price",
            sorter: (a, b) => a.selling_price - b.selling_price,
            render: (price) => `₹${price.toFixed(2)}`,
        },
        {
            title: "Inventory Value",
            dataIndex: "inventory_value",
            key: "inventory_value",
            sorter: (a, b) => a.inventory_value - b.inventory_value,
            render: (value) => `₹${value.toFixed(2)}`,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            filters: [
                { text: "In Stock", value: "In Stock" },
                { text: "Low Stock", value: "Low Stock" },
                { text: "Out of Stock", value: "Out of Stock" },
            ],
            onFilter: (value, record) => record.status === value,
            render: (status) => (
                <Tag
                    color={getStatusColor(status)}
                    icon={getStatusIcon(status)}
                >
                    {status}
                </Tag>
            ),
        },
    ];

    const calculateSummary = () => {
        const totalProducts = filteredData.length;
        const inStock = filteredData.filter(
            (item) => item.status === "In Stock"
        ).length;
        const lowStock = filteredData.filter(
            (item) => item.status === "Low Stock"
        ).length;
        const outOfStock = filteredData.filter(
            (item) => item.status === "Out of Stock"
        ).length;
        const totalInventoryValue = filteredData.reduce(
            (sum, item) => sum + item.inventory_value,
            0
        );

        return {
            totalProducts,
            inStock,
            lowStock,
            outOfStock,
            totalInventoryValue,
        };
    };

    const summary = calculateSummary();

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Products"
                            value={summary.totalProducts}
                            valueStyle={{ color: "#1890ff" }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="In Stock"
                            value={summary.inStock}
                            valueStyle={{ color: "#52c41a" }}
                            prefix={<CheckCircleOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Low Stock"
                            value={summary.lowStock}
                            valueStyle={{ color: "#fa8c16" }}
                            prefix={<WarningOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Out of Stock"
                            value={summary.outOfStock}
                            valueStyle={{ color: "#ff4d4f" }}
                            prefix={<StopOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Total Inventory Value */}
            <Card>
                <Statistic
                    title="Total Inventory Value"
                    value={summary.totalInventoryValue}
                    precision={2}
                    prefix="₹"
                    valueStyle={{ color: "#722ed1", fontSize: "28px" }}
                />
            </Card>

            {/* Stock Report Table */}
            <Card
                title="Stock Report"
                extra={
                    <Space>
                        <Input
                            placeholder="Search products..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{ width: 250 }}
                        />
                        <Button onClick={fetchStockReport} loading={loading}>
                            Refresh
                        </Button>
                    </Space>
                }
            >
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    rowKey="_id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} items`,
                    }}
                    scroll={{ x: 1200 }}
                    rowClassName={(record) => {
                        if (record.status === "Out of Stock")
                            return "bg-red-50";
                        if (record.status === "Low Stock")
                            return "bg-orange-50";
                        return "";
                    }}
                />
            </Card>
        </div>
    );
};

export default StockReport;
