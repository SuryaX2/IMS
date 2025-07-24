import React, { useState, useEffect } from "react";
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Upload,
    Card,
    Statistic,
    Space,
    Dropdown,
    Avatar,
    Tag,
    Row,
    Col,
    Select,
    Descriptions,
    Divider,
} from "antd";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    MoreOutlined,
    UserOutlined,
    ShopOutlined,
    PhoneOutlined,
    MailOutlined,
    BankOutlined,
    UploadOutlined,
    SearchOutlined,
    FilterOutlined,
    ProductFilled,
    UsergroupAddOutlined,
} from "@ant-design/icons";
import { toast } from "react-hot-toast";
import PageHeader from "../components/common/PageHeader";
import { api } from "../api/api";

const { Search } = Input;
const { Option } = Select;

const Suppliers = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [fileList, setFileList] = useState([]);

    // Statistics
    const [stats, setStats] = useState({
        individual: 0,
        wholesale: 0,
        retail: 0,
        company: 0,
    });

    // Fetch suppliers
    const fetchSuppliers = async () => {
        setLoading(true);
        try {
            const response = await api.get("/suppliers");
            setSuppliers(response.data.data);
            calculateStats(response.data.data);
        } catch (error) {
            toast.error("Failed to fetch suppliers");
            console.error("Error fetching suppliers:", error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate statistics
    const calculateStats = (suppliersData) => {
        const individual = suppliersData.filter(
            (s) => s.type === "individual"
        ).length;
        const wholesale = suppliersData.filter(
            (s) => s.type === "wholesale"
        ).length;
        const retail = suppliersData.filter((s) => s.type === "retail").length;
        const company = suppliersData.filter(
            (s) => s.type === "company"
        ).length;

        setStats({
            individual,
            wholesale,
            retail,
            company,
        });
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    // Handle create/update supplier
    const handleSubmit = async (values) => {
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
            if (editMode && selectedSupplier) {
                response = await api.patch(
                    `/suppliers/${selectedSupplier._id}`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
                toast.success("Supplier updated successfully");
            } else {
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
            setEditMode(false);
            setSelectedSupplier(null);
            fetchSuppliers();
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation failed");
        }
    };

    // Handle delete supplier
    const handleDelete = async (id) => {
        try {
            await api.delete(`/suppliers/${id}`);
            toast.success("Supplier deleted successfully");
            fetchSuppliers();
        } catch (error) {
            toast.error("Failed to delete supplier");
        }
    };

    // Handle edit
    const handleEdit = (supplier) => {
        setSelectedSupplier(supplier);
        setEditMode(true);
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
        setModalVisible(true);
    };

    // Handle view
    const handleView = (supplier) => {
        setSelectedSupplier(supplier);
        setViewModalVisible(true);
    };

    // Filter suppliers
    const filteredSuppliers = suppliers.filter((supplier) => {
        const matchesSearch =
            supplier.name.toLowerCase().includes(searchText.toLowerCase()) ||
            supplier.email.toLowerCase().includes(searchText.toLowerCase()) ||
            supplier.phone.includes(searchText);

        const matchesFilter =
            filterType === "all" || supplier.type === filterType;

        return matchesSearch && matchesFilter;
    });

    // Upload props
    const uploadProps = {
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
            return false; // Prevent automatic upload
        },
        fileList,
        onChange: ({ fileList }) => setFileList(fileList),
    };

    const columns = [
        {
            title: "Photo",
            dataIndex: "photo",
            key: "photo",
            width: 80,
            render: (photo, record) => (
                <Avatar
                    size={40}
                    src={photo !== "default-supplier.png" ? photo : null}
                    icon={<UserOutlined />}
                />
            ),
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            sorter: (a, b) => a.name.localeCompare(b.name),
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
        },
        {
            title: "Shop Name",
            dataIndex: "shopname",
            key: "shopname",
            render: (shopname) => shopname || "-",
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            render: (type) => (
                <Tag color={type === "company" ? "blue" : "green"}>
                    {type?.toUpperCase() || "N/A"}
                </Tag>
            ),
        },
        {
            title: "Address",
            dataIndex: "address",
            key: "address",
            ellipsis: true,
        },
        {
            title: "Actions",
            key: "actions",
            width: 120,
            render: (_, record) => {
                const items = [
                    {
                        key: "view",
                        label: "View Details",
                        icon: <EyeOutlined />,
                        onClick: () => handleView(record),
                    },
                    {
                        key: "edit",
                        label: "Edit",
                        icon: <EditOutlined />,
                        onClick: () => handleEdit(record),
                    },
                    {
                        key: "delete",
                        label: "Delete",
                        icon: <DeleteOutlined />,
                        danger: true,
                        onClick: () => {
                            Modal.confirm({
                                title: "Delete Supplier",
                                content: `Are you sure you want to delete ${record.name}?`,
                                okText: "Yes",
                                okType: "danger",
                                cancelText: "No",
                                onOk: () => handleDelete(record._id),
                            });
                        },
                    },
                ];

                return (
                    <Dropdown menu={{ items }} trigger={["click"]}>
                        <Button type="text" icon={<MoreOutlined />} />
                    </Dropdown>
                );
            },
        },
    ];

    return (
        <div className="p-6">
            <PageHeader
                title="Suppliers"
                subtitle="Manage your suppliers and their information"
                icon={<UserOutlined />}
                actionText="Add Supplier"
                actionIcon={<PlusOutlined />}
                onActionClick={() => {
                    setEditMode(false);
                    setSelectedSupplier(null);
                    form.resetFields();
                    setFileList([]);
                    setModalVisible(true);
                }}
            />

            {/* Statistics Cards */}
            <Row gutter={[16, 16]} className="mb-6">
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Individual"
                            value={stats.individual}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: "#722ed1" }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Wholesale"
                            value={stats.wholesale}
                            prefix={<ProductFilled />}
                            valueStyle={{ color: "#1890ff" }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Retail"
                            value={stats.retail}
                            prefix={<UsergroupAddOutlined />}
                            valueStyle={{ color: "#52c41a" }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Companies"
                            value={stats.company}
                            prefix={<ShopOutlined />}
                            valueStyle={{ color: "#fa8c16" }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Search and Filter */}
            <Card className="mb-4">
                <Row gutter={16} align="middle">
                    <Col xs={24} md={12} lg={8}>
                        <Search
                            placeholder="Search suppliers..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            prefix={<SearchOutlined />}
                            allowClear
                        />
                    </Col>
                    <Col xs={24} md={12} lg={6}>
                        <Select
                            style={{ width: "100%" }}
                            placeholder="Filter by type"
                            value={filterType}
                            onChange={setFilterType}
                            suffixIcon={<FilterOutlined />}
                        >
                            <Option value="all">All Types</Option>
                            <Option value="individual">Individual</Option>
                            <Option value="wholesale">Wholesale</Option>
                            <Option value="retail">Retail</Option>
                            <Option value="company">Company</Option>
                        </Select>
                    </Col>
                </Row>
            </Card>

            {/* Suppliers Table */}
            <Card>
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
                    scroll={{ x: 800 }}
                />
            </Card>

            {/* Add/Edit Modal */}
            <Modal
                title={editMode ? "Edit Supplier" : "Add New Supplier"}
                open={modalVisible}
                onCancel={() => {
                    setModalVisible(false);
                    form.resetFields();
                    setFileList([]);
                    setEditMode(false);
                    setSelectedSupplier(null);
                }}
                footer={null}
                width={800}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    autoComplete="off"
                >
                    <Row gutter={16}>
                        <Col span={12}>
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
                                            "Name must be less than 50 characters",
                                    },
                                ]}
                            >
                                <Input
                                    prefix={<UserOutlined />}
                                    placeholder="Enter supplier name"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
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
                                        message: "Please enter valid email",
                                    },
                                    {
                                        max: 50,
                                        message:
                                            "Email must be less than 50 characters",
                                    },
                                ]}
                            >
                                <Input
                                    prefix={<MailOutlined />}
                                    placeholder="Enter email"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="phone"
                                label="Phone"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter phone number",
                                    },
                                    {
                                        max: 15,
                                        message:
                                            "Phone must be less than 15 characters",
                                    },
                                ]}
                            >
                                <Input
                                    prefix={<PhoneOutlined />}
                                    placeholder="Enter phone number"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="type" label="Supplier Type">
                                <Select placeholder="Select supplier type">
                                    <Option value="individual">
                                        Individual
                                    </Option>
                                    <Option value="wholesale">Wholesale</Option>
                                    <Option value="retail">Retail</Option>
                                    <Option value="company">Company</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="shopname"
                                label="Shop Name"
                                rules={[
                                    {
                                        max: 50,
                                        message:
                                            "Shop name must be less than 50 characters",
                                    },
                                ]}
                            >
                                <Input
                                    prefix={<ShopOutlined />}
                                    placeholder="Enter shop name"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="address"
                                label="Address"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter address",
                                    },
                                    {
                                        max: 100,
                                        message:
                                            "Address must be less than 100 characters",
                                    },
                                ]}
                            >
                                <Input placeholder="Enter address" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider>Banking Information (Optional)</Divider>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="bank_name"
                                label="Bank Name"
                                rules={[
                                    {
                                        max: 50,
                                        message:
                                            "Bank name must be less than 50 characters",
                                    },
                                ]}
                            >
                                <Input
                                    prefix={<BankOutlined />}
                                    placeholder="Enter bank name"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="account_holder"
                                label="Account Holder"
                                rules={[
                                    {
                                        max: 50,
                                        message:
                                            "Account holder must be less than 50 characters",
                                    },
                                ]}
                            >
                                <Input placeholder="Enter account holder name" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="account_number"
                                label="Account Number"
                                rules={[
                                    {
                                        max: 50,
                                        message:
                                            "Account number must be less than 50 characters",
                                    },
                                ]}
                            >
                                <Input placeholder="Enter account number" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="photo" label="Supplier Photo">
                                <Upload {...uploadProps} maxCount={1}>
                                    <Button icon={<UploadOutlined />}>
                                        Upload Photo
                                    </Button>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item className="mb-0 mt-4">
                        <Space className="w-full justify-end">
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
                                {editMode
                                    ? "Update Supplier"
                                    : "Create Supplier"}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* View Modal */}
            <Modal
                title="Supplier Details"
                open={viewModalVisible}
                onCancel={() => setViewModalVisible(false)}
                footer={[
                    <Button
                        key="close"
                        onClick={() => setViewModalVisible(false)}
                    >
                        Close
                    </Button>,
                    <Button
                        key="edit"
                        type="primary"
                        onClick={() => {
                            setViewModalVisible(false);
                            handleEdit(selectedSupplier);
                        }}
                    >
                        Edit Supplier
                    </Button>,
                ]}
                width={600}
            >
                {selectedSupplier && (
                    <div>
                        <div className="text-center mb-4">
                            <Avatar
                                size={80}
                                src={
                                    selectedSupplier.photo !==
                                    "default-supplier.png"
                                        ? selectedSupplier.photo
                                        : null
                                }
                                icon={<UserOutlined />}
                            />
                            <h3 className="mt-2 mb-0">
                                {selectedSupplier.name}
                            </h3>
                            <Tag
                                color={
                                    selectedSupplier.type === "company"
                                        ? "blue"
                                        : "green"
                                }
                            >
                                {selectedSupplier.type?.toUpperCase() || "N/A"}
                            </Tag>
                        </div>

                        <Descriptions column={1} bordered>
                            <Descriptions.Item label="Email">
                                {selectedSupplier.email}
                            </Descriptions.Item>
                            <Descriptions.Item label="Phone">
                                {selectedSupplier.phone}
                            </Descriptions.Item>
                            <Descriptions.Item label="Address">
                                {selectedSupplier.address}
                            </Descriptions.Item>
                            <Descriptions.Item label="Shop Name">
                                {selectedSupplier.shopname || "-"}
                            </Descriptions.Item>
                            {selectedSupplier.bank_name && (
                                <>
                                    <Descriptions.Item label="Bank Name">
                                        {selectedSupplier.bank_name}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Account Holder">
                                        {selectedSupplier.account_holder || "-"}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Account Number">
                                        {selectedSupplier.account_number || "-"}
                                    </Descriptions.Item>
                                </>
                            )}
                            <Descriptions.Item label="Created">
                                {new Date(
                                    selectedSupplier.createdAt
                                ).toLocaleDateString()}
                            </Descriptions.Item>
                        </Descriptions>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Suppliers;
