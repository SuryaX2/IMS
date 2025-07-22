import React, { useState, useEffect } from "react";
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
    Divider,
    Select,
    Typography,
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
} from "@ant-design/icons";
import { toast } from "react-hot-toast";
import { api } from "../api/api";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const Suppliers = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [searchText, setSearchText] = useState("");

    // Fetch suppliers on component mount
    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        setLoading(true);
        try {
            const response = await api.get("/suppliers");
            setSuppliers(response.data.data);
            toast.success("Suppliers loaded successfully");
        } catch (error) {
            console.error("Error fetching suppliers:", error);
            toast.error(
                error.response?.data?.message || "Failed to fetch suppliers"
            );
        } finally {
            setLoading(false);
        }
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

        // Set existing photo if available
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

    const handleSubmit = async (values) => {
        try {
            const formData = new FormData();

            // Append all form fields
            Object.keys(values).forEach((key) => {
                if (values[key] !== undefined && values[key] !== null) {
                    formData.append(key, values[key]);
                }
            });

            // Append photo if selected
            if (fileList.length > 0 && fileList[0].originFileObj) {
                formData.append("photo", fileList[0].originFileObj);
            }

            let response;
            if (editingSupplier) {
                // Update supplier
                response = await api.patch(
                    `/suppliers/${editingSupplier._id}`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
                toast.success("Supplier updated successfully");
            } else {
                // Create new supplier
                response = await api.post("/suppliers", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                toast.success("Supplier created successfully");
            }

            setModalVisible(false);
            form.resetFields();
            setFileList([]);
            fetchSuppliers();
        } catch (error) {
            console.error("Error submitting supplier:", error);
            toast.error(error.response?.data?.message || "Operation failed");
        }
    };

    const handleDelete = async (supplierId) => {
        try {
            await api.delete(`/suppliers/${supplierId}`);
            toast.success("Supplier deleted successfully");
            fetchSuppliers();
        } catch (error) {
            console.error("Error deleting supplier:", error);
            toast.error(
                error.response?.data?.message || "Failed to delete supplier"
            );
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
            return false; // Prevent auto upload
        },
        onChange: ({ fileList }) => {
            setFileList(fileList.slice(-1)); // Keep only the latest file
        },
        onRemove: () => {
            setFileList([]);
        },
    };

    // Filter suppliers based on search
    const filteredSuppliers = suppliers.filter(
        (supplier) =>
            supplier.name.toLowerCase().includes(searchText.toLowerCase()) ||
            supplier.email.toLowerCase().includes(searchText.toLowerCase()) ||
            supplier.phone.includes(searchText) ||
            (supplier.shopname &&
                supplier.shopname
                    .toLowerCase()
                    .includes(searchText.toLowerCase()))
    );

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
                    <Text strong>{text}</Text>
                    {record.shopname && (
                        <div>
                            <Text type="secondary" className="text-xs">
                                <ShopOutlined className="mr-1" />
                                {record.shopname}
                            </Text>
                        </div>
                    )}
                </div>
            ),
        },
        {
            title: "Contact",
            key: "contact",
            render: (_, record) => (
                <div>
                    <div className="mb-1">
                        <MailOutlined className="mr-2 text-gray-500" />
                        <Text className="text-sm">{record.email}</Text>
                    </div>
                    <div>
                        <PhoneOutlined className="mr-2 text-gray-500" />
                        <Text className="text-sm">{record.phone}</Text>
                    </div>
                </div>
            ),
        },
        {
            title: "Address",
            dataIndex: "address",
            key: "address",
            render: (address) => (
                <div className="max-w-xs">
                    <HomeOutlined className="mr-2 text-gray-500" />
                    <Text className="text-sm">{address}</Text>
                </div>
            ),
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            render: (type) =>
                type ? (
                    <Tag color="blue">{type}</Tag>
                ) : (
                    <Text type="secondary">-</Text>
                ),
        },
        {
            title: "Bank Details",
            key: "bankDetails",
            render: (_, record) => (
                <div>
                    {record.bank_name && (
                        <div className="mb-1">
                            <BankOutlined className="mr-2 text-gray-500" />
                            <Text className="text-sm">{record.bank_name}</Text>
                        </div>
                    )}
                    {record.account_holder && (
                        <div className="text-xs text-gray-500">
                            {record.account_holder}
                        </div>
                    )}
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
            width: 120,
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        ghost
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Delete Supplier"
                        description="Are you sure you want to delete this supplier?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            type="primary"
                            danger
                            size="small"
                            icon={<DeleteOutlined />}
                        >
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6">
            <Card>
                <div className="mb-6">
                    <Title level={2} className="mb-4">
                        <UserOutlined className="mr-3" />
                        Supplier Management
                    </Title>

                    <Row gutter={[16, 16]} className="mb-4">
                        <Col xs={24} sm={12} md={8}>
                            <Input
                                placeholder="Search suppliers..."
                                prefix={<SearchOutlined />}
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                allowClear
                            />
                        </Col>
                        <Col xs={24} sm={12} md={16} className="text-right">
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={handleAdd}
                                size="large"
                            >
                                Add New Supplier
                            </Button>
                        </Col>
                    </Row>

                    <Divider />

                    <div className="mb-4">
                        <Row gutter={[16, 16]}>
                            <Col xs={12} sm={6}>
                                <Card size="small" className="text-center">
                                    <Text type="secondary">
                                        Total Suppliers
                                    </Text>
                                    <div className="text-2xl font-bold text-blue-600">
                                        {filteredSuppliers.length}
                                    </div>
                                </Card>
                            </Col>
                            <Col xs={12} sm={6}>
                                <Card size="small" className="text-center">
                                    <Text type="secondary">
                                        Active Suppliers
                                    </Text>
                                    <div className="text-2xl font-bold text-green-600">
                                        {filteredSuppliers.length}
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </div>

                <Table
                    columns={columns}
                    dataSource={filteredSuppliers}
                    rowKey="_id"
                    loading={loading}
                    pagination={{
                        total: filteredSuppliers.length,
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} suppliers`,
                    }}
                    scroll={{ x: 1200 }}
                />
            </Card>

            {/* Add/Edit Supplier Modal */}
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
                                    {
                                        required: true,
                                        message: "Please enter supplier name",
                                    },
                                    {
                                        max: 50,
                                        message:
                                            "Name cannot exceed 50 characters",
                                    },
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
                                    {
                                        required: true,
                                        message: "Please enter email",
                                    },
                                    {
                                        type: "email",
                                        message: "Please enter a valid email",
                                    },
                                    {
                                        max: 50,
                                        message:
                                            "Email cannot exceed 50 characters",
                                    },
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
                                    {
                                        max: 50,
                                        message:
                                            "Shop name cannot exceed 50 characters",
                                    },
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
                                    {
                                        max: 15,
                                        message:
                                            "Type cannot exceed 15 characters",
                                    },
                                ]}
                            >
                                <Select placeholder="Select supplier type (optional)">
                                    <Option value="Manufacturer">
                                        Manufacturer
                                    </Option>
                                    <Option value="Wholesaler">
                                        Wholesaler
                                    </Option>
                                    <Option value="Distributor">
                                        Distributor
                                    </Option>
                                    <Option value="Retailer">Retailer</Option>
                                    <Option value="Service Provider">
                                        Service Provider
                                    </Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item name="photo" label="Supplier Photo">
                                <Upload
                                    {...uploadProps}
                                    listType="picture-card"
                                >
                                    {fileList.length < 1 && (
                                        <div>
                                            <UploadOutlined />
                                            <div style={{ marginTop: 8 }}>
                                                Upload Photo
                                            </div>
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
                            {
                                max: 100,
                                message: "Address cannot exceed 100 characters",
                            },
                        ]}
                    >
                        <TextArea
                            rows={3}
                            placeholder="Enter full address"
                            showCount
                            maxLength={100}
                        />
                    </Form.Item>

                    <Divider>Bank Details (Optional)</Divider>

                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="bank_name"
                                label="Bank Name"
                                rules={[
                                    {
                                        max: 50,
                                        message:
                                            "Bank name cannot exceed 50 characters",
                                    },
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
                                    {
                                        max: 50,
                                        message:
                                            "Account holder name cannot exceed 50 characters",
                                    },
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
                            {
                                max: 50,
                                message:
                                    "Account number cannot exceed 50 characters",
                            },
                        ]}
                    >
                        <Input placeholder="Enter account number" />
                    </Form.Item>

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
                                {editingSupplier
                                    ? "Update Supplier"
                                    : "Create Supplier"}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Suppliers;
