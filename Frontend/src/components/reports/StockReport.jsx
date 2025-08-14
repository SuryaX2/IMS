import React, { useState, useEffect } from "react";
import {
    Table,
    Card,
    Statistic,
    Row,
    Col,
    Tag,
    Button,
    Input,
    Select,
    Spin,
    Typography,
    Alert,
} from "antd";
import {
    SearchOutlined,
    InboxOutlined,
    WarningOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    DownloadOutlined,
} from "@ant-design/icons";
import { api } from "../../api/api";
import toast from "react-hot-toast";

const { Title } = Typography;
const { Option } = Select;

const StockReport = () => {
    const [stockData, setStockData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [filteredData, setFilteredData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [stats, setStats] = useState({
        totalProducts: 0,
        inStock: 0,
        lowStock: 0,
        outOfStock: 0,
        totalValue: 0,
    });

    useEffect(() => {
        fetchStockReport();
        fetchCategories();
    }, []);

    useEffect(() => {
        filterData();
        calculateStats();
    }, [stockData, searchText, statusFilter, categoryFilter]);

    const fetchStockReport = async () => {
        try {
            setLoading(true);
            const response = await api.get("/reports/stock");
            if (response.data.success) {
                setStockData(response.data.data);
                toast.success("Stock report loaded successfully");
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to fetch stock report"
            );
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await api.get("/categories/user");
            if (response.data.success) {
                setCategories(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        }
    };

    const filterData = () => {
        let filtered = stockData;

        // Search filter
        if (searchText) {
            filtered = filtered.filter(
                (item) =>
                    item.product_name
                        .toLowerCase()
                        .includes(searchText.toLowerCase()) ||
                    item.product_code
                        .toLowerCase()
                        .includes(searchText.toLowerCase())
            );
        }

        // Status filter
        if (statusFilter !== "all") {
            filtered = filtered.filter((item) => item.status === statusFilter);
        }

        // Category filter
        if (categoryFilter !== "all") {
            filtered = filtered.filter(
                (item) => item.category_name === categoryFilter
            );
        }

        setFilteredData(filtered);
    };

    const calculateStats = () => {
        const totalProducts = stockData.length;
        const inStock = stockData.filter(
            (item) => item.status === "In Stock"
        ).length;
        const lowStock = stockData.filter(
            (item) => item.status === "Low Stock"
        ).length;
        const outOfStock = stockData.filter(
            (item) => item.status === "Out of Stock"
        ).length;
        const totalValue = stockData.reduce(
            (sum, item) => sum + item.inventory_value,
            0
        );

        setStats({
            totalProducts,
            inStock,
            lowStock,
            outOfStock,
            totalValue,
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "In Stock":
                return "green";
            case "Low Stock":
                return "orange";
            case "Out of Stock":
                return "red";
            default:
                return "default";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "In Stock":
                return <CheckCircleOutlined />;
            case "Low Stock":
                return <WarningOutlined />;
            case "Out of Stock":
                return <CloseCircleOutlined />;
            default:
                return <InboxOutlined />;
        }
    };

    const exportToCSV = () => {
        const headers = [
            "Product Name",
            "Product Code",
            "Category",
            "Unit",
            "Stock",
            "Buying Price",
            "Selling Price",
            "Inventory Value",
            "Status",
        ];

        const csvContent = [
            headers.join(","),
            ...filteredData.map((row) =>
                [
                    row.product_name,
                    row.product_code,
                    row.category_name,
                    row.unit_name,
                    row.stock,
                    row.buying_price,
                    row.selling_price,
                    row.inventory_value,
                    row.status,
                ].join(",")
            ),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `stock-report-${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const columns = [
        {
            title: "Product Name",
            dataIndex: "product_name",
            key: "product_name",
            sorter: (a, b) => a.product_name.localeCompare(b.product_name),
            render: (text, record) => (
                <div>
                    <div className="font-medium">{text}</div>
                    <div className="text-sm text-gray-500">
                        {record.product_code}
                    </div>
                </div>
            ),
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
                <span className={stock < 10 ? "text-red-500 font-medium" : ""}>
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

    return (
        <div className="space-y-6">
            {/* Statistics Cards */}
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Products"
                            value={stats.totalProducts}
                            prefix={<InboxOutlined />}
                            valueStyle={{ color: "#1890ff" }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="In Stock"
                            value={stats.inStock}
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ color: "#52c41a" }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Low Stock"
                            value={stats.lowStock}
                            prefix={<WarningOutlined />}
                            valueStyle={{ color: "#fa8c16" }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Out of Stock"
                            value={stats.outOfStock}
                            prefix={<CloseCircleOutlined />}
                            valueStyle={{ color: "#f5222d" }}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={24}>
                    <Card>
                        <Statistic
                            title="Total Inventory Value"
                            value={stats.totalValue}
                            precision={2}
                            prefix="₹"
                            valueStyle={{ color: "#722ed1", fontSize: "24px" }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Filters and Actions */}
            <Card>
                <Row gutter={[16, 16]} className="mb-4">
                    <Col xs={24} sm={8} md={6}>
                        <Input
                            placeholder="Search products..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            allowClear
                        />
                    </Col>
                    <Col xs={24} sm={8} md={6}>
                        <Select
                            placeholder="Filter by status"
                            value={statusFilter}
                            onChange={setStatusFilter}
                            style={{ width: "100%" }}
                        >
                            <Option value="all">All Status</Option>
                            <Option value="In Stock">In Stock</Option>
                            <Option value="Low Stock">Low Stock</Option>
                            <Option value="Out of Stock">Out of Stock</Option>
                        </Select>
                    </Col>
                    <Col xs={24} sm={8} md={6}>
                        <Select
                            placeholder="Filter by category"
                            value={categoryFilter}
                            onChange={setCategoryFilter}
                            style={{ width: "100%" }}
                        >
                            <Option value="all">All Categories</Option>
                            {categories.map((category) => (
                                <Option
                                    key={category._id}
                                    value={category.category_name}
                                >
                                    {category.category_name}
                                </Option>
                            ))}
                        </Select>
                    </Col>
                    <Col xs={24} sm={24} md={6} className="flex gap-2">
                        <Button
                            type="primary"
                            icon={<DownloadOutlined />}
                            onClick={exportToCSV}
                            disabled={filteredData.length === 0}
                        >
                            Export CSV
                        </Button>
                    </Col>
                </Row>

                {stats.lowStock > 0 && (
                    <Alert
                        message={`Warning: ${stats.lowStock} products are running low on stock!`}
                        type="warning"
                        showIcon
                        className="mb-4"
                    />
                )}

                {stats.outOfStock > 0 && (
                    <Alert
                        message={`Critical: ${stats.outOfStock} products are out of stock!`}
                        type="error"
                        showIcon
                        className="mb-4"
                    />
                )}

                <Spin spinning={loading}>
                    <Table
                        columns={columns}
                        dataSource={filteredData}
                        rowKey="_id"
                        pagination={{
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} of ${total} items`,
                            defaultPageSize: 10,
                            pageSizeOptions: ["10", "25", "50", "100"],
                        }}
                        scroll={{ x: 1200 }}
                        size="middle"
                        className="custom-table"
                    />
                </Spin>
            </Card>
        </div>
    );
};

export default StockReport;
