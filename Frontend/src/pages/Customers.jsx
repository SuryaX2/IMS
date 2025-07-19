import React, { useState, useEffect } from "react";
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Select,
    Upload,
    Space,
    Popconfirm,
    Card,
    Avatar,
    Tag,
    Row,
    Col,
    Statistic,
    Empty,
    Descriptions,
    Typography,
} from "antd";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    UserOutlined,
    UploadOutlined,
    SearchOutlined,
    PhoneOutlined,
    MailOutlined,
    HomeOutlined,
    ShopOutlined,
    EyeOutlined,
} from "@ant-design/icons";
import { toast } from "react-hot-toast";
import { api } from "../api/api";

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [viewingCustomer, setViewingCustomer] = useState(null);
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState("");
    const [fileList, setFileList] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        regular: 0,
        wholesale: 0,
        retail: 0,
    });

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const response = await api.get("/customers");
            if (response.data.success) {
                setCustomers(response.data.data);
                calculateStats(response.data.data);
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to fetch customers"
            );
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (customersData) => {
        const total = customersData.length;
        const regular = customersData.filter(
            (c) => c.type === "regular"
        ).length;
        const wholesale = customersData.filter(
            (c) => c.type === "wholesale"
        ).length;
        const retail = customersData.filter((c) => c.type === "retail").length;

        setStats({ total, regular, wholesale, retail });
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const formData = new FormData();

            // Append all form fields
            Object.keys(values).forEach((key) => {
                if (values[key] !== undefined && values[key] !== null) {
                    formData.append(key, values[key]);
                }
            });

            // Append photo if exists
            if (fileList.length > 0 && fileList[0].originFileObj) {
                formData.append("photo", fileList[0].originFileObj);
            }

            let response;
            if (editingCustomer) {
                response = await api.patch(
                    `/customers/${editingCustomer._id}`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
            } else {
                response = await api.post("/customers", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
            }

            if (response.data.success) {
                toast.success(response.data.message);
                fetchCustomers();
                handleCancel();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation failed");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (customer) => {
        setEditingCustomer(customer);
        form.setFieldsValue({
            ...customer,
        });

        // Set photo if exists
        if (customer.photo && customer.photo !== "default-customer.png") {
            setFileList([
                {
                    uid: "-1",
                    name: "current-photo.jpg",
                    status: "done",
                    url: customer.photo,
                },
            ]);
        }

        setModalVisible(true);
    };

    const handleView = (customer) => {
        setViewingCustomer(customer);
        setViewModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            const response = await api.delete(`/customers/${id}`);
            if (response.data.success) {
                toast.success("Customer deleted successfully");
                fetchCustomers();
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to delete customer"
            );
        }
    };

    const handleCancel = () => {
        setModalVisible(false);
        setEditingCustomer(null);
        form.resetFields();
        setFileList([]);
    };

    const handleViewCancel = () => {
        setViewModalVisible(false);
        setViewingCustomer(null);
    };

    const uploadProps = {
        fileList,
        onChange: ({ fileList: newFileList }) => setFileList(newFileList),
        beforeUpload: () => false, // Prevent auto upload
        maxCount: 1,
        accept: "image/*",
        listType: "picture-card",
    };

    const filteredCustomers = customers.filter(
        (customer) =>
            customer.name.toLowerCase().includes(searchText.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchText.toLowerCase()) ||
            customer.phone.includes(searchText)
    );

    const columns = [
        {
            title: "Photo",
            dataIndex: "photo",
            key: "photo",
            width: 80,
            render: (photo) => (
                <Avatar
                    size={48}
                    src={photo !== "default-customer.png" ? photo : null}
                    icon={<UserOutlined />}
                />
            ),
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            width: 150,
            sorter: (a, b) => a.name.localeCompare(b.name),
            render: (name) => (
                <Text strong style={{ fontSize: "14px" }}>
                    {name}
                </Text>
            ),
        },
        {
            title: "Contact",
            key: "contact",
            width: 200,
            render: (_, record) => (
                <div className="space-y-1">
                    <div className="flex items-center text-xs text-gray-600">
                        <MailOutlined className="mr-1" />
                        <span
                            className="truncate max-w-[140px]"
                            title={record.email}
                        >
                            {record.email}
                        </span>
                    </div>
                    <div className="flex items-center text-xs text-gray-600">
                        <PhoneOutlined className="mr-1" />
                        <span>{record.phone}</span>
                    </div>
                </div>
            ),
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            width: 100,
            render: (type) => {
                const colors = {
                    regular: "blue",
                    wholesale: "green",
                    retail: "orange",
                };
                return (
                    <Tag color={colors[type] || "default"} className="text-xs">
                        {type?.toUpperCase()}
                    </Tag>
                );
            },
            filters: [
                { text: "Regular", value: "regular" },
                { text: "Wholesale", value: "wholesale" },
                { text: "Retail", value: "retail" },
            ],
            onFilter: (value, record) => record.type === value,
        },
        {
            title: "Location",
            key: "location",
            width: 180,
            render: (_, record) => (
                <div className="space-y-1">
                    {record.address && (
                        <div className="flex items-center text-xs text-gray-600">
                            <HomeOutlined className="mr-1 flex-shrink-0" />
                            <span
                                className="truncate max-w-[130px]"
                                title={record.address}
                            >
                                {record.address}
                            </span>
                        </div>
                    )}
                    {record.store_name && (
                        <div className="flex items-center text-xs text-gray-600">
                            <ShopOutlined className="mr-1 flex-shrink-0" />
                            <span
                                className="truncate max-w-[130px]"
                                title={record.store_name}
                            >
                                {record.store_name}
                            </span>
                        </div>
                    )}
                    {!record.address && !record.store_name && (
                        <span className="text-gray-400 text-xs">-</span>
                    )}
                </div>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            width: 150,
            fixed: "right",
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="default"
                        icon={<EyeOutlined />}
                        size="small"
                        onClick={() => handleView(record)}
                        title="View Details"
                    />
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => handleEdit(record)}
                        title="Edit Customer"
                    />
                    <Popconfirm
                        title="Are you sure you want to delete this customer?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                            title="Delete Customer"
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                    Customer Management
                </h1>

                {/* Statistics Cards */}
                <Row gutter={16} className="mb-6">
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Total Customers"
                                value={stats.total}
                                valueStyle={{ color: "#1890ff" }}
                                prefix={<UserOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Regular Customers"
                                value={stats.regular}
                                valueStyle={{ color: "#52c41a" }}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Wholesale Customers"
                                value={stats.wholesale}
                                valueStyle={{ color: "#faad14" }}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Retail Customers"
                                value={stats.retail}
                                valueStyle={{ color: "#f5222d" }}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Actions */}
                <div className="flex justify-between items-center">
                    <Input
                        placeholder="Search customers..."
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: 300 }}
                    />
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setModalVisible(true)}
                    >
                        Add Customer
                    </Button>
                </div>
            </div>

            {/* Customer Table */}
            <Card>
                <Table
                    columns={columns}
                    dataSource={filteredCustomers}
                    rowKey="_id"
                    loading={loading}
                    scroll={{ x: 800 }}
                    pagination={{
                        total: filteredCustomers.length,
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} customers`,
                    }}
                    locale={{
                        emptyText: (
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description="No customers found"
                            />
                        ),
                    }}
                />
            </Card>

            {/* View Customer Modal */}
            <Modal
                title={
                    <div className="flex items-center space-x-3">
                        <Avatar
                            size={70}
                            src={
                                viewingCustomer?.photo !==
                                "default-customer.png"
                                    ? viewingCustomer?.photo
                                    : null
                            }
                            icon={<UserOutlined />}
                        />
                        <div>
                            <Title level={4} className="m-0">
                                Customer Details
                            </Title>
                            <Text type="secondary" className="text-sm">
                                {viewingCustomer?.name}
                            </Text>
                        </div>
                    </div>
                }
                open={viewModalVisible}
                onCancel={handleViewCancel}
                footer={[
                    <Button
                        key="edit"
                        type="primary"
                        onClick={() => {
                            handleViewCancel();
                            handleEdit(viewingCustomer);
                        }}
                    >
                        <EditOutlined /> Edit Customer
                    </Button>,
                    <Button key="close" onClick={handleViewCancel}>
                        Close
                    </Button>,
                ]}
                width={700}
            >
                {viewingCustomer && (
                    <Descriptions
                        bordered
                        column={2}
                        size="middle"
                        className="mt-4"
                    >
                        <Descriptions.Item label="Name" span={2}>
                            <Text strong>{viewingCustomer.name}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Email">
                            <Space>
                                <MailOutlined className="text-blue-500" />
                                {viewingCustomer.email}
                            </Space>
                        </Descriptions.Item>
                        <Descriptions.Item label="Phone">
                            <Space>
                                <PhoneOutlined className="text-green-500" />
                                {viewingCustomer.phone}
                            </Space>
                        </Descriptions.Item>
                        <Descriptions.Item label="Customer Type">
                            <Tag
                                color={
                                    viewingCustomer.type === "regular"
                                        ? "blue"
                                        : viewingCustomer.type === "wholesale"
                                          ? "green"
                                          : viewingCustomer.type === "retail"
                                            ? "orange"
                                            : "default"
                                }
                            >
                                {viewingCustomer.type?.toUpperCase()}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Address" span={2}>
                            {viewingCustomer.address ? (
                                <Space>
                                    <HomeOutlined className="text-purple-500" />
                                    {viewingCustomer.address}
                                </Space>
                            ) : (
                                <Text type="secondary">Not provided</Text>
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="Store Name">
                            {viewingCustomer.store_name ? (
                                <Space>
                                    <ShopOutlined className="text-orange-500" />
                                    {viewingCustomer.store_name}
                                </Space>
                            ) : (
                                <Text type="secondary">Not provided</Text>
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="Account Holder">
                            {viewingCustomer.account_holder || (
                                <Text type="secondary">Not provided</Text>
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="Account Number" span={2}>
                            {viewingCustomer.account_number || (
                                <Text type="secondary">Not provided</Text>
                            )}
                        </Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>

            {/* Add/Edit Modal */}
            <Modal
                title={editingCustomer ? "Edit Customer" : "Add New Customer"}
                open={modalVisible}
                onCancel={handleCancel}
                footer={null}
                width={800}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    className="mt-4"
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Customer Name"
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter customer name",
                                    },
                                    {
                                        max: 50,
                                        message:
                                            "Name cannot exceed 50 characters",
                                    },
                                ]}
                            >
                                <Input placeholder="Enter customer name" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter email",
                                    },
                                    {
                                        type: "email",
                                        message: "Please enter valid email",
                                    },
                                    {
                                        max: 50,
                                        message:
                                            "Email cannot exceed 50 characters",
                                    },
                                ]}
                            >
                                <Input placeholder="Enter email address" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Phone"
                                name="phone"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter phone number",
                                    },
                                    {
                                        max: 15,
                                        message:
                                            "Phone cannot exceed 15 characters",
                                    },
                                ]}
                            >
                                <Input placeholder="Enter phone number" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Customer Type"
                                name="type"
                                initialValue="regular"
                            >
                                <Select placeholder="Select customer type">
                                    <Option value="regular">Regular</Option>
                                    <Option value="wholesale">Wholesale</Option>
                                    <Option value="retail">Retail</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label="Address"
                        name="address"
                        rules={[
                            {
                                max: 100,
                                message: "Address cannot exceed 100 characters",
                            },
                        ]}
                    >
                        <TextArea
                            placeholder="Enter customer address"
                            rows={3}
                        />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Store Name"
                                name="store_name"
                                rules={[
                                    {
                                        max: 50,
                                        message:
                                            "Store name cannot exceed 50 characters",
                                    },
                                ]}
                            >
                                <Input placeholder="Enter store name (optional)" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Account Holder"
                                name="account_holder"
                                rules={[
                                    {
                                        max: 50,
                                        message:
                                            "Account holder cannot exceed 50 characters",
                                    },
                                ]}
                            >
                                <Input placeholder="Enter account holder name (optional)" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label="Account Number"
                        name="account_number"
                        rules={[
                            {
                                max: 50,
                                message:
                                    "Account number cannot exceed 50 characters",
                            },
                        ]}
                    >
                        <Input placeholder="Enter account number (optional)" />
                    </Form.Item>

                    <Form.Item label="Customer Photo">
                        <Upload {...uploadProps}>
                            {fileList.length === 0 && (
                                <div>
                                    <UploadOutlined />
                                    <div style={{ marginTop: 8 }}>
                                        Upload Photo
                                    </div>
                                </div>
                            )}
                        </Upload>
                    </Form.Item>

                    <Form.Item className="mb-0 text-right">
                        <Space>
                            <Button onClick={handleCancel}>Cancel</Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                            >
                                {editingCustomer
                                    ? "Update Customer"
                                    : "Add Customer"}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Customers;
