import React, { useState, useEffect, useCallback } from "react";
import {
    Table,
    Button,
    Space,
    Modal,
    Form,
    Input,
    Upload,
    Card,
    Avatar,
    Popconfirm,
    Tag,
    Row,
    Col,
    Divider,
    Typography,
    Statistic,
} from "antd";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    UserOutlined,
    UploadOutlined,
    SearchOutlined,
    ShopOutlined,
    PhoneOutlined,
    MailOutlined,
    EnvironmentOutlined,
    BankOutlined,
    EyeOutlined,
} from "@ant-design/icons";
import { toast } from "react-hot-toast";
import { api } from "../api/api.js";

const { Title, Text } = Typography;
const { TextArea } = Input;

const Suppliers = () => {
    // State management - similar to Customers.jsx structure
    const [state, setState] = useState({
        suppliers: [],
        loading: false,
        modalVisible: false,
        viewModalVisible: false,
        searchText: "",
        stats: { total: 0, wholesale: 0, manufacturer: 0, distributor: 0 },
    });

    const [editing, setEditing] = useState({
        supplier: null,
        fileList: [],
    });

    const [viewing, setViewing] = useState({
        supplier: null,
    });

    const [form] = Form.useForm();

    // Initialize component
    useEffect(() => {
        fetchSuppliers();
    }, []);

    // Utility functions
    const updateState = (updates) => {
        setState((prev) => ({ ...prev, ...updates }));
    };

    const calculateStats = useCallback((data) => {
        const total = data.length;
        const wholesale = data.filter((s) => s.type?.toLowerCase() === "wholesale").length;
        const manufacturer = data.filter((s) => s.type?.toLowerCase() === "manufacturer").length;
        const distributor = data.filter((s) => s.type?.toLowerCase() === "distributor").length;
        return { total, wholesale, manufacturer, distributor };
    }, []);

    const getFilteredSuppliers = useCallback(() => {
        const { suppliers, searchText } = state;
        if (!searchText) return suppliers;

        return suppliers.filter((supplier) => {
            const searchLower = searchText.toLowerCase();
            return (
                supplier.name.toLowerCase().includes(searchLower) ||
                supplier.email.toLowerCase().includes(searchLower) ||
                supplier.phone.includes(searchText) ||
                (supplier.shopname &&
                    supplier.shopname.toLowerCase().includes(searchLower))
            );
        });
    }, [state.suppliers, state.searchText]);

    // API functions
    const fetchSuppliers = async () => {
        updateState({ loading: true });
        try {
            const response = await api.get("/suppliers");
            if (response.data.success) {
                const suppliers = response.data.data;
                const stats = calculateStats(suppliers);
                updateState({ suppliers, stats });
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to fetch suppliers"
            );
        } finally {
            updateState({ loading: false });
        }
    };

    const handleSubmit = async (values) => {
        updateState({ loading: true });
        try {
            const formData = createFormData(values);
            const response = await submitSupplierData(formData);

            if (response.data.success) {
                toast.success(response.data.message);
                await fetchSuppliers();
                handleCancel();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation failed");
        } finally {
            updateState({ loading: false });
        }
    };

    const createFormData = (values) => {
        const formData = new FormData();

        Object.keys(values).forEach((key) => {
            if (
                values[key] !== undefined &&
                values[key] !== null &&
                values[key] !== ""
            ) {
                formData.append(key, values[key]);
            }
        });

        if (editing.fileList.length > 0 && editing.fileList[0].originFileObj) {
            formData.append("photo", editing.fileList[0].originFileObj);
        }

        return formData;
    };

    const submitSupplierData = (formData) => {
        const config = { headers: { "Content-Type": "multipart/form-data" } };

        return editing.supplier
            ? api.patch(`/suppliers/${editing.supplier._id}`, formData, config)
            : api.post("/suppliers", formData, config);
    };

    const handleDelete = async (id) => {
        try {
            const response = await api.delete(`/suppliers/${id}`);
            if (response.data.success) {
                toast.success("Supplier deleted successfully");
                await fetchSuppliers();
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to delete supplier"
            );
        }
    };

    // Modal handlers
    const handleEdit = (supplier) => {
        setEditing({ supplier, fileList: getExistingFileList(supplier) });
        form.setFieldsValue({ ...supplier });
        updateState({ modalVisible: true });
    };

    const getExistingFileList = (supplier) => {
        if (supplier.photo && supplier.photo !== "default-supplier.png") {
            return [
                {
                    uid: "-1",
                    name: "current-photo.jpg",
                    status: "done",
                    url: supplier.photo,
                },
            ];
        }
        return [];
    };

    const handleView = (supplier) => {
        setViewing({ supplier });
        updateState({ viewModalVisible: true });
    };

    const handleCancel = () => {
        updateState({ modalVisible: false });
        setEditing({ supplier: null, fileList: [] });
        form.resetFields();
    };

    const handleViewCancel = () => {
        updateState({ viewModalVisible: false });
        setViewing({ supplier: null });
    };

    const handleSearch = (e) => {
        updateState({ searchText: e.target.value });
    };

    const openAddModal = () => {
        updateState({ modalVisible: true });
    };

    const handleFileListChange = (newFileList) => {
        setEditing((prev) => ({ ...prev, fileList: newFileList }));
    };

    const uploadProps = {
        fileList: editing.fileList,
        beforeUpload: (file) => {
            const isImage = file.type.startsWith('image/');
            if (!isImage) {
                toast.error('You can only upload image files!');
                return false;
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                toast.error('Image must be smaller than 2MB!');
                return false;
            }
            return false; // Prevent auto upload
        },
        onChange: ({ fileList }) => {
            handleFileListChange(fileList.slice(-1)); // Keep only the last file
        },
        onRemove: () => {
            handleFileListChange([]);
        },
    };

    // Stats Component
    const SupplierStats = ({ stats }) => (
        <Card className="shadow-sm mb-6">
            <Row gutter={16}>
                <Col xs={12} sm={6}>
                    <Statistic
                        title="Total Suppliers"
                        value={stats.total}
                        valueStyle={{ color: "#1677ff" }}
                        prefix={<ShopOutlined />}
                    />
                </Col>
                <Col xs={12} sm={6}>
                    <Statistic
                        title="Wholesale"
                        value={stats.wholesale}
                        valueStyle={{ color: "#52c41a" }}
                    />
                </Col>
                <Col xs={12} sm={6}>
                    <Statistic
                        title="Manufacturer"
                        value={stats.manufacturer}
                        valueStyle={{ color: "#faad14" }}
                    />
                </Col>
                <Col xs={12} sm={6}>
                    <Statistic
                        title="Distributor"
                        value={stats.distributor}
                        valueStyle={{ color: "#f759ab" }}
                    />
                </Col>
            </Row>
        </Card>
    );

    // View Modal Component
    const SupplierViewModal = ({ visible, onCancel, supplier, onEdit }) => {
        if (!supplier) return null;

        return (
            <Modal
                title={
                    <Space>
                        <ShopOutlined />
                        Supplier Details
                    </Space>
                }
                open={visible}
                onCancel={onCancel}
                footer={[
                    <Button key="close" onClick={onCancel}>
                        Close
                    </Button>,
                    <Button
                        key="edit"
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => {
                            onCancel();
                            onEdit(supplier);
                        }}
                    >
                        Edit Supplier
                    </Button>,
                ]}
                width={600}
            >
                <div className="space-y-4">
                    <div className="flex items-center space-x-4 mb-6">
                        <Avatar
                            size={80}
                            src={supplier.photo && supplier.photo !== "default-supplier.png" ? supplier.photo : null}
                            icon={<UserOutlined />}
                        />
                        <div>
                            <Title level={4} className="!mb-1">
                                {supplier.name}
                            </Title>
                            {supplier.shopname && (
                                <Text type="secondary">{supplier.shopname}</Text>
                            )}
                            {supplier.type && (
                                <div className="mt-1">
                                    <Tag color="blue">{supplier.type}</Tag>
                                </div>
                            )}
                        </div>
                    </div>

                    <Divider />

                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <Text strong>Email:</Text>
                            <br />
                            <Text>{supplier.email}</Text>
                        </Col>
                        <Col span={12}>
                            <Text strong>Phone:</Text>
                            <br />
                            <Text>{supplier.phone}</Text>
                        </Col>
                        <Col span={24}>
                            <Text strong>Address:</Text>
                            <br />
                            <Text>{supplier.address || "Not provided"}</Text>
                        </Col>
                    </Row>

                    {(supplier.bank_name || supplier.account_holder || supplier.account_number) && (
                        <>
                            <Divider>Banking Information</Divider>
                            <Row gutter={[16, 16]}>
                                <Col span={12}>
                                    <Text strong>Bank Name:</Text>
                                    <br />
                                    <Text>{supplier.bank_name || "Not provided"}</Text>
                                </Col>
                                <Col span={12}>
                                    <Text strong>Account Holder:</Text>
                                    <br />
                                    <Text>{supplier.account_holder || "Not provided"}</Text>
                                </Col>
                                <Col span={24}>
                                    <Text strong>Account Number:</Text>
                                    <br />
                                    <Text>{supplier.account_number || "Not provided"}</Text>
                                </Col>
                            </Row>
                        </>
                    )}

                    <Divider />
                    <Text type="secondary">
                        Created: {new Date(supplier.createdAt).toLocaleDateString()}
                    </Text>
                </div>
            </Modal>
        );
    };

    // Table columns
    const columns = [
        {
            title: "Photo",
            dataIndex: "photo",
            key: "photo",
            width: 80,
            render: (photo) => (
                <Avatar 
                    size={50} 
                    src={photo && photo !== "default-supplier.png" ? photo : null}
                    icon={<UserOutlined />}
                />
            ),
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (name) => <Text strong>{name}</Text>,
        },
        {
            title: "Shop Name",
            dataIndex: "shopname",
            key: "shopname",
            render: (shopname) => shopname || <Text type="secondary">-</Text>,
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Phone",
            dataIndex: "phone",
            key: "phone",
            render: (phone) => (
                <Space>
                    <PhoneOutlined />
                    {phone}
                </Space>
            ),
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            render: (type) => 
                type ? <Tag color="blue">{type}</Tag> : <Text type="secondary">-</Text>,
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: "Actions",
            key: "actions",
            width: 200,
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="default"
                        icon={<EyeOutlined />}
                        onClick={() => handleView(record)}
                        size="small"
                    >
                        View
                    </Button>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                        size="small"
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Delete supplier"
                        description="Are you sure you want to delete this supplier?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button 
                            danger 
                            icon={<DeleteOutlined />}
                            size="small"
                        >
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    // Component render
    const filteredSuppliers = getFilteredSuppliers();

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-4">
                <div className="flex-1 min-w-0">
                    <h1 className="truncate mb-1 text-4xl font-bold flex items-center gap-2">
                        Suppliers
                        <ShopOutlined className="text-blue-600 inline-block ml-2" />
                    </h1>
                    <p className="text-gray-500 text-base md:text-sm hidden sm:block">
                        Manage your suppliers and their information
                    </p>
                </div>
            </div>
            
            <SupplierStats stats={state.stats} />

            {/* Search and Add Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
                <Input
                    placeholder="Search suppliers by name, email, phone, or shop name..."
                    prefix={<SearchOutlined className="text-gray-400" />}
                    value={state.searchText}
                    onChange={handleSearch}
                    className="max-w-lg"
                    size="large"
                    allowClear
                />
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={openAddModal}
                    size="large"
                    className="min-w-40"
                >
                    Add Supplier
                </Button>
            </div>

            {/* Results Summary */}
            {state.searchText && (
                <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                    Found {filteredSuppliers.length} supplier
                    {filteredSuppliers.length !== 1 ? "s" : ""}
                    {state.searchText && ` matching "${state.searchText}"`}
                </div>
            )}

            {/* Supplier Table */}
            <Card className="shadow-sm">
                <Table
                    columns={columns}
                    dataSource={filteredSuppliers}
                    loading={state.loading}
                    rowKey="_id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total) => `Total ${total} suppliers`,
                    }}
                    className="bg-white"
                />
            </Card>

            {/* View Modal */}
            <SupplierViewModal
                visible={state.viewModalVisible}
                onCancel={handleViewCancel}
                supplier={viewing.supplier}
                onEdit={handleEdit}
            />

            {/* Add/Edit Modal */}
            <Modal
                title={
                    <Space>
                        <UserOutlined />
                        {editing.supplier ? "Edit Supplier" : "Add New Supplier"}
                    </Space>
                }
                open={state.modalVisible}
                onCancel={handleCancel}
                footer={null}
                width={800}
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
                                label="Full Name"
                                name="name"
                                rules={[
                                    { required: true, message: "Please enter supplier name" },
                                    { max: 50, message: "Name must be less than 50 characters" }
                                ]}
                            >
                                <Input 
                                    prefix={<UserOutlined />}
                                    placeholder="Enter full name" 
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Shop Name"
                                name="shopname"
                                rules={[
                                    { max: 50, message: "Shop name must be less than 50 characters" }
                                ]}
                            >
                                <Input 
                                    prefix={<ShopOutlined />}
                                    placeholder="Enter shop name" 
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    { required: true, message: "Please enter email" },
                                    { type: "email", message: "Please enter a valid email" },
                                    { max: 50, message: "Email must be less than 50 characters" }
                                ]}
                            >
                                <Input 
                                    prefix={<MailOutlined />}
                                    placeholder="Enter email address" 
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Phone"
                                name="phone"
                                rules={[
                                    { required: true, message: "Please enter phone number" },
                                    { max: 15, message: "Phone must be less than 15 characters" }
                                ]}
                            >
                                <Input 
                                    prefix={<PhoneOutlined />}
                                    placeholder="Enter phone number" 
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label="Address"
                        name="address"
                        rules={[
                            { required: true, message: "Please enter address" },
                            { max: 100, message: "Address must be less than 100 characters" }
                        ]}
                    >
                        <TextArea 
                            placeholder="Enter complete address"
                            rows={3}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Supplier Type"
                        name="type"
                        rules={[
                            { max: 15, message: "Type must be less than 15 characters" }
                        ]}
                    >
                        <Input placeholder="e.g., Wholesale, Manufacturer, Distributor" />
                    </Form.Item>

                    <Divider orientation="left">
                        <Space>
                            <BankOutlined />
                            Banking Information (Optional)
                        </Space>
                    </Divider>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Bank Name"
                                name="bank_name"
                                rules={[
                                    { max: 50, message: "Bank name must be less than 50 characters" }
                                ]}
                            >
                                <Input placeholder="Enter bank name" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Account Holder"
                                name="account_holder"
                                rules={[
                                    { max: 50, message: "Account holder must be less than 50 characters" }
                                ]}
                            >
                                <Input placeholder="Enter account holder name" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label="Account Number"
                        name="account_number"
                        rules={[
                            { max: 50, message: "Account number must be less than 50 characters" }
                        ]}
                    >
                        <Input placeholder="Enter account number" />
                    </Form.Item>

                    <Form.Item label="Photo">
                        <Upload {...uploadProps} listType="picture">
                            <Button icon={<UploadOutlined />}>
                                Upload Photo
                            </Button>
                        </Upload>
                        <Text type="secondary" className="block mt-1">
                            Maximum file size: 2MB. Supported formats: JPG, PNG, GIF
                        </Text>
                    </Form.Item>

                    <Form.Item className="mb-0 mt-6">
                        <Space className="w-full justify-end">
                            <Button onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit" loading={state.loading}>
                                {editing.supplier ? "Update Supplier" : "Create Supplier"}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Suppliers;