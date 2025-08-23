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
            title: "Code",
            dataIndex: "product_code",
            key: "product_code",
            sorter: (a, b) => a.product_code.localeCompare(b.product_code),
            width: window.innerWidth < 768 ? 80 : 120,
            ellipsis: true,
        },
        {
            title: "Product Name",
            dataIndex: "product_name",
            key: "product_name",
            sorter: (a, b) => a.product_name.localeCompare(b.product_name),
            width: window.innerWidth < 768 ? 120 : 200,
            ellipsis: true,
        },
        {
            title: "Category",
            dataIndex: "category_name",
            key: "category_name",
            sorter: (a, b) => a.category_name.localeCompare(b.category_name),
            width: window.innerWidth < 768 ? 80 : 150,
            ellipsis: true,
            responsive: ["sm"],
        },
        {
            title: "Unit",
            dataIndex: "unit_name",
            key: "unit_name",
            width: 60,
            responsive: ["md"],
        },
        {
            title: "Stock",
            dataIndex: "stock",
            key: "stock",
            sorter: (a, b) => a.stock - b.stock,
            width: window.innerWidth < 768 ? 70 : 100,
            render: (stock) => (
                <span
                    className={`font-medium text-sm sm:text-base ${
                        stock <= 0
                            ? "text-red-500"
                            : stock < 10
                              ? "text-orange-500"
                              : "text-green-500"
                    }`}
                >
                    {stock}
                </span>
            ),
        },
        {
            title: "Buy Price",
            dataIndex: "buying_price",
            key: "buying_price",
            sorter: (a, b) => a.buying_price - b.buying_price,
            width: window.innerWidth < 768 ? 80 : 120,
            render: (price) => (
                <span className="font-medium text-blue-600 text-xs sm:text-sm">
                    ₹{price.toFixed(0)}
                </span>
            ),
            responsive: ["sm"],
        },
        {
            title: "Sell Price",
            dataIndex: "selling_price",
            key: "selling_price",
            sorter: (a, b) => a.selling_price - b.selling_price,
            width: window.innerWidth < 768 ? 80 : 120,
            render: (price) => (
                <span className="font-medium text-green-600 text-xs sm:text-sm">
                    ₹{price.toFixed(0)}
                </span>
            ),
            responsive: ["md"],
        },
        {
            title: "Inventory Value",
            dataIndex: "inventory_value",
            key: "inventory_value",
            sorter: (a, b) => a.inventory_value - b.inventory_value,
            width: window.innerWidth < 768 ? 100 : 140,
            render: (value) => (
                <span className="font-medium text-purple-600 text-xs sm:text-sm">
                    ₹{value.toFixed(0)}
                </span>
            ),
            responsive: ["lg"],
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: window.innerWidth < 768 ? 90 : 120,
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
                    className={`text-xs ${window.innerWidth < 768 ? "px-1" : ""}`}
                >
                    {window.innerWidth < 768
                        ? status.split(" ")[0] // Show only first word on mobile
                        : status}
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
        <div className="space-y-4 sm:space-y-6">
            {/* Export Controls */}
            <Card title="Filter and Export Options">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Input
                            placeholder="Search products..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="w-full sm:w-60"
                            allowClear
                        />
                        <Button
                            type="primary"
                            icon={<ReloadOutlined />}
                            onClick={fetchStockReport}
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
                        disabled={filteredData.length === 0}
                        className="bg-green-500 text-white hover:bg-green-600 w-full sm:w-auto"
                    >
                        <span className="hidden sm:inline">Export to CSV</span>
                        <span className="sm:hidden">Export</span>
                    </Button>
                </div>
            </Card>

            {/* Summary Cards */}
            <Row gutter={[8, 8]} className="mb-4 sm:mb-6">
                <Col xs={12} sm={6} lg={6}>
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
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6} lg={6}>
                    <Card className="h-full">
                        <Statistic
                            title={
                                <span className="text-xs sm:text-sm">
                                    In Stock
                                </span>
                            }
                            value={summary.inStock}
                            valueStyle={{
                                color: "#52c41a",
                                fontSize: "clamp(1rem, 4vw, 1.5rem)",
                            }}
                            prefix={<CheckCircleOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6} lg={6}>
                    <Card className="h-full">
                        <Statistic
                            title={
                                <span className="text-xs sm:text-sm">
                                    Low Stock
                                </span>
                            }
                            value={summary.lowStock}
                            valueStyle={{
                                color: "#fa8c16",
                                fontSize: "clamp(1rem, 4vw, 1.5rem)",
                            }}
                            prefix={<WarningOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6} lg={6}>
                    <Card className="h-full">
                        <Statistic
                            title={
                                <span className="text-xs sm:text-sm">
                                    Out of Stock
                                </span>
                            }
                            value={summary.outOfStock}
                            valueStyle={{
                                color: "#ff4d4f",
                                fontSize: "clamp(1rem, 4vw, 1.5rem)",
                            }}
                            prefix={<StopOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Total Inventory Value */}
            <Card>
                <Statistic
                    title={
                        <span className="text-sm sm:text-base">
                            {window.innerWidth < 768
                                ? "Inventory Value"
                                : "Total Inventory Value"}
                        </span>
                    }
                    value={summary.totalInventoryValue}
                    precision={2}
                    prefix="₹"
                    valueStyle={{
                        color: "#722ed1",
                        fontSize: window.innerWidth < 768 ? "20px" : "28px",
                    }}
                />
            </Card>

            {/* Stock Report Table */}
            <Card
                title={
                    <span className="text-sm sm:text-base">
                        {window.innerWidth < 768
                            ? `Stock Report (${filteredData.length})`
                            : `Stock Report (${filteredData.length} products)`}
                    </span>
                }
            >
                <div className="overflow-x-auto">
                    <Table
                        columns={columns}
                        dataSource={filteredData}
                        rowKey="_id"
                        loading={loading}
                        pagination={{
                            pageSize: window.innerWidth < 768 ? 8 : 15,
                            showSizeChanger: window.innerWidth >= 768,
                            showQuickJumper: window.innerWidth >= 1024,
                            showTotal: (total, range) =>
                                window.innerWidth >= 768
                                    ? `${range[0]}-${range[1]} of ${total} items`
                                    : `${range[0]}-${range[1]}/${total}`,
                            pageSizeOptions:
                                window.innerWidth >= 768
                                    ? ["10", "15", "25", "50", "100"]
                                    : ["5", "8", "15"],
                            simple: window.innerWidth < 768,
                        }}
                        scroll={{ x: 700 }}
                        size={window.innerWidth < 768 ? "small" : "middle"}
                        rowClassName={(record) => {
                            if (record.status === "Out of Stock")
                                return "bg-red-50 border-l-4 border-red-400";
                            if (record.status === "Low Stock")
                                return "bg-orange-50 border-l-4 border-orange-400";
                            return "bg-green-50 border-l-4 border-green-200";
                        }}
                    />
                </div>
            </Card>

            {filteredData.length === 0 && !loading && stockData.length > 0 && (
                <Card>
                    <div className="text-center py-8">
                        <SearchOutlined
                            style={{
                                fontSize:
                                    window.innerWidth < 768 ? "36px" : "48px",
                                color: "#d9d9d9",
                            }}
                        />
                        <p className="text-gray-500 mt-4 text-sm sm:text-base px-4">
                            No products found matching your search criteria
                        </p>
                        <p className="text-gray-400 text-xs sm:text-sm px-4">
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
                            style={{
                                fontSize:
                                    window.innerWidth < 768 ? "36px" : "48px",
                                color: "#d9d9d9",
                            }}
                        />
                        <p className="text-gray-500 mt-4 text-sm sm:text-base px-4">
                            No stock data available
                        </p>
                        <p className="text-gray-400 text-xs sm:text-sm px-4">
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
