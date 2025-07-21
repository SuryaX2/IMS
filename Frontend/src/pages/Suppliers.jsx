import React, { useState, useEffect } from "react";
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
} from "@ant-design/icons";
import { toast } from "react-hot-toast";
import { api } from "../api/api.js";

const { Title, Text } = Typography;
const { TextArea } = Input;

const Suppliers = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState("");
    const [fileList, setFileList] = useState([]);

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
            toast.error(error.response?.data?.message || "Failed to fetch suppliers");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (values) => {
        try {
            const formData = new FormData();
            
            // Append all form fields to FormData
            Object.keys(values).forEach(key => {
                if (values[key] !== undefined && values[key] !== null) {
                    formData.append(key, values[key]);
                }
            });

            // Append photo if exists
            if (fileList.length > 0 && fileList[0].originFileObj) {
                formData.append('photo', fileList[0].originFileObj);
            }

            if (editingSupplier) {
                // Update supplier
                const response = await api.patch(`/suppliers/${editingSupplier._id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                toast.success("Supplier updated successfully");
            } else {
                // Create new supplier
                const response = await api.post("/suppliers", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                toast.success("Supplier created successfully");
            }

            fetchSuppliers();
            handleCancel();
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation failed");
        }
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
        
        // Set existing photo for display
        if (supplier.photo && supplier.photo !== "default-supplier.png") {
            setFileList([
                {
                    uid: '-1',
                    name: 'current-photo.jpg',
                    status: 'done',
                    url: supplier.photo,
                }
            ]);
        }
        
        setModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/suppliers/${id}`);
            toast.success("Supplier deleted successfully");
            fetchSuppliers();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete supplier");
        }
    };

    const handleCancel = () => {
        setModalVisible(false);
        setEditingSupplier(null);
        form.resetFields();
        setFileList([]);
    };

    const uploadProps = {
        fileList,
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
            setFileList(fileList.slice(-1)); // Keep only the last file
        },
        onRemove: () => {
            setFileList([]);
        },
    };

    // Filter suppliers based on search text
    const filteredSuppliers = suppliers.filter(supplier =>
        supplier.name.toLowerCase().includes(searchText.toLowerCase()) ||
        supplier.email.toLowerCase().includes(searchText.toLowerCase()) ||
        supplier.phone.includes(searchText) ||
        (supplier.shopname && supplier.shopname.toLowerCase().includes(searchText.toLowerCase()))
    );

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
            width: 150,
            render: (_, record) => (
                <Space size="small">
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

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <Card className="shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <Title level={2} className="!mb-2">
                            <ShopOutlined className="mr-2" />
                            Suppliers Management
                        </Title>
                        <Text type="secondary">
                            Manage your suppliers and their information
                        </Text>
                    </div>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setModalVisible(true)}
                        size="large"
                    >
                        Add New Supplier
                    </Button>
                </div>

                <div className="mb-4">
                    <Input
                        placeholder="Search suppliers by name, email, phone, or shop name..."
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        size="large"
                        style={{ maxWidth: 400 }}
                    />
                </div>

                <Table
                    columns={columns}
                    dataSource={filteredSuppliers}
                    loading={loading}
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

            <Modal
                title={
                    <Space>
                        <UserOutlined />
                        {editingSupplier ? "Edit Supplier" : "Add New Supplier"}
                    </Space>
                }
                open={modalVisible}
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
                            <Button type="primary" htmlType="submit">
                                {editingSupplier ? "Update Supplier" : "Create Supplier"}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Suppliers;