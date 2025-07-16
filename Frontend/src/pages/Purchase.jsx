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
    Card,
    Tag,
    Divider,
    Row,
    Col,
    InputNumber,
    Tooltip,
    Popconfirm,
    Typography,
    Statistic,
    Badge,
    Alert,
    Descriptions,
    message,
} from "antd";
import {
    PlusOutlined,
    EditOutlined,
    EyeOutlined,
    DeleteOutlined,
    SearchOutlined,
    ShoppingCartOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    UndoOutlined,
    MinusCircleOutlined,
    ExclamationCircleOutlined,
    InfoCircleOutlined,
    WarningOutlined,
} from "@ant-design/icons";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { api } from "../api/api";

const { Title, Text } = Typography;
const { Option } = Select;

const Purchase = () => {
    const [purchases, setPurchases] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [returnPreviewModalVisible, setReturnPreviewModalVisible] =
        useState(false);
    const [selectedPurchase, setSelectedPurchase] = useState(null);
    const [purchaseDetails, setPurchaseDetails] = useState([]);
    const [returnPreviewData, setReturnPreviewData] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [form] = Form.useForm();

    // Stats
    const [stats, setStats] = useState({
        pending: 0,
        completed: 0,
        returned: 0,
        total: 0,
    });

    // Fetch all purchases
    const fetchPurchases = async () => {
        setLoading(true);
        try {
            const response = await api.get("/purchases");
            if (response.data.success) {
                setPurchases(response.data.data);
                calculateStats(response.data.data);
            } else {
                toast.error("Failed to fetch purchases");
            }
        } catch (error) {
            toast.error("Error fetching purchases");
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate stats
    const calculateStats = (purchaseData) => {
        const pending = purchaseData.filter(
            (p) => p.purchase_status === "pending"
        ).length;
        const completed = purchaseData.filter(
            (p) => p.purchase_status === "completed"
        ).length;
        const returned = purchaseData.filter(
            (p) => p.purchase_status === "returned"
        ).length;

        setStats({
            pending,
            completed,
            returned,
            total: purchaseData.length,
        });
    };

    // Fetch suppliers
    const fetchSuppliers = async () => {
        try {
            const response = await api.get("/suppliers");
            if (response.data.success) {
                setSuppliers(response.data.data);
            }
        } catch (error) {
            toast.error("Error fetching suppliers");
            console.error("Error:", error);
        }
    };

    // Fetch products
    const fetchProducts = async () => {
        try {
            const response = await api.get("/products");
            if (response.data.success) {
                setProducts(response.data.data);
            }
        } catch (error) {
            toast.error("Error fetching products");
            console.error("Error:", error);
        }
    };

    // Fetch purchase details
    const fetchPurchaseDetails = async (purchaseId) => {
        try {
            const response = await api.get(`/purchases/${purchaseId}`);
            if (response.data.success) {
                setPurchaseDetails(response.data.data);
            }
        } catch (error) {
            toast.error("Error fetching purchase details");
            console.error("Error:", error);
        }
    };

    // Fetch return preview
    const fetchReturnPreview = async (purchaseId) => {
        try {
            const response = await api.get(
                `/purchases/${purchaseId}/return-preview`
            );
            if (response.data.success) {
                setReturnPreviewData(response.data.data);
                setReturnPreviewModalVisible(true);
            } else {
                toast.error(
                    response.data.message || "Failed to fetch return preview"
                );
            }
        } catch (error) {
            toast.error("Error fetching return preview");
            console.error("Error:", error);
        }
    };

    // Create purchase
    const createPurchase = async (values) => {
        try {
            const response = await api.post("/purchases", values);
            if (response.data.success) {
                toast.success("Purchase created successfully");
                fetchPurchases();
                setModalVisible(false);
                form.resetFields();
            } else {
                toast.error(
                    response.data.message || "Failed to create purchase"
                );
            }
        } catch (error) {
            toast.error("Error creating purchase");
            console.error("Error:", error);
        }
    };

    // Update purchase status
    const updatePurchaseStatus = async (purchaseId, status) => {
        try {
            const response = await api.patch(`/purchases/${purchaseId}`, {
                purchase_status: status,
            });
            if (response.data.success) {
                toast.success("Purchase status updated successfully");
                fetchPurchases();

                // Show return information if status is returned
                if (status === "returned" && response.data.data.returnInfo) {
                    const returnInfo = response.data.data.returnInfo;
                    message.success(
                        `Purchase returned successfully! Total refund: ₹${returnInfo.total_refund_amount.toFixed(2)}`
                    );
                }
            } else {
                toast.error(
                    response.data.message || "Failed to update purchase status"
                );
            }
        } catch (error) {
            toast.error("Error updating purchase status");
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        fetchPurchases();
        fetchSuppliers();
        fetchProducts();
    }, []);

    // Generate unique purchase number
    const generatePurchaseNo = () => {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        const random = Math.floor(Math.random() * 1000)
            .toString()
            .padStart(3, "0");
        return `P${year}${month}${day}${random}`;
    };

    // Handle form submission
    const handleSubmit = (values) => {
        const purchaseData = {
            supplier_id: values.supplier_id,
            purchase_no: values.purchase_no,
            purchase_status: values.purchase_status || "pending",
            details: values.details.map((detail) => ({
                product_id: detail.product_id,
                quantity: detail.quantity,
                unitcost: detail.unitcost,
            })),
        };
        createPurchase(purchaseData);
    };

    // Get status tag color
    const getStatusColor = (status) => {
        switch (status) {
            case "pending":
                return "orange";
            case "completed":
                return "green";
            case "approved":
                return "green";
            case "returned":
                return "red";
            default:
                return "default";
        }
    };

    // Get status icon
    const getStatusIcon = (status) => {
        switch (status) {
            case "pending":
                return <ClockCircleOutlined />;
            case "completed":
            case "approved":
                return <CheckCircleOutlined />;
            case "returned":
                return <UndoOutlined />;
            default:
                return null;
        }
    };

    // Table columns
    const columns = [
        {
            title: "Purchase No",
            dataIndex: "purchase_no",
            key: "purchase_no",
            filteredValue: [searchText],
            onFilter: (value, record) =>
                record.purchase_no
                    .toLowerCase()
                    .includes(value.toLowerCase()) ||
                record.supplier_id?.name
                    ?.toLowerCase()
                    .includes(value.toLowerCase()),
        },
        {
            title: "Supplier",
            dataIndex: ["supplier_id", "name"],
            key: "supplier",
            render: (_, record) => record.supplier_id?.name || "N/A",
        },
        {
            title: "Purchase Date",
            dataIndex: "purchase_date",
            key: "purchase_date",
            render: (date) => dayjs(date).format("DD/MM/YYYY"),
        },
        {
            title: "Status",
            dataIndex: "purchase_status",
            key: "status",
            render: (status) => (
                <Tag
                    color={getStatusColor(status)}
                    icon={getStatusIcon(status)}
                >
                    {status.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: "Created By",
            dataIndex: ["created_by", "username"],
            key: "created_by",
            render: (_, record) => record.created_by?.username || "N/A",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="View Details">
                        <Button
                            icon={<EyeOutlined />}
                            size="small"
                            onClick={() => {
                                setSelectedPurchase(record);
                                fetchPurchaseDetails(record._id);
                                setDetailModalVisible(true);
                            }}
                        />
                    </Tooltip>

                    {record.purchase_status === "pending" && (
                        <Tooltip title="Mark as Completed">
                            <Popconfirm
                                title="Mark this purchase as completed?"
                                description="This will update the stock for all products in this purchase."
                                onConfirm={() =>
                                    updatePurchaseStatus(
                                        record._id,
                                        "completed"
                                    )
                                }
                            >
                                <Button
                                    icon={<CheckCircleOutlined />}
                                    size="small"
                                    type="primary"
                                />
                            </Popconfirm>
                        </Tooltip>
                    )}

                    {(record.purchase_status === "completed" ||
                        record.purchase_status === "approved") && (
                        <>
                            <Tooltip title="Preview Return">
                                <Button
                                    icon={<InfoCircleOutlined />}
                                    size="small"
                                    onClick={() =>
                                        fetchReturnPreview(record._id)
                                    }
                                />
                            </Tooltip>
                            <Tooltip title="Process Return">
                                <Popconfirm
                                    title="Process return for this purchase?"
                                    description="This will reduce stock and calculate refund amounts."
                                    onConfirm={() =>
                                        updatePurchaseStatus(
                                            record._id,
                                            "returned"
                                        )
                                    }
                                >
                                    <Button
                                        icon={<UndoOutlined />}
                                        size="small"
                                        danger
                                    />
                                </Popconfirm>
                            </Tooltip>
                        </>
                    )}
                </Space>
            ),
        },
    ];

    // Detail modal columns
    const detailColumns = [
        {
            title: "Product",
            dataIndex: ["product_id", "product_name"],
            key: "product_name",
            render: (_, record) => record.product_id?.product_name || "N/A",
        },
        {
            title: "Product Code",
            dataIndex: ["product_id", "product_code"],
            key: "product_code",
            render: (_, record) => record.product_id?.product_code || "N/A",
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
            render: (cost) => `₹${cost.toFixed(2)}`,
        },
        {
            title: "Total",
            dataIndex: "total",
            key: "total",
            render: (total) => `₹${total.toFixed(2)}`,
        },
        {
            title: "Return Status",
            key: "return_status",
            render: (_, record) => {
                if (record.return_processed) {
                    return (
                        <div>
                            <Tag color="red">Returned</Tag>
                            <div className="text-xs text-gray-500">
                                Qty: {record.returned_quantity || 0} | Refund: ₹
                                {(record.refund_amount || 0).toFixed(2)}
                            </div>
                        </div>
                    );
                }
                return <Tag color="default">Not Returned</Tag>;
            },
        },
    ];

    // Return preview columns
    const returnPreviewColumns = [
        {
            title: "Product",
            dataIndex: "product_name",
            key: "product_name",
        },
        {
            title: "Purchased Qty",
            dataIndex: "purchased_quantity",
            key: "purchased_quantity",
        },
        {
            title: "Current Stock",
            dataIndex: "current_stock",
            key: "current_stock",
        },
        {
            title: "Returnable Qty",
            dataIndex: "returnable_quantity",
            key: "returnable_quantity",
            render: (qty, record) => (
                <span
                    className={
                        record.can_fully_return
                            ? "text-green-600"
                            : "text-red-600"
                    }
                >
                    {qty}
                </span>
            ),
        },
        {
            title: "Unit Cost",
            dataIndex: "unit_cost",
            key: "unit_cost",
            render: (cost) => `₹${cost.toFixed(2)}`,
        },
        {
            title: "Potential Refund",
            dataIndex: "potential_refund",
            key: "potential_refund",
            render: (refund) => `₹${refund.toFixed(2)}`,
        },
        {
            title: "Status",
            key: "status",
            render: (_, record) => (
                <Tag color={record.can_fully_return ? "green" : "orange"}>
                    {record.can_fully_return ? "Full Return" : "Partial Return"}
                </Tag>
            ),
        },
    ];

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="mb-6">
                <Title level={2} className="flex items-center gap-2 mb-4">
                    <ShoppingCartOutlined />
                    Purchase Management
                </Title>

                {/* Stats Cards */}
                <Row gutter={16} className="mb-6">
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Total Purchases"
                                value={stats.total}
                                valueStyle={{ color: "#1890ff" }}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Pending"
                                value={stats.pending}
                                valueStyle={{ color: "#faad14" }}
                                prefix={<ClockCircleOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Completed"
                                value={stats.completed}
                                valueStyle={{ color: "#52c41a" }}
                                prefix={<CheckCircleOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Returned"
                                value={stats.returned}
                                valueStyle={{ color: "#ff4d4f" }}
                                prefix={<UndoOutlined />}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Controls */}
                <Row justify="space-between" align="middle" className="mb-4">
                    <Col>
                        <Input.Search
                            placeholder="Search purchases..."
                            allowClear
                            enterButton={<SearchOutlined />}
                            size="large"
                            onSearch={(value) => setSearchText(value)}
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{ width: 300 }}
                        />
                    </Col>
                    <Col>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            size="large"
                            onClick={() => {
                                form.resetFields();
                                form.setFieldsValue({
                                    purchase_no: generatePurchaseNo(),
                                    purchase_status: "pending",
                                    details: [{}],
                                });
                                setModalVisible(true);
                            }}
                        >
                            Add Purchase
                        </Button>
                    </Col>
                </Row>
            </div>

            {/* Purchases Table */}
            <Card>
                <Table
                    columns={columns}
                    dataSource={purchases}
                    loading={loading}
                    rowKey="_id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} items`,
                    }}
                    scroll={{ x: 800 }}
                />
            </Card>

            {/* Add/Edit Purchase Modal */}
            <Modal
                title="Add New Purchase"
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                width={800}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                        purchase_no: generatePurchaseNo(),
                        purchase_status: "pending",
                        details: [{}],
                    }}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Purchase Number"
                                name="purchase_no"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter purchase number",
                                    },
                                    {
                                        max: 10,
                                        message:
                                            "Purchase number must be at most 10 characters",
                                    },
                                ]}
                            >
                                <Input placeholder="Enter purchase number" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Supplier"
                                name="supplier_id"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please select supplier",
                                    },
                                ]}
                            >
                                <Select placeholder="Select supplier">
                                    {suppliers.map((supplier) => (
                                        <Option
                                            key={supplier._id}
                                            value={supplier._id}
                                        >
                                            {supplier.name} ({supplier.shopname}
                                            )
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item label="Purchase Status" name="purchase_status">
                        <Select placeholder="Select status">
                            <Option value="pending">Pending</Option>
                            <Option value="completed">Completed</Option>
                            <Option value="approved">Approved</Option>
                        </Select>
                    </Form.Item>

                    <Divider>Purchase Details</Divider>

                    <Form.List name="details">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Row key={key} gutter={16} align="middle">
                                        <Col span={7}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, "product_id"]}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            "Select product",
                                                    },
                                                ]}
                                            >
                                                <Select placeholder="Select product">
                                                    {products.map((product) => (
                                                        <Option
                                                            key={product._id}
                                                            value={product._id}
                                                        >
                                                            {
                                                                product.product_name
                                                            }{" "}
                                                            (
                                                            {
                                                                product.product_code
                                                            }
                                                            )
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col span={5}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, "quantity"]}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            "Enter quantity",
                                                    },
                                                ]}
                                            >
                                                <InputNumber
                                                    placeholder="Quantity"
                                                    min={1}
                                                    style={{ width: "100%" }}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={6}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, "unitcost"]}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            "Enter unit cost",
                                                    },
                                                ]}
                                            >
                                                <InputNumber
                                                    placeholder="Unit Cost"
                                                    min={0}
                                                    precision={2}
                                                    style={{ width: "100%" }}
                                                    prefix="₹"
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={6}>
                                            <Space>
                                                <Button
                                                    type="dashed"
                                                    onClick={() => remove(name)}
                                                    icon={
                                                        <MinusCircleOutlined />
                                                    }
                                                    danger
                                                />
                                            </Space>
                                        </Col>
                                    </Row>
                                ))}
                                <Form.Item>
                                    <Button
                                        type="dashed"
                                        onClick={() => add()}
                                        block
                                        icon={<PlusOutlined />}
                                    >
                                        Add Product
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>

                    <Form.Item className="mb-0 text-right">
                        <Space>
                            <Button onClick={() => setModalVisible(false)}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Create Purchase
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Purchase Details Modal */}
            <Modal
                title={`Purchase Details - ${selectedPurchase?.purchase_no}`}
                open={detailModalVisible}
                onCancel={() => setDetailModalVisible(false)}
                footer={null}
                width={900}
            >
                {selectedPurchase && (
                    <div className="mb-4">
                        <Descriptions column={2} bordered>
                            <Descriptions.Item label="Purchase Number">
                                {selectedPurchase.purchase_no}
                            </Descriptions.Item>
                            <Descriptions.Item label="Supplier">
                                {selectedPurchase.supplier_id?.name}
                            </Descriptions.Item>
                            <Descriptions.Item label="Purchase Date">
                                {dayjs(selectedPurchase.purchase_date).format(
                                    "DD/MM/YYYY"
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Status">
                                <Tag
                                    color={getStatusColor(
                                        selectedPurchase.purchase_status
                                    )}
                                    icon={getStatusIcon(
                                        selectedPurchase.purchase_status
                                    )}
                                >
                                    {selectedPurchase.purchase_status.toUpperCase()}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Created By">
                                {selectedPurchase.created_by?.username}
                            </Descriptions.Item>
                            <Descriptions.Item label="Created At">
                                {dayjs(selectedPurchase.createdAt).format(
                                    "DD/MM/YYYY HH:mm"
                                )}
                            </Descriptions.Item>
                        </Descriptions>
                    </div>
                )}

                <Divider>Purchase Items</Divider>

                <Table
                    columns={detailColumns}
                    dataSource={purchaseDetails}
                    rowKey="_id"
                    pagination={false}
                    scroll={{ x: 800 }}
                    summary={(pageData) => {
                        const total = pageData.reduce(
                            (sum, record) => sum + (record.total || 0),
                            0
                        );
                        const totalRefund = pageData.reduce(
                            (sum, record) => sum + (record.refund_amount || 0),
                            0
                        );
                        return (
                            <Table.Summary fixed>
                                <Table.Summary.Row>
                                    <Table.Summary.Cell index={0} colSpan={4}>
                                        <Text strong>Total Amount:</Text>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={4}>
                                        <Text strong>₹{total.toFixed(2)}</Text>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={5}>
                                        {totalRefund > 0 && (
                                            <Text strong type="danger">
                                                Total Refund: ₹
                                                {totalRefund.toFixed(2)}
                                            </Text>
                                        )}
                                    </Table.Summary.Cell>
                                </Table.Summary.Row>
                            </Table.Summary>
                        );
                    }}
                />
            </Modal>

            {/* Return Preview Modal */}
            <Modal
                title={`Return Preview - ${returnPreviewData?.purchase_no}`}
                open={returnPreviewModalVisible}
                onCancel={() => setReturnPreviewModalVisible(false)}
                footer={[
                    <Button
                        key="cancel"
                        onClick={() => setReturnPreviewModalVisible(false)}
                    >
                        Cancel
                    </Button>,
                    <Button
                        key="proceed"
                        type="primary"
                        danger
                        onClick={() => {
                            setReturnPreviewModalVisible(false);
                            const purchase = purchases.find(
                                (p) => p._id === returnPreviewData?.purchase_id
                            );
                            if (purchase) {
                                updatePurchaseStatus(purchase._id, "returned");
                            }
                        }}
                    >
                        Proceed with Return
                    </Button>,
                ]}
                width={1000}
            >
                {returnPreviewData && (
                    <>
                        <Alert
                            message="Return Preview"
                            description={`Total potential refund: ₹${returnPreviewData.total_potential_refund.toFixed(2)}`}
                            type="info"
                            showIcon
                            className="mb-4"
                        />

                        <Alert
                            message="Important Notice"
                            description="Items with insufficient stock will be partially returned. Only the available stock quantity will be processed for return."
                            type="warning"
                            showIcon
                            className="mb-4"
                        />

                        <Table
                            columns={returnPreviewColumns}
                            dataSource={returnPreviewData.return_preview}
                            rowKey="product_id"
                            pagination={false}
                            scroll={{ x: 800 }}
                            summary={(pageData) => {
                                const totalRefund = pageData.reduce(
                                    (sum, record) =>
                                        sum + (record.potential_refund || 0),
                                    0
                                );
                                const fullReturns = pageData.filter(
                                    (item) => item.can_fully_return
                                ).length;
                                const partialReturns = pageData.filter(
                                    (item) => !item.can_fully_return
                                ).length;

                                return (
                                    <Table.Summary fixed>
                                        <Table.Summary.Row>
                                            <Table.Summary.Cell
                                                index={0}
                                                colSpan={5}
                                            >
                                                <div className="text-right">
                                                    <Text strong>
                                                        Total Potential
                                                        Refund:{" "}
                                                    </Text>
                                                    <Text strong type="danger">
                                                        ₹
                                                        {totalRefund.toFixed(2)}
                                                    </Text>
                                                    <br />
                                                    <Text type="success">
                                                        Full Returns:{" "}
                                                        {fullReturns}
                                                    </Text>
                                                    {partialReturns > 0 && (
                                                        <>
                                                            <Text> | </Text>
                                                            <Text type="warning">
                                                                Partial Returns:{" "}
                                                                {partialReturns}
                                                            </Text>
                                                        </>
                                                    )}
                                                </div>
                                            </Table.Summary.Cell>
                                        </Table.Summary.Row>
                                    </Table.Summary>
                                );
                            }}
                        />
                    </>
                )}
            </Modal>
        </div>
    );
};

export default Purchase;
