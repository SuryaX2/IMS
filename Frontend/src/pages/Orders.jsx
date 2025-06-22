import React, { useState, useEffect } from "react";
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Select,
    DatePicker,
    Space,
    Tag,
    Card,
    Row,
    Col,
    Statistic,
    Divider,
    InputNumber,
    Popconfirm,
    Tooltip,
    Badge,
    Descriptions,
    Typography,
    Empty,
    Spin,
} from "antd";
import {
    PlusOutlined,
    EyeOutlined,
    EditOutlined,
    FileTextOutlined,
    SearchOutlined,
    FilterOutlined,
    ReloadOutlined,
    ShoppingCartOutlined,
    DollarOutlined,
    UserOutlined,
    CalendarOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import toast from "react-hot-toast";
import dayjs from "dayjs";

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text, Title } = Typography;

// Mock API functions - replace with your actual API calls
const mockApi = {
    getOrders: async (params) => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        return {
            data: {
                orders: [
                    {
                        _id: "1",
                        invoice_no: "INV-001",
                        customer_id: { _id: "c1", name: "John Doe" },
                        order_date: new Date().toISOString(),
                        order_status: "pending",
                        total_products: 3,
                        sub_total: 150.0,
                        gst: 27.0,
                        total: 177.0,
                        createdAt: new Date().toISOString(),
                    },
                    {
                        _id: "2",
                        invoice_no: "INV-002",
                        customer_id: { _id: "c2", name: "Jane Smith" },
                        order_date: new Date().toISOString(),
                        order_status: "completed",
                        total_products: 2,
                        sub_total: 200.0,
                        gst: 36.0,
                        total: 236.0,
                        createdAt: new Date().toISOString(),
                    },
                ],
                pagination: {
                    total: 2,
                    page: 1,
                    limit: 10,
                    pages: 1,
                },
            },
        };
    },

    getCustomers: async () => ({
        data: [
            {
                _id: "c1",
                name: "John Doe",
                phone: "123-456-7890",
                address: "123 Main St",
            },
            {
                _id: "c2",
                name: "Jane Smith",
                phone: "098-765-4321",
                address: "456 Oak Ave",
            },
        ],
    }),

    getProducts: async () => ({
        data: [
            {
                _id: "p1",
                product_name: "Product 1",
                product_code: "PRD001",
                selling_price: 50.0,
                stock_quantity: 100,
            },
            {
                _id: "p2",
                product_name: "Product 2",
                product_code: "PRD002",
                selling_price: 75.0,
                stock_quantity: 50,
            },
        ],
    }),

    createOrder: async (data) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return { data: { _id: "new-order", ...data } };
    },

    updateOrderStatus: async (id, status) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { data: { _id: id, order_status: status } };
    },

    getOrderDetails: async (id) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return {
            data: [
                {
                    _id: "od1",
                    product_id: {
                        _id: "p1",
                        product_name: "Product 1",
                        product_code: "PRD001",
                    },
                    quantity: 2,
                    unitcost: 50.0,
                    total: 100.0,
                },
            ],
        };
    },

    generateInvoice: async (id) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Simulate PDF download
        const link = document.createElement("a");
        link.href =
            "data:application/pdf;base64,JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PAovVGl0bGUgKP7/AEkAbgB2AG8AaQBjAGUAIABTAGEAbQBwAGwAZQApCi9Qcm9kdWNlciAo7/8ASQBuAHYAbwBpAGMAZQAgAFMAYQBtAHAAbABlACkKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDMgMCBSCj4+CmVuZG9iagozIDAgb2JqCjw8Ci9UeXBlIC9QYWdlcwovS2lkcyBbNCAwIFJdCi9Db3VudCAxCj4+CmVuZG9iagoxIDEgMAo=";
        link.download = `invoice-${id}.pdf`;
        link.click();
        return { success: true };
    },
};

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const [filters, setFilters] = useState({});
    const [searchText, setSearchText] = useState("");

    // Modals
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderDetails, setOrderDetails] = useState([]);
    const [detailsLoading, setDetailsLoading] = useState(false);

    // Forms
    const [createForm] = Form.useForm();
    const [orderItems, setOrderItems] = useState([]);

    // Status colors
    const statusColors = {
        pending: "orange",
        processing: "blue",
        completed: "green",
        cancelled: "red",
    };

    // Fetch orders
    const fetchOrders = async (params = {}) => {
        setLoading(true);
        try {
            const response = await mockApi.getOrders({
                page: pagination.current,
                limit: pagination.pageSize,
                search: searchText,
                ...filters,
                ...params,
            });

            setOrders(response.data.orders);
            setPagination((prev) => ({
                ...prev,
                total: response.data.pagination.total,
                current: response.data.pagination.page,
            }));
        } catch (error) {
            toast.error("Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    // Fetch customers and products
    const fetchInitialData = async () => {
        try {
            const [customersRes, productsRes] = await Promise.all([
                mockApi.getCustomers(),
                mockApi.getProducts(),
            ]);

            setCustomers(customersRes.data);
            setProducts(productsRes.data);
        } catch (error) {
            toast.error("Failed to fetch initial data");
        }
    };

    useEffect(() => {
        fetchOrders();
        fetchInitialData();
    }, []);

    // Handle search
    const handleSearch = (value) => {
        setSearchText(value);
        fetchOrders({ search: value, page: 1 });
    };

    // Handle filter
    const handleFilter = (newFilters) => {
        setFilters(newFilters);
        fetchOrders({ ...newFilters, page: 1 });
    };

    // Handle table change
    const handleTableChange = (paginationConfig, filters, sorter) => {
        const params = {
            page: paginationConfig.current,
            limit: paginationConfig.pageSize,
        };

        if (sorter.field) {
            params.sort_by = sorter.field;
            params.sort_order = sorter.order === "ascend" ? "asc" : "desc";
        }

        setPagination(paginationConfig);
        fetchOrders(params);
    };

    // Handle create order
    const handleCreateOrder = async (values) => {
        try {
            const orderData = {
                ...values,
                orderItems,
                total_products: orderItems.length,
                sub_total: orderItems.reduce(
                    (sum, item) => sum + item.total,
                    0
                ),
                gst:
                    orderItems.reduce((sum, item) => sum + item.total, 0) *
                    0.18,
                total:
                    orderItems.reduce((sum, item) => sum + item.total, 0) *
                    1.18,
            };

            await mockApi.createOrder(orderData);
            toast.success("Order created successfully");
            setCreateModalVisible(false);
            createForm.resetFields();
            setOrderItems([]);
            fetchOrders();
        } catch (error) {
            toast.error("Failed to create order");
        }
    };

    // Handle status update
    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await mockApi.updateOrderStatus(orderId, newStatus);
            toast.success("Order status updated successfully");
            fetchOrders();
        } catch (error) {
            toast.error("Failed to update order status");
        }
    };

    // Handle view details
    const handleViewDetails = async (order) => {
        setSelectedOrder(order);
        setDetailsModalVisible(true);
        setDetailsLoading(true);

        try {
            const response = await mockApi.getOrderDetails(order._id);
            setOrderDetails(response.data);
        } catch (error) {
            toast.error("Failed to fetch order details");
        } finally {
            setDetailsLoading(false);
        }
    };

    // Handle generate invoice
    const handleGenerateInvoice = async (orderId) => {
        try {
            toast.loading("Generating invoice...", { id: "invoice" });
            await mockApi.generateInvoice(orderId);
            toast.success("Invoice downloaded successfully", { id: "invoice" });
        } catch (error) {
            toast.error("Failed to generate invoice", { id: "invoice" });
        }
    };

    // Add order item
    const addOrderItem = () => {
        const newItem = {
            id: Date.now(),
            product_id: "",
            quantity: 1,
            unitcost: 0,
            total: 0,
        };
        setOrderItems([...orderItems, newItem]);
    };

    // Update order item
    const updateOrderItem = (id, field, value) => {
        const updatedItems = orderItems.map((item) => {
            if (item.id === id) {
                const updatedItem = { ...item, [field]: value };

                if (field === "product_id") {
                    const product = products.find((p) => p._id === value);
                    updatedItem.unitcost = product ? product.selling_price : 0;
                }

                updatedItem.total = updatedItem.quantity * updatedItem.unitcost;
                return updatedItem;
            }
            return item;
        });
        setOrderItems(updatedItems);
    };

    // Remove order item
    const removeOrderItem = (id) => {
        setOrderItems(orderItems.filter((item) => item.id !== id));
    };

    // Calculate totals
    const calculateTotals = () => {
        const subTotal = orderItems.reduce((sum, item) => sum + item.total, 0);
        const gst = subTotal * 0.18;
        const total = subTotal + gst;
        return { subTotal, gst, total };
    };

    const { subTotal, gst, total } = calculateTotals();

    // Table columns
    const columns = [
        {
            title: "Invoice No",
            dataIndex: "invoice_no",
            key: "invoice_no",
            render: (text) => <Text strong>{text}</Text>,
        },
        {
            title: "Customer",
            dataIndex: ["customer_id", "name"],
            key: "customer",
        },
        {
            title: "Date",
            dataIndex: "order_date",
            key: "order_date",
            render: (date) => dayjs(date).format("MMM DD, YYYY"),
            sorter: true,
        },
        {
            title: "Status",
            dataIndex: "order_status",
            key: "order_status",
            render: (status) => (
                <Tag color={statusColors[status]} className="capitalize">
                    {status}
                </Tag>
            ),
        },
        {
            title: "Items",
            dataIndex: "total_products",
            key: "total_products",
            render: (count) => (
                <Badge count={count} style={{ backgroundColor: "#52c41a" }} />
            ),
        },
        {
            title: "Total",
            dataIndex: "total",
            key: "total",
            render: (amount) => <Text strong>${amount.toFixed(2)}</Text>,
            sorter: true,
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Tooltip title="View Details">
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            onClick={() => handleViewDetails(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Update Status">
                        <Select
                            value={record.order_status}
                            size="small"
                            style={{ width: 100 }}
                            onChange={(value) =>
                                handleStatusUpdate(record._id, value)
                            }
                        >
                            <Option value="pending">Pending</Option>
                            <Option value="processing">Processing</Option>
                            <Option value="completed">Completed</Option>
                            <Option value="cancelled">Cancelled</Option>
                        </Select>
                    </Tooltip>
                    <Tooltip title="Generate Invoice">
                        <Button
                            type="text"
                            icon={<FileTextOutlined />}
                            onClick={() => handleGenerateInvoice(record._id)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <Title level={2} className="mb-2">
                    <ShoppingCartOutlined className="mr-3" />
                    Orders Management
                </Title>
                <Text type="secondary">
                    Manage customer orders, track status, and generate invoices
                </Text>
            </div>

            {/* Statistics Cards */}
            <Row gutter={16} className="mb-6">
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Total Orders"
                            value={pagination.total}
                            prefix={<ShoppingCartOutlined />}
                            valueStyle={{ color: "#1890ff" }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Pending Orders"
                            value={
                                orders.filter(
                                    (o) => o.order_status === "pending"
                                ).length
                            }
                            prefix={<CalendarOutlined />}
                            valueStyle={{ color: "#faad14" }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Completed Orders"
                            value={
                                orders.filter(
                                    (o) => o.order_status === "completed"
                                ).length
                            }
                            prefix={<UserOutlined />}
                            valueStyle={{ color: "#52c41a" }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Total Revenue"
                            value={orders.reduce((sum, o) => sum + o.total, 0)}
                            prefix={<DollarOutlined />}
                            precision={2}
                            valueStyle={{ color: "#722ed1" }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Controls */}
            <Card className="mb-6">
                <Row gutter={16} align="middle">
                    <Col xs={24} sm={12} md={8}>
                        <Input.Search
                            placeholder="Search by invoice number..."
                            onSearch={handleSearch}
                            prefix={<SearchOutlined />}
                            allowClear
                        />
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Space>
                            <Select
                                placeholder="Filter by status"
                                style={{ width: 120 }}
                                allowClear
                                onChange={(value) =>
                                    handleFilter({ order_status: value })
                                }
                            >
                                <Option value="pending">Pending</Option>
                                <Option value="processing">Processing</Option>
                                <Option value="completed">Completed</Option>
                                <Option value="cancelled">Cancelled</Option>
                            </Select>
                            <Button
                                icon={<ReloadOutlined />}
                                onClick={() => fetchOrders()}
                                loading={loading}
                            >
                                Refresh
                            </Button>
                        </Space>
                    </Col>
                    <Col xs={24} sm={24} md={8} className="text-right">
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => setCreateModalVisible(true)}
                            className="bg-blue-500 hover:bg-blue-600"
                        >
                            Create Order
                        </Button>
                    </Col>
                </Row>
            </Card>

            {/* Orders Table */}
            <Card>
                <Table
                    columns={columns}
                    dataSource={orders}
                    loading={loading}
                    pagination={{
                        ...pagination,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} orders`,
                    }}
                    onChange={handleTableChange}
                    rowKey="_id"
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
                    setOrderItems([]);
                }}
                footer={null}
                width={800}
                destroyOnClose
            >
                <Form
                    form={createForm}
                    layout="vertical"
                    onFinish={handleCreateOrder}
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
                                <Select placeholder="Select customer">
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
                                <Input placeholder="INV-001" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider>Order Items</Divider>

                    {orderItems.map((item, index) => (
                        <Card key={item.id} size="small" className="mb-4">
                            <Row gutter={16} align="middle">
                                <Col span={8}>
                                    <Select
                                        placeholder="Select product"
                                        value={item.product_id}
                                        onChange={(value) =>
                                            updateOrderItem(
                                                item.id,
                                                "product_id",
                                                value
                                            )
                                        }
                                        style={{ width: "100%" }}
                                    >
                                        {products.map((product) => (
                                            <Option
                                                key={product._id}
                                                value={product._id}
                                            >
                                                {product.product_name} ($
                                                {product.selling_price})
                                            </Option>
                                        ))}
                                    </Select>
                                </Col>
                                <Col span={4}>
                                    <InputNumber
                                        placeholder="Qty"
                                        min={1}
                                        value={item.quantity}
                                        onChange={(value) =>
                                            updateOrderItem(
                                                item.id,
                                                "quantity",
                                                value
                                            )
                                        }
                                        style={{ width: "100%" }}
                                    />
                                </Col>
                                <Col span={5}>
                                    <InputNumber
                                        placeholder="Unit Cost"
                                        min={0}
                                        value={item.unitcost}
                                        onChange={(value) =>
                                            updateOrderItem(
                                                item.id,
                                                "unitcost",
                                                value
                                            )
                                        }
                                        style={{ width: "100%" }}
                                        prefix="$"
                                    />
                                </Col>
                                <Col span={5}>
                                    <Text strong>${item.total.toFixed(2)}</Text>
                                </Col>
                                <Col span={2}>
                                    <Button
                                        type="text"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => removeOrderItem(item.id)}
                                    />
                                </Col>
                            </Row>
                        </Card>
                    ))}

                    <Button
                        type="dashed"
                        onClick={addOrderItem}
                        icon={<PlusOutlined />}
                        className="w-full mb-4"
                    >
                        Add Item
                    </Button>

                    {orderItems.length > 0 && (
                        <Card size="small" className="mb-4">
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Text>
                                        Subtotal:{" "}
                                        <Text strong>
                                            ${subTotal.toFixed(2)}
                                        </Text>
                                    </Text>
                                </Col>
                                <Col span={12}>
                                    <Text>
                                        GST (18%):{" "}
                                        <Text strong>${gst.toFixed(2)}</Text>
                                    </Text>
                                </Col>
                                <Col span={24} className="mt-2">
                                    <Text>
                                        Total:{" "}
                                        <Text strong className="text-lg">
                                            ${total.toFixed(2)}
                                        </Text>
                                    </Text>
                                </Col>
                            </Row>
                        </Card>
                    )}

                    <Form.Item>
                        <Space>
                            <Button
                                type="primary"
                                htmlType="submit"
                                disabled={orderItems.length === 0}
                                className="bg-blue-500 hover:bg-blue-600"
                            >
                                Create Order
                            </Button>
                            <Button
                                onClick={() => setCreateModalVisible(false)}
                            >
                                Cancel
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Order Details Modal */}
            <Modal
                title={`Order Details - ${selectedOrder?.invoice_no}`}
                open={detailsModalVisible}
                onCancel={() => setDetailsModalVisible(false)}
                footer={[
                    <Button
                        key="close"
                        onClick={() => setDetailsModalVisible(false)}
                    >
                        Close
                    </Button>,
                    <Button
                        key="invoice"
                        type="primary"
                        icon={<FileTextOutlined />}
                        onClick={() =>
                            handleGenerateInvoice(selectedOrder?._id)
                        }
                        className="bg-blue-500 hover:bg-blue-600"
                    >
                        Generate Invoice
                    </Button>,
                ]}
                width={700}
            >
                {selectedOrder && (
                    <>
                        <Descriptions bordered column={2} className="mb-4">
                            <Descriptions.Item label="Customer">
                                {selectedOrder.customer_id.name}
                            </Descriptions.Item>
                            <Descriptions.Item label="Order Date">
                                {dayjs(selectedOrder.order_date).format(
                                    "MMM DD, YYYY"
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Status">
                                <Tag
                                    color={
                                        statusColors[selectedOrder.order_status]
                                    }
                                >
                                    {selectedOrder.order_status}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Total Items">
                                {selectedOrder.total_products}
                            </Descriptions.Item>
                            <Descriptions.Item label="Subtotal">
                                ${selectedOrder.sub_total.toFixed(2)}
                            </Descriptions.Item>
                            <Descriptions.Item label="GST">
                                $
                                {(
                                    selectedOrder.total -
                                    selectedOrder.sub_total
                                ).toFixed(2)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Total Amount" span={2}>
                                <Text strong className="text-lg">
                                    ${selectedOrder.total.toFixed(2)}
                                </Text>
                            </Descriptions.Item>
                        </Descriptions>

                        <Divider>Order Items</Divider>

                        {detailsLoading ? (
                            <div className="text-center py-8">
                                <Spin size="large" />
                            </div>
                        ) : orderDetails.length > 0 ? (
                            <Table
                                dataSource={orderDetails}
                                pagination={false}
                                size="small"
                                columns={[
                                    {
                                        title: "Product",
                                        dataIndex: [
                                            "product_id",
                                            "product_name",
                                        ],
                                        key: "product",
                                    },
                                    {
                                        title: "Code",
                                        dataIndex: [
                                            "product_id",
                                            "product_code",
                                        ],
                                        key: "code",
                                    },
                                    {
                                        title: "Quantity",
                                        dataIndex: "quantity",
                                        key: "quantity",
                                    },
                                    {
                                        title: "Unit Cost",
                                        dataIndex: "unitcost",
                                        key: "unitcost",
                                        render: (price) =>
                                            `$${price.toFixed(2)}`,
                                    },
                                    {
                                        title: "Total",
                                        dataIndex: "total",
                                        key: "total",
                                        render: (total) => (
                                            <Text strong>
                                                ${total.toFixed(2)}
                                            </Text>
                                        ),
                                    },
                                ]}
                                rowKey="_id"
                            />
                        ) : (
                            <Empty description="No items found" />
                        )}
                    </>
                )}
            </Modal>
        </div>
    );
};

export default Orders;
