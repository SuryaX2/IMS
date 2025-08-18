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
    FileExcelOutlined,
    ReloadOutlined,
} from "@ant-design/icons";
import { api } from "../../api/api";
import AuthContext from "../../context/AuthContext";
import toast from "react-hot-toast";
import dayjs from "dayjs";

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

    const exportToCSV = () => {
        if (filteredData.length === 0) {
            toast.error("No data to export");
            return;
        }

        // Prepare CSV data
        const csvData = [];

        // Add summary
        csvData.push(["Stock Report Summary"]);
        const summary = calculateSummary();
        csvData.push(["Total Products", summary.totalProducts]);
        csvData.push(["Products In Stock", summary.inStock]);
        csvData.push(["Products Low Stock", summary.lowStock]);
        csvData.push(["Products Out of Stock", summary.outOfStock]);
        csvData.push([
            "Total Inventory Value (in rupees)",
            `${summary.totalInventoryValue.toFixed(2)}`,
        ]);
        csvData.push([""]);

        // Add headers
        csvData.push([
            "Product Code",
            "Product Name",
            "Category",
            "Unit",
            "Stock Quantity",
            "Buying Price (in rupees)",
            "Selling Price (in rupees)",
            "Inventory Value (in rupees)",
            "Status",
        ]);

        // Add stock data
        filteredData.forEach((item) => {
            csvData.push([
                item.product_code,
                item.product_name,
                item.category_name,
                item.unit_name,
                item.stock,
                `${item.buying_price.toFixed(2)}`,
                `${item.selling_price.toFixed(2)}`,
                `${item.inventory_value.toFixed(2)}`,
                item.status,
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
                `stock-report-${dayjs().format("YYYY-MM-DD")}.csv`
            );
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        toast.success("Stock report exported successfully!");
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
            width: 120,
        },
        {
            title: "Product Name",
            dataIndex: "product_name",
            key: "product_name",
            sorter: (a, b) => a.product_name.localeCompare(b.product_name),
            width: 200,
        },
        {
            title: "Category",
            dataIndex: "category_name",
            key: "category_name",
            sorter: (a, b) => a.category_name.localeCompare(b.category_name),
            width: 150,
        },
        {
            title: "Unit",
            dataIndex: "unit_name",
            key: "unit_name",
            width: 80,
        },
        {
            title: "Stock",
            dataIndex: "stock",
            key: "stock",
            sorter: (a, b) => a.stock - b.stock,
            width: 100,
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
            width: 120,
            render: (price) => (
                <span className="font-medium text-blue-600">
                    ₹{price.toFixed(2)}
                </span>
            ),
        },
        {
            title: "Selling Price",
            dataIndex: "selling_price",
            key: "selling_price",
            sorter: (a, b) => a.selling_price - b.selling_price,
            width: 120,
            render: (price) => (
                <span className="font-medium text-green-600">
                    ₹{price.toFixed(2)}
                </span>
            ),
        },
        {
            title: "Inventory Value",
            dataIndex: "inventory_value",
            key: "inventory_value",
            sorter: (a, b) => a.inventory_value - b.inventory_value,
            width: 140,
            render: (value) => (
                <span className="font-medium text-purple-600">
                    ₹{value.toFixed(2)}
                </span>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: 120,
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
            {/* Export Controls */}
            <Card title="Filter and Export Options">
                <div className="flex justify-between items-center flex-wrap gap-4">
                    <Space>
                        <Input
                            placeholder="Search products..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{ width: 250 }}
                        />
                        <Button
                            type="primary"
                            icon={<ReloadOutlined />}
                            onClick={fetchStockReport}
                            loading={loading}
                        >
                            Refresh Report
                        </Button>
                    </Space>
                    <Button
                        icon={<FileExcelOutlined />}
                        onClick={exportToCSV}
                        disabled={filteredData.length === 0}
                        className="bg-green-500 text-white hover:bg-green-600"
                    >
                        Export to CSV
                    </Button>
                </div>
            </Card>

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
            <Card title={`Stock Report (${filteredData.length} products)`}>
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    rowKey="_id"
                    loading={loading}
                    pagination={{
                        pageSize: 15,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} items`,
                        pageSizeOptions: ["10", "15", "25", "50", "100"],
                    }}
                    scroll={{ x: 1300 }}
                    rowClassName={(record) => {
                        if (record.status === "Out of Stock")
                            return "bg-red-50 border-l-4 border-red-400";
                        if (record.status === "Low Stock")
                            return "bg-orange-50 border-l-4 border-orange-400";
                        return "bg-green-50 border-l-4 border-green-200";
                    }}
                />
            </Card>

            {filteredData.length === 0 && !loading && stockData.length > 0 && (
                <Card>
                    <div className="text-center py-8">
                        <SearchOutlined
                            style={{ fontSize: "48px", color: "#d9d9d9" }}
                        />
                        <p className="text-gray-500 mt-4">
                            No products found matching your search criteria
                        </p>
                        <p className="text-gray-400">
                            Try adjusting your search terms or clear the search
                            to see all products
                        </p>
                    </div>
                </Card>
            )}

            {stockData.length === 0 && !loading && (
                <Card>
                    <div className="text-center py-8">
                        <StopOutlined
                            style={{ fontSize: "48px", color: "#d9d9d9" }}
                        />
                        <p className="text-gray-500 mt-4">
                            No stock data available
                        </p>
                        <p className="text-gray-400">
                            Add some products to your inventory to see the stock
                            report
                        </p>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default StockReport;
