import React, { useState, useEffect } from "react";
import {
    Table,
    Button,
    Input,
    Select,
    DatePicker,
    Tag,
    Space,
    Modal,
    Form,
    InputNumber,
    Card,
    Row,
    Col,
    Statistic,
    Drawer,
    Descriptions,
    Empty,
    Spin,
    Tooltip,
} from "antd";
import {
    PlusOutlined,
    SearchOutlined,
    EyeOutlined,
    FilePdfOutlined,
    ReloadOutlined,
    FilterOutlined,
    ShoppingCartOutlined,
    DollarOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
} from "@ant-design/icons";
import { toast } from "react-hot-toast";
import { api } from "../api/api";
import dayjs from "dayjs";

const { Option } = Select;
const { RangePicker } = DatePicker;

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const [filters, setFilters] = useState({
        search: "",
        customer_id: "",
        order_status: "",
        date_range: null,
        total_range: { min: "", max: "" },
    });
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderDetails, setOrderDetails] = useState([]);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [createForm] = Form.useForm();
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        completed: 0,
        revenue: 0,
    });

    // Fetch orders with filters and pagination
    const fetchOrders = async (
        page = 1,
        pageSize = 10,
        currentFilters = filters
    ) => {
        setLoading(true);
        try {
            const params = {
                page,
                limit: pageSize,
                ...(currentFilters.search && { search: currentFilters.search }),
                ...(currentFilters.customer_id && {
                    customer_id: currentFilters.customer_id,
                }),
                ...(currentFilters.order_status && {
                    order_status: currentFilters.order_status,
                }),
                ...(currentFilters.date_range && {
                    start_date:
                        currentFilters.date_range[0].format("YYYY-MM-DD"),
                    end_date: currentFilters.date_range[1].format("YYYY-MM-DD"),
                }),
                ...(currentFilters.total_range.min && {
                    min_total: currentFilters.total_range.min,
                }),
                ...(currentFilters.total_range.max && {
                    max_total: currentFilters.total_range.max,
                }),
            };

            const response = await api.get("/orders", { params });
            setOrders(response.data.data.orders);
            setPagination({
                current: response.data.data.pagination.page,
                pageSize: response.data.data.pagination.limit,
                total: response.data.data.pagination.total,
            });

            // Calculate stats
            const totalOrders = response.data.data.pagination.total;
            const pendingOrders = response.data.data.orders.filter(
                (order) => order.order_status === "pending"
            ).length;
            const completedOrders = response.data.data.orders.filter(
                (order) => order.order_status === "completed"
            ).length;
            const totalRevenue = response.data.data.orders.reduce(
                (sum, order) => sum + order.total,
                0
            );

            setStats({
                total: totalOrders,
                pending: pendingOrders,
                completed: completedOrders,
                revenue: totalRevenue,
            });
        } catch (error) {
            toast.error("Failed to fetch orders");
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch customers for create order form
    const fetchCustomers = async () => {
        try {
            const response = await api.get("/customers");
            setCustomers(response.data.data);
        } catch (error) {
            console.error("Error fetching customers:", error);
        }
    };

    // Fetch products for create order form
    const fetchProducts = async () => {
        try {
            const response = await api.get("/products");
            setProducts(response.data.data.products || response.data.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    // Fetch order details
    const fetchOrderDetails = async (orderId) => {
        setDetailsLoading(true);
        try {
            const response = await api.get(`/orders/${orderId}/details`);
            setOrderDetails(response.data.data);
        } catch (error) {
            toast.error("Failed to fetch order details");
            console.error("Error fetching order details:", error);
        } finally {
            setDetailsLoading(false);
        }
    };

    // Update order status
    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await api.patch(`/orders/${orderId}/status`, {
                order_status: newStatus,
            });
            toast.success("Order status updated successfully");
            fetchOrders(pagination.current, pagination.pageSize);
        } catch (error) {
            toast.error("Failed to update order status");
            console.error("Error updating order status:", error);
        }
    };

    // Generate invoice
    const generateInvoice = async (orderId, invoiceNo) => {
        try {
            const response = await api.get(`/orders/${orderId}/invoice`, {
                responseType: "blob",
            });

            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `invoice-${invoiceNo}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success("Invoice downloaded successfully");
        } catch (error) {
            toast.error("Failed to generate invoice");
            console.error("Error generating invoice:", error);
        }
    };

    // Create new order
    const createOrder = async (values) => {
        try {
            const orderData = {
                customer_id: values.customer_id,
                invoice_no: values.invoice_no,
                order_status: values.order_status || "pending",
                orderItems: values.orderItems.map((item) => ({
                    product_id: item.product_id,
                    quantity: item.quantity,
                    unitcost: item.unitcost,
                })),
            };

            // Calculate totals
            const subTotal = orderData.orderItems.reduce(
                (sum, item) => sum + item.quantity * item.unitcost,
                0
            );
            const gst = subTotal * 0.18; // 18% GST
            const total = subTotal + gst;

            orderData.sub_total = subTotal;
            orderData.gst = gst;
            orderData.total = total;
            orderData.total_products = orderData.orderItems.length;

            await api.post("/orders", orderData);
            toast.success("Order created successfully");
            setCreateModalVisible(false);
            createForm.resetFields();
            fetchOrders();
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to create order"
            );
            console.error("Error creating order:", error);
        }
    };

    useEffect(() => {
        fetchOrders();
        fetchCustomers();
        fetchProducts();
    }, []);

    const handleTableChange = (paginationInfo) => {
        fetchOrders(paginationInfo.current, paginationInfo.pageSize);
    };

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
    };

    const applyFilters = () => {
        fetchOrders(1, pagination.pageSize, filters);
    };

    const resetFilters = () => {
        const resetFilters = {
            search: "",
            customer_id: "",
            order_status: "",
            date_range: null,
            total_range: { min: "", max: "" },
        };
        setFilters(resetFilters);
        fetchOrders(1, pagination.pageSize, resetFilters);
    };

    const showOrderDetails = (order) => {
        setSelectedOrder(order);
        setDetailsDrawerVisible(true);
        fetchOrderDetails(order._id);
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: "orange",
            processing: "blue",
            completed: "green",
            cancelled: "red",
        };
        return colors[status] || "default";
    };

    const getStatusIcon = (status) => {
        const icons = {
            pending: <ClockCircleOutlined />,
            processing: <ClockCircleOutlined />,
            completed: <CheckCircleOutlined />,
            cancelled: <ClockCircleOutlined />,
        };
        return icons[status];
    };

    const columns = [
        {
            title: "Invoice No",
            dataIndex: "invoice_no",
            key: "invoice_no",
            render: (text) => (
                <span className="font-medium text-blue-600">#{text}</span>
            ),
        },
        {
            title: "Customer",
            dataIndex: ["customer_id", "name"],
            key: "customer",
            render: (text, record) => record.customer_id?.name || "N/A",
        },
        {
            title: "Date",
            dataIndex: "order_date",
            key: "order_date",
            render: (date) => dayjs(date).format("MMM DD, YYYY"),
        },
        {
            title: "Status",
            dataIndex: "order_status",
            key: "order_status",
            render: (status) => (
                <Tag
                    icon={getStatusIcon(status)}
                    color={getStatusColor(status)}
                >
                    {status.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: "Items",
            dataIndex: "total_products",
            key: "total_products",
            render: (count) => <span className="font-medium">{count}</span>,
        },
        {
            title: "Total",
            dataIndex: "total",
            key: "total",
            render: (amount) => (
                <span className="font-semibold text-green-600">
                    ${amount.toFixed(2)}
                </span>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="View Details">
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            onClick={() => showOrderDetails(record)}
                            className="text-blue-600 hover:text-blue-800"
                        />
                    </Tooltip>

                    <Tooltip title="Update Status">
                        <Select
                            value={record.order_status}
                            size="small"
                            style={{ width: 100 }}
                            onChange={(value) =>
                                updateOrderStatus(record._id, value)
                            }
                        >
                            <Option value="pending">Pending</Option>
                            <Option value="processing">Processing</Option>
                            <Option value="completed">Completed</Option>
                            <Option value="cancelled">Cancelled</Option>
                        </Select>
                    </Tooltip>

                    <Tooltip title="Download Invoice">
                        <Button
                            type="text"
                            icon={<FilePdfOutlined />}
                            onClick={() =>
                                generateInvoice(record._id, record.invoice_no)
                            }
                            className="text-red-600 hover:text-red-800"
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6 bg-white min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h1
                            className="flex items-center gap-2
                        truncate mb-1 text-4xl font-bold"
                        >
                            Orders
                            <ShoppingCartOutlined className="text-blue-600" />
                        </h1>
                        <p className="mt-1 text-gray-500 text-base md:text-sm hidden sm:block">
                            Manage and track your orders
                        </p>
                    </div>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setCreateModalVisible(true)}
                        size="large"
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        Create Order
                    </Button>
                </div>

                {/* Stats Cards */}
                <Row gutter={16} className="mb-6">
                    <Col xs={24} sm={12} md={6}>
                        <Card className="border-0 shadow-sm">
                            <Statistic
                                title="Total Orders"
                                value={stats.total}
                                prefix={
                                    <ShoppingCartOutlined className="text-blue-600" />
                                }
                                valueStyle={{ color: "#1890ff" }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card className="border-0 shadow-sm">
                            <Statistic
                                title="Pending Orders"
                                value={stats.pending}
                                prefix={
                                    <ClockCircleOutlined className="text-orange-500" />
                                }
                                valueStyle={{ color: "#fa8c16" }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card className="border-0 shadow-sm">
                            <Statistic
                                title="Completed Orders"
                                value={stats.completed}
                                prefix={
                                    <CheckCircleOutlined className="text-green-500" />
                                }
                                valueStyle={{ color: "#52c41a" }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card className="border-0 shadow-sm">
                            <Statistic
                                title="Total Revenue"
                                value={stats.revenue}
                                prefix={
                                    <DollarOutlined className="text-green-600" />
                                }
                                precision={2}
                                valueStyle={{ color: "#389e0d" }}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>

            {/* Filters */}
            <Card className="mb-6 border-0 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-4">
                    <Input
                        placeholder="Search by invoice..."
                        prefix={<SearchOutlined />}
                        value={filters.search}
                        onChange={(e) =>
                            handleFilterChange("search", e.target.value)
                        }
                        allowClear
                    />

                    <Select
                        placeholder="Select Customer"
                        value={filters.customer_id}
                        onChange={(value) =>
                            handleFilterChange("customer_id", value)
                        }
                        allowClear
                        showSearch
                        optionFilterProp="children"
                    >
                        {customers.map((customer) => (
                            <Option key={customer._id} value={customer._id}>
                                {customer.name}
                            </Option>
                        ))}
                    </Select>

                    <Select
                        placeholder="Order Status"
                        value={filters.order_status}
                        onChange={(value) =>
                            handleFilterChange("order_status", value)
                        }
                        allowClear
                    >
                        <Option value="pending">Pending</Option>
                        <Option value="processing">Processing</Option>
                        <Option value="completed">Completed</Option>
                        <Option value="cancelled">Cancelled</Option>
                    </Select>

                    <RangePicker
                        placeholder={["Start Date", "End Date"]}
                        value={filters.date_range}
                        onChange={(dates) =>
                            handleFilterChange("date_range", dates)
                        }
                        className="w-full"
                    />

                    <InputNumber
                        placeholder="Min Total"
                        value={filters.total_range.min}
                        onChange={(value) =>
                            handleFilterChange("total_range", {
                                ...filters.total_range,
                                min: value,
                            })
                        }
                        className="w-full"
                        min={0}
                    />

                    <InputNumber
                        placeholder="Max Total"
                        value={filters.total_range.max}
                        onChange={(value) =>
                            handleFilterChange("total_range", {
                                ...filters.total_range,
                                max: value,
                            })
                        }
                        className="w-full"
                        min={0}
                    />
                </div>

                <div className="flex gap-2">
                    <Button
                        type="primary"
                        icon={<FilterOutlined />}
                        onClick={applyFilters}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        Apply Filters
                    </Button>
                    <Button icon={<ReloadOutlined />} onClick={resetFilters}>
                        Reset
                    </Button>
                </div>
            </Card>

            {/* Orders Table */}
            <Card className="border-0 shadow-sm">
                <Table
                    columns={columns}
                    dataSource={orders}
                    rowKey="_id"
                    loading={loading}
                    pagination={{
                        current: pagination.current,
                        pageSize: pagination.pageSize,
                        total: pagination.total,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} items`,
                    }}
                    onChange={handleTableChange}
                    className="overflow-x-auto"
                    scroll={{ x: 800 }}
                />
            </Card>

            {/* Create Order Modal */}
            <Modal
                title="Create New Order"
                open={createModalVisible}
                onCancel={() => {
                    setCreateModalVisible(false);
                    createForm.resetFields();
                }}
                footer={null}
                width={800}
                className="top-4"
            >
                <Form
                    form={createForm}
                    layout="vertical"
                    onFinish={createOrder}
                    className="mt-4"
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="customer_id"
                                label="Customer"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please select a customer",
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="Select Customer"
                                    showSearch
                                    optionFilterProp="children"
                                >
                                    {customers.map((customer) => (
                                        <Option
                                            key={customer._id}
                                            value={customer._id}
                                        >
                                            {customer.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="invoice_no"
                                label="Invoice Number"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter invoice number",
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="Enter invoice number"
                                    maxLength={10}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="order_status"
                        label="Order Status"
                        initialValue="pending"
                    >
                        <Select>
                            <Option value="pending">Pending</Option>
                            <Option value="processing">Processing</Option>
                            <Option value="completed">Completed</Option>
                        </Select>
                    </Form.Item>

                    <Form.List name="orderItems" initialValue={[{}]}>
                        {(fields, { add, remove }) => (
                            <>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-medium">
                                        Order Items
                                    </h3>
                                    <Button
                                        type="dashed"
                                        onClick={() => add()}
                                        icon={<PlusOutlined />}
                                    >
                                        Add Item
                                    </Button>
                                </div>
                                {fields.map(({ key, name, ...restField }) => (
                                    <div
                                        key={key}
                                        className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50"
                                    >
                                        <Row gutter={16}>
                                            <Col span={8}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, "product_id"]}
                                                    label="Product"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Please select a product",
                                                        },
                                                    ]}
                                                >
                                                    <Select
                                                        placeholder="Select Product"
                                                        showSearch
                                                        optionFilterProp="children"
                                                    >
                                                        {products.map(
                                                            (product) => (
                                                                <Option
                                                                    key={
                                                                        product._id
                                                                    }
                                                                    value={
                                                                        product._id
                                                                    }
                                                                >
                                                                    {
                                                                        product.product_name
                                                                    }
                                                                </Option>
                                                            )
                                                        )}
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col span={6}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, "quantity"]}
                                                    label="Quantity"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Please enter quantity",
                                                        },
                                                    ]}
                                                >
                                                    <InputNumber
                                                        placeholder="Quantity"
                                                        min={1}
                                                        className="w-full"
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={6}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, "unitcost"]}
                                                    label="Unit Cost"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Please enter unit cost",
                                                        },
                                                    ]}
                                                >
                                                    <InputNumber
                                                        placeholder="Unit Cost"
                                                        min={0}
                                                        step={0.01}
                                                        className="w-full"
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col
                                                span={4}
                                                className="flex items-end"
                                            >
                                                <Button
                                                    type="text"
                                                    danger
                                                    onClick={() => remove(name)}
                                                    className="mb-6"
                                                >
                                                    Remove
                                                </Button>
                                            </Col>
                                        </Row>
                                    </div>
                                ))}
                            </>
                        )}
                    </Form.List>

                    <div className="flex justify-end gap-2 mt-6">
                        <Button onClick={() => setCreateModalVisible(false)}>
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            Create Order
                        </Button>
                    </div>
                </Form>
            </Modal>

            {/* Order Details Drawer */}
            <Drawer
                title={`Order Details - ${selectedOrder?.invoice_no}`}
                placement="right"
                onClose={() => setDetailsDrawerVisible(false)}
                open={detailsDrawerVisible}
                width={600}
            >
                {selectedOrder && (
                    <div className="space-y-6">
                        <Descriptions title="Order Information" bordered>
                            <Descriptions.Item label="Invoice No" span={2}>
                                #{selectedOrder.invoice_no}
                            </Descriptions.Item>
                            <Descriptions.Item label="Status">
                                <Tag
                                    icon={getStatusIcon(
                                        selectedOrder.order_status
                                    )}
                                    color={getStatusColor(
                                        selectedOrder.order_status
                                    )}
                                >
                                    {selectedOrder.order_status.toUpperCase()}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Customer">
                                {selectedOrder.customer_id?.name || "N/A"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Order Date">
                                {dayjs(selectedOrder.order_date).format(
                                    "MMMM DD, YYYY"
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Total Products">
                                {selectedOrder.total_products}
                            </Descriptions.Item>
                            <Descriptions.Item label="Sub Total">
                                ${selectedOrder.sub_total?.toFixed(2)}
                            </Descriptions.Item>
                            <Descriptions.Item label="GST (18%)">
                                $
                                {(
                                    selectedOrder.total -
                                    selectedOrder.sub_total
                                )?.toFixed(2)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Total Amount">
                                <span className="text-lg font-semibold text-green-600">
                                    ${selectedOrder.total?.toFixed(2)}
                                </span>
                            </Descriptions.Item>
                        </Descriptions>

                        <div>
                            <h3 className="text-lg font-medium mb-4">
                                Order Items
                            </h3>
                            {detailsLoading ? (
                                <div className="text-center py-8">
                                    <Spin size="large" />
                                </div>
                            ) : orderDetails.length > 0 ? (
                                <div className="space-y-3">
                                    {orderDetails.map((item, index) => (
                                        <Card
                                            key={index}
                                            size="small"
                                            className="border border-gray-200"
                                        >
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h4 className="font-medium">
                                                        {
                                                            item.product_id
                                                                ?.product_name
                                                        }
                                                    </h4>
                                                    <p className="text-gray-500 text-sm">
                                                        Quantity:{" "}
                                                        {item.quantity} × $
                                                        {item.unitcost?.toFixed(
                                                            2
                                                        )}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-green-600">
                                                        $
                                                        {item.total?.toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <Empty description="No order items found" />
                            )}
                        </div>

                        <div className="flex gap-2 pt-4 border-t">
                            <Button
                                type="primary"
                                icon={<FilePdfOutlined />}
                                onClick={() =>
                                    generateInvoice(
                                        selectedOrder._id,
                                        selectedOrder.invoice_no
                                    )
                                }
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Download Invoice
                            </Button>
                        </div>
                    </div>
                )}
            </Drawer>
        </div>
    );
};

export default Orders;
