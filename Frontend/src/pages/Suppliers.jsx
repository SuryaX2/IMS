import React, { useState, useEffect, useCallback } from "react";
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Upload,
    Space,
    Popconfirm,
    Card,
    Tag,
    Avatar,
    Row,
    Col,
    Select,
    Typography,
    Drawer,
    Descriptions,
    Statistic,
    Badge,
    Empty,
    Spin,
} from "antd";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    UserOutlined,
    UploadOutlined,
    ShopOutlined,
    PhoneOutlined,
    MailOutlined,
    HomeOutlined,
    BankOutlined,
    SearchOutlined,
    EyeOutlined,
    ClearOutlined,
    ReloadOutlined,
} from "@ant-design/icons";
import { toast } from "react-hot-toast";
import { api } from "../api/api";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// PageHeader Component
const PageHeader = ({ title, subtitle, icon, actionText, actionIcon, onActionClick }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
            {icon}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 m-0">{title}</h1>
                <p className="text-gray-600 mt-1 mb-0">{subtitle}</p>
            </div>
        </div>
        {actionText && (
            <Button
                type="primary"
                size="large"
                icon={actionIcon}
                onClick={onActionClick}
                className="shrink-0"
            >
                {actionText}
            </Button>
        )}
    </div>
);

// Stats Component
const SupplierStats = ({ suppliers, loading }) => {
    const totalSuppliers = suppliers.length;
    const activeSuppliers = suppliers.filter(s => s.status !== 'inactive').length;
    const suppliersWithShop = suppliers.filter(s => s.shopname).length;
    const suppliersWithBank = suppliers.filter(s => s.bank_name).length;

    const stats = [
        {
            title: "Total Suppliers",
            value: totalSuppliers,
            icon: <UserOutlined className="text-blue-600" />,
            color: "blue",
        },
        {
            title: "Active Suppliers",
            value: activeSuppliers,
            icon: <ShopOutlined className="text-green-600" />,
            color: "green",
        },
        {
            title: "With Shop Name",
            value: suppliersWithShop,
            icon: <ShopOutlined className="text-purple-600" />,
            color: "purple",
        },
        {
            title: "With Bank Details",
            value: suppliersWithBank,
            icon: <BankOutlined className="text-orange-600" />,
            color: "orange",
        },
    ];

    return (
        <Row gutter={[16, 16]}>
            {stats.map((stat, index) => (
                <Col xs={12} sm={6} key={index}>
                    <Card size="small" loading={loading}>
                        <div className="flex items-center justify-between">
                            <div>
                                <Text type="secondary" className="text-xs">
                                    {stat.title}
                                </Text>
                                <div className={`text-2xl font-bold text-${stat.color}-600`}>
                                    {stat.value}
                                </div>
                            </div>
                            <div className="text-2xl opacity-60">
                                {stat.icon}
                            </div>
                        </div>
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

// Filters Component
const SupplierFilters = ({ filters, onFilterChange, onApplyFilters, onResetFilters }) => (
    <Card size="small" className="mb-6">
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[200px]">
                    <Text type="secondary" className="block mb-1">Search</Text>
                    <Input
                        placeholder="Search by name, email, phone, shop..."
                        prefix={<SearchOutlined />}
                        value={filters.search}
                        onChange={(e) => onFilterChange('search', e.target.value)}
                        allowClear
                    />
                </div>
                <div className="min-w-[150px]">
                    <Text type="secondary" className="block mb-1">Type</Text>
                    <Select
                        placeholder="Select type"
                        value={filters.type}
                        onChange={(value) => onFilterChange('type', value)}
                        allowClear
                        style={{ width: '100%' }}
                    >
                        <Option value="Manufacturer">Manufacturer</Option>
                        <Option value="Wholesaler">Wholesaler</Option>
                        <Option value="Distributor">Distributor</Option>
                        <Option value="Retailer">Retailer</Option>
                        <Option value="Service Provider">Service Provider</Option>
                    </Select>
                </div>
                <div className="min-w-[120px]">
                    <Text type="secondary" className="block mb-1">Bank Details</Text>
                    <Select
                        placeholder="Bank status"
                        value={filters.hasBank}
                        onChange={(value) => onFilterChange('hasBank', value)}
                        allowClear
                        style={{ width: '100%' }}
                    >
                        <Option value="yes">With Bank Details</Option>
                        <Option value="no">Without Bank Details</Option>
                    </Select>
                </div>
            </div>
            <div className="flex gap-2">
                <Button type="primary" onClick={onApplyFilters}>
                    Apply Filters
                </Button>
                <Button icon={<ClearOutlined />} onClick={onResetFilters}>
                    Reset
                </Button>
            </div>
        </div>
    </Card>
);

// Details Drawer Component
const SupplierDetailsDrawer = ({ visible, onClose, supplier, loading }) => (
    <Drawer
        title={
            <div className="flex items-center gap-3">
                <Avatar
                    size={40}
                    src={supplier?.photo !== "default-supplier.png" ? supplier?.photo : undefined}
                    icon={<UserOutlined />}
                />
                <div>
                    <div className="font-semibold">{supplier?.name}</div>
                    <div className="text-sm text-gray-500">{supplier?.email}</div>
                </div>
            </div>
        }
        placement="right"
        size="large"
        open={visible}
        onClose={onClose}
    >
        {loading ? (
            <div className="flex justify-center items-center h-64">
                <Spin size="large" />
            </div>
        ) : supplier ? (
            <div className="space-y-6">
                <Descriptions title="Basic Information" bordered column={1}>
                    <Descriptions.Item label="Name">{supplier.name}</Descriptions.Item>
                    <Descriptions.Item label="Email">{supplier.email}</Descriptions.Item>
                    <Descriptions.Item label="Phone">{supplier.phone}</Descriptions.Item>
                    <Descriptions.Item label="Shop Name">
                        {supplier.shopname || <Text type="secondary">Not specified</Text>}
                    </Descriptions.Item>
                    <Descriptions.Item label="Type">
                        {supplier.type ? (
                            <Tag color="blue">{supplier.type}</Tag>
                        ) : (
                            <Text type="secondary">Not specified</Text>
                        )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Address">{supplier.address}</Descriptions.Item>
                </Descriptions>

                <Descriptions title="Bank Information" bordered column={1}>
                    <Descriptions.Item label="Bank Name">
                        {supplier.bank_name || <Text type="secondary">Not provided</Text>}
                    </Descriptions.Item>
                    <Descriptions.Item label="Account Holder">
                        {supplier.account_holder || <Text type="secondary">Not provided</Text>}
                    </Descriptions.Item>
                    <Descriptions.Item label="Account Number">
                        {supplier.account_number || <Text type="secondary">Not provided</Text>}
                    </Descriptions.Item>
                </Descriptions>

                <Descriptions title="System Information" bordered column={1}>
                    <Descriptions.Item label="Created At">
                        {new Date(supplier.createdAt).toLocaleString()}
                    </Descriptions.Item>
                    <Descriptions.Item label="Updated At">
                        {new Date(supplier.updatedAt).toLocaleString()}
                    </Descriptions.Item>
                    <Descriptions.Item label="Supplier ID">
                        <Text code>{supplier._id}</Text>
                    </Descriptions.Item>
                </Descriptions>
            </div>
        ) : (
            <Empty description="No supplier data available" />
        )}
    </Drawer>
);

const Suppliers = () => {
    // State
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const [filters, setFilters] = useState({
        search: "",
        type: "",
        hasBank: "",
    });

    // Memoized fetch function to prevent unnecessary re-renders
    const fetchSuppliers = useCallback(async (page = 1, pageSize = 10, currentFilters = filters) => {
        setLoading(true);
        try {
            // Build query params
            const params = new URLSearchParams();
            params.append('page', page);
            params.append('limit', pageSize);
            
            if (currentFilters.search) params.append('search', currentFilters.search);
            if (currentFilters.type) params.append('type', currentFilters.type);
            if (currentFilters.hasBank) params.append('hasBank', currentFilters.hasBank);

            const response = await api.get(`/suppliers?${params.toString()}`);
            const data = response.data.data;
            
            setSuppliers(Array.isArray(data) ? data : data.suppliers || []);
            setPagination(prev => ({
                ...prev,
                current: page,
                pageSize: pageSize,
                total: data.total || (Array.isArray(data) ? data.length : 0),
            }));
        } catch (error) {
            console.error("Error fetching suppliers:", error);
            toast.error(error.response?.data?.message || "Failed to fetch suppliers");
            setSuppliers([]);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    // Initial fetch
    useEffect(() => {
        fetchSuppliers();
    }, [fetchSuppliers]);

    // Event handlers
    const handleTableChange = (paginationInfo) => {
        fetchSuppliers(paginationInfo.current, paginationInfo.pageSize);
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleApplyFilters = () => {
        fetchSuppliers(1, pagination.pageSize, filters);
    };

    const handleResetFilters = () => {
        const resetFilters = {
            search: "",
            type: "",
            hasBank: "",
        };
        setFilters(resetFilters);
        fetchSuppliers(1, pagination.pageSize, resetFilters);
    };

    const handleAdd = () => {
        setEditingSupplier(null);
        form.resetFields();
        setFileList([]);
        setModalVisible(true);
    };

    const handleEdit = (supplier) => {
        setEditingSupplier(supplier);
        form.setFieldsValue({
            name: supplier.name,
            email: supplier.email,
            phone: supplier.phone,
            address: supplier.address,
            shopname: supplier.shopname,
            type: supplier.type,
            bank_name: supplier.bank_name,
            account_holder: supplier.account_holder,
            account_number: supplier.account_number,
        });

        if (supplier.photo && supplier.photo !== "default-supplier.png") {
            setFileList([
                {
                    uid: "-1",
                    name: "current-photo",
                    status: "done",
                    url: supplier.photo,
                },
            ]);
        } else {
            setFileList([]);
        }

        setModalVisible(true);
    };

    const handleViewDetails = (supplier) => {
        setSelectedSupplier(supplier);
        setDetailsDrawerVisible(true);
    };

    const handleSubmit = async (values) => {
        try {
            const formData = new FormData();

            Object.keys(values).forEach((key) => {
                if (values[key] !== undefined && values[key] !== null) {
                    formData.append(key, values[key]);
                }
            });

            if (fileList.length > 0 && fileList[0].originFileObj) {
                formData.append("photo", fileList[0].originFileObj);
            }

            if (editingSupplier) {
                await api.patch(`/suppliers/${editingSupplier._id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                toast.success("Supplier updated successfully");
            } else {
                await api.post("/suppliers", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                toast.success("Supplier created successfully");
            }

            setModalVisible(false);
            form.resetFields();
            setFileList([]);
            fetchSuppliers(pagination.current, pagination.pageSize);
        } catch (error) {
            console.error("Error submitting supplier:", error);
            toast.error(error.response?.data?.message || "Operation failed");
        }
    };

    const handleDelete = async (supplierId) => {
        try {
            await api.delete(`/suppliers/${supplierId}`);
            toast.success("Supplier deleted successfully");
            fetchSuppliers(pagination.current, pagination.pageSize);
        } catch (error) {
            console.error("Error deleting supplier:", error);
            toast.error(error.response?.data?.message || "Failed to delete supplier");
        }
    };

    const uploadProps = {
        fileList,
        beforeUpload: (file) => {
            const isImage = file.type.startsWith("image/");
            if (!isImage) {
                toast.error("You can only upload image files!");
                return false;
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                toast.error("Image must be smaller than 2MB!");
                return false;
            }
            return false;
        },
        onChange: ({ fileList }) => {
            setFileList(fileList.slice(-1));
        },
        onRemove: () => {
            setFileList([]);
        },
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
                    size={40}
                    src={photo !== "default-supplier.png" ? photo : undefined}
                    icon={<UserOutlined />}
                />
            ),
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            sorter: (a, b) => a.name.localeCompare(b.name),
            render: (text, record) => (
                <div>
                    <Text strong className="block">{text}</Text>
                    {record.shopname && (
                        <Text type="secondary" className="text-xs">
                            <ShopOutlined className="mr-1" />
                            {record.shopname}
                        </Text>
                    )}
                </div>
            ),
        },
        {
            title: "Contact",
            key: "contact",
            render: (_, record) => (
                <div className="space-y-1">
                    <div className="flex items-center">
                        <MailOutlined className="mr-2 text-gray-500 text-xs" />
                        <Text className="text-sm">{record.email}</Text>
                    </div>
                    <div className="flex items-center">
                        <PhoneOutlined className="mr-2 text-gray-500 text-xs" />
                        <Text className="text-sm">{record.phone}</Text>
                    </div>
                </div>
            ),
        },
        {
            title: "Type & Bank",
            key: "typeBank",
            render: (_, record) => (
                <div className="space-y-1">
                    <div>
                        {record.type ? (
                            <Tag color="blue" size="small">{record.type}</Tag>
                        ) : (
                            <Text type="secondary" className="text-xs">No type</Text>
                        )}
                    </div>
                    <div>
                        {record.bank_name ? (
                            <Badge status="success" text="Bank details" />
                        ) : (
                            <Badge status="default" text="No bank info" />
                        )}
                    </div>
                </div>
            ),
        },
        {
            title: "Address",
            dataIndex: "address",
            key: "address",
            ellipsis: true,
            render: (address) => (
                <div className="max-w-xs">
                    <Text className="text-sm" ellipsis={{ tooltip: address }}>
                        {address}
                    </Text>
                </div>
            ),
        },
        {
            title: "Created",
            dataIndex: "createdAt",
            key: "createdAt",
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: "Actions",
            key: "actions",
            width: 160,
            render: (_, record) => (
                <Space size="small" wrap>
                    <Button
                        type="text"
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewDetails(record)}
                    />
                    <Button
                        type="text"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    />
                    <Popconfirm
                        title="Delete Supplier"
                        description="Are you sure you want to delete this supplier?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            type="text"
                            danger
                            size="small"
                            icon={<DeleteOutlined />}
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-white">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="mb-8">
                    <PageHeader
                        title="Suppliers"
                        subtitle="Manage and track your suppliers"
                        icon={<UserOutlined className="text-blue-600" />}
                        actionText="Add Supplier"
                        actionIcon={<PlusOutlined />}
                        onActionClick={handleAdd}
                    />
                </div>

                {/* Stats Section */}
                <div className="mb-8">
                    <SupplierStats suppliers={suppliers} loading={loading} />
                </div>

                {/* Filters Section */}
                <SupplierFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onApplyFilters={handleApplyFilters}
                    onResetFilters={handleResetFilters}
                />

                {/* Suppliers Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <Table
                        columns={columns}
                        dataSource={suppliers}
                        rowKey="_id"
                        loading={loading}
                        pagination={{
                            ...pagination,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} of ${total} suppliers`,
                        }}
                        onChange={handleTableChange}
                        scroll={{ x: 1200 }}
                    />
                </div>

                {/* Create/Edit Supplier Modal */}
                <Modal
                    title={editingSupplier ? "Edit Supplier" : "Add New Supplier"}
                    open={modalVisible}
                    onCancel={() => {
                        setModalVisible(false);
                        form.resetFields();
                        setFileList([]);
                    }}
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
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="name"
                                    label="Supplier Name"
                                    rules={[
                                        { required: true, message: "Please enter supplier name" },
                                        { max: 50, message: "Name cannot exceed 50 characters" },
                                    ]}
                                >
                                    <Input
                                        prefix={<UserOutlined />}
                                        placeholder="Enter supplier name"
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="email"
                                    label="Email"
                                    rules={[
                                        { required: true, message: "Please enter email" },
                                        { type: "email", message: "Please enter a valid email" },
                                        { max: 50, message: "Email cannot exceed 50 characters" },
                                    ]}
                                >
                                    <Input
                                        prefix={<MailOutlined />}
                                        placeholder="Enter email address"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="phone"
                                    label="Phone Number"
                                    rules={[
                                        { required: true, message: "Please enter phone number" },
                                        { max: 15, message: "Phone cannot exceed 15 characters" },
                                    ]}
                                >
                                    <Input
                                        prefix={<PhoneOutlined />}
                                        placeholder="Enter phone number"
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="shopname"
                                    label="Shop Name"
                                    rules={[
                                        { max: 50, message: "Shop name cannot exceed 50 characters" },
                                    ]}
                                >
                                    <Input
                                        prefix={<ShopOutlined />}
                                        placeholder="Enter shop name (optional)"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="type"
                                    label="Supplier Type"
                                    rules={[
                                        { max: 15, message: "Type cannot exceed 15 characters" },
                                    ]}
                                >
                                    <Select placeholder="Select supplier type (optional)">
                                        <Option value="Manufacturer">Manufacturer</Option>
                                        <Option value="Wholesaler">Wholesaler</Option>
                                        <Option value="Distributor">Distributor</Option>
                                        <Option value="Retailer">Retailer</Option>
                                        <Option value="Service Provider">Service Provider</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item name="photo" label="Supplier Photo">
                                    <Upload {...uploadProps} listType="picture-card">
                                        {fileList.length < 1 && (
                                            <div>
                                                <UploadOutlined />
                                                <div style={{ marginTop: 8 }}>Upload Photo</div>
                                            </div>
                                        )}
                                    </Upload>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            name="address"
                            label="Address"
                            rules={[
                                { required: true, message: "Please enter address" },
                                { max: 100, message: "Address cannot exceed 100 characters" },
                            ]}
                        >
                            <TextArea
                                rows={3}
                                placeholder="Enter full address"
                                showCount
                                maxLength={100}
                            />
                        </Form.Item>

                        <div className="border-t pt-4 mt-6">
                            <Title level={5}>Bank Details (Optional)</Title>
                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        name="bank_name"
                                        label="Bank Name"
                                        rules={[
                                            { max: 50, message: "Bank name cannot exceed 50 characters" },
                                        ]}
                                    >
                                        <Input
                                            prefix={<BankOutlined />}
                                            placeholder="Enter bank name"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        name="account_holder"
                                        label="Account Holder Name"
                                        rules={[
                                            { max: 50, message: "Account holder name cannot exceed 50 characters" },
                                        ]}
                                    >
                                        <Input placeholder="Enter account holder name" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item
                                name="account_number"
                                label="Account Number"
                                rules={[
                                    { max: 50, message: "Account number cannot exceed 50 characters" },
                                ]}
                            >
                                <Input placeholder="Enter account number" />
                            </Form.Item>
                        </div>

                        <Form.Item className="mb-0 text-right">
                            <Space>
                                <Button
                                    onClick={() => {
                                        setModalVisible(false);
                                        form.resetFields();
                                        setFileList([]);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button type="primary" htmlType="submit">
                                    {editingSupplier ? "Update Supplier" : "Create Supplier"}
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Modal>

                {/* Supplier Details Drawer */}
                <SupplierDetailsDrawer
                    visible={detailsDrawerVisible}
                    onClose={() => setDetailsDrawerVisible(false)}
                    supplier={selectedSupplier}
                    loading={false}
                />
            </div>
        </div>
    );
};

export default Suppliers;