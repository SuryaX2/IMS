import React, { useState, useEffect, useRef } from "react";
import {
    Card,
    Table,
    Button,
    Input,
    Space,
    Modal,
    Form,
    Select,
    InputNumber,
    Upload,
    Popconfirm,
    message,
    Tag,
    Tooltip,
    Typography,
    Divider,
    Badge,
    Row,
    Col,
    Drawer,
    Image,
} from "antd";
import {
    PlusOutlined,
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined,
    FilterOutlined,
    ReloadOutlined,
    InboxOutlined,
    UploadOutlined,
    EyeOutlined,
} from "@ant-design/icons";
import toast from "react-hot-toast";
import { api } from "../api/api";
import LoadingSpinner from "../components/dashboard/LoadingSpinner";
import ErrorDisplay from "../components/dashboard/ErrorDisplay";

const { Title, Text } = Typography;
const { Option } = Select;

const Products = () => {
    // State variables
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState("Add New Product");
    const [editingProduct, setEditingProduct] = useState(null);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [categoryFilter, setCategoryFilter] = useState(null);
    const [stockFilter, setStockFilter] = useState(null);
    const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
    const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Form reference
    const [form] = Form.useForm();

    // Fetch data on component mount
    useEffect(() => {
        fetchProducts();
        fetchCategories();
        fetchUnits();
    }, []);

    // Fetch products from API
    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);

            // Construct query parameters
            const params = new URLSearchParams();
            if (searchText) params.append("search", searchText);
            if (categoryFilter) params.append("category", categoryFilter);
            if (stockFilter === "out") params.append("max_stock", 0);
            if (stockFilter === "low") {
                params.append("min_stock", 1);
                params.append("max_stock", 10);
            }

            const response = await api.get(`/products?${params.toString()}`);

            if (response.data.success) {
                setProducts(response.data.data);
            } else {
                setError("Failed to fetch products");
                toast.error("Failed to load products");
            }
        } catch (err) {
            console.error("Products fetch error:", err);
            const errorMessage =
                err.response?.data?.message ||
                "Something went wrong while fetching products";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Fetch categories from API
    const fetchCategories = async () => {
        try {
            const response = await api.get("/categories/user");
            if (response.data.success) {
                setCategories(response.data.data);
            }
        } catch (err) {
            console.error("Categories fetch error:", err);
        }
    };

    // Fetch units from API
    const fetchUnits = async () => {
        try {
            const response = await api.get("/units");
            if (response.data.success) {
                setUnits(response.data.data);
            }
        } catch (err) {
            console.error("Units fetch error:", err);
        }
    };

    // Handle creating or updating product
    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            setConfirmLoading(true);

            // Create FormData object for file upload
            const formData = new FormData();
            Object.keys(values).forEach((key) => {
                if (key !== "product_image") {
                    formData.append(key, values[key]);
                }
            });

            // Append image file if available
            if (
                values.product_image &&
                values.product_image[0]?.originFileObj
            ) {
                formData.append(
                    "product_image",
                    values.product_image[0].originFileObj
                );
            }

            let response;
            if (editingProduct) {
                // Update existing product
                response = await api.patch(
                    `/products/${editingProduct._id}`,
                    formData,
                    {
                        headers: { "Content-Type": "multipart/form-data" },
                    }
                );

                if (response.data.success) {
                    toast.success("Product updated successfully");
                    // Update the products list
                    setProducts(
                        products.map((p) =>
                            p._id === editingProduct._id
                                ? response.data.data
                                : p
                        )
                    );
                }
            } else {
                // Create new product
                response = await api.post("/products", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                if (response.data.success) {
                    toast.success("Product created successfully");
                    // Add new product to the list
                    setProducts([...products, response.data.data]);
                }
            }

            // Close modal and reset form
            setModalVisible(false);
            setEditingProduct(null);
            form.resetFields();
            setImageUrl(null);
        } catch (err) {
            console.error("Save product error:", err);
            const errorMessage =
                err.response?.data?.message || "Failed to save product";
            toast.error(errorMessage);
        } finally {
            setConfirmLoading(false);
        }
    };

    // Handle deleting a product
    const handleDelete = async (productId) => {
        try {
            const response = await api.delete(`/products/${productId}`);

            if (response.data.success) {
                toast.success("Product deleted successfully");
                // Remove product from the list
                setProducts(products.filter((p) => p._id !== productId));
            } else {
                toast.error("Failed to delete product");
            }
        } catch (err) {
            console.error("Delete product error:", err);
            const errorMessage =
                err.response?.data?.message || "Failed to delete product";
            toast.error(errorMessage);
        }
    };

    // Open modal to edit product
    const handleEdit = (product) => {
        setModalTitle("Edit Product");
        setEditingProduct(product);
        setImageUrl(product.product_image);

        // Set form values
        form.setFieldsValue({
            product_name: product.product_name,
            product_code: product.product_code,
            category_id: product.category_id._id,
            unit_id: product.unit_id._id,
            buying_price: product.buying_price,
            selling_price: product.selling_price,
        });

        setModalVisible(true);
    };

    // Open modal to add new product
    const handleAdd = () => {
        setModalTitle("Add New Product");
        setEditingProduct(null);
        setImageUrl(null);
        form.resetFields();
        setModalVisible(true);
    };

    // Handle image upload
    const handleImageChange = ({ fileList }) => {
        if (fileList[0]?.originFileObj) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImageUrl(e.target.result);
            };
            reader.readAsDataURL(fileList[0].originFileObj);
        }
    };

    // Handle search
    const handleSearch = () => {
        fetchProducts();
    };

    // Reset all filters
    const resetFilters = () => {
        setSearchText("");
        setCategoryFilter(null);
        setStockFilter(null);
        fetchProducts();
    };

    // View product details
    const viewProductDetails = (product) => {
        setSelectedProduct(product);
        setDetailDrawerVisible(true);
    };

    // Table columns definition
    const columns = [
        {
            title: "Image",
            dataIndex: "product_image",
            key: "product_image",
            width: 80,
            render: (image) => (
                <Image
                    src={image}
                    alt="Product"
                    width={50}
                    height={50}
                    style={{ objectFit: "cover" }}
                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6U"
                />
            ),
        },
        {
            title: "Product Name",
            dataIndex: "product_name",
            key: "product_name",
            sorter: (a, b) => a.product_name.localeCompare(b.product_name),
            render: (text, record) => (
                <div className="flex flex-col">
                    <Text strong>{text}</Text>
                    <Text type="secondary" className="text-xs">
                        Code: {record.product_code}
                    </Text>
                </div>
            ),
        },
        {
            title: "Category",
            dataIndex: ["category_id", "category_name"],
            key: "category",
            responsive: ["md"],
            filters: categories.map((cat) => ({
                text: cat.category_name,
                value: cat._id,
            })),
            onFilter: (value, record) => record.category_id._id === value,
        },
        {
            title: "Stock",
            dataIndex: "stock",
            key: "stock",
            width: 100,
            sorter: (a, b) => a.stock - b.stock,
            render: (stock) => {
                let color = "success";
                let status = "In Stock";

                if (stock === 0) {
                    color = "error";
                    status = "Out of Stock";
                } else if (stock <= 10) {
                    color = "warning";
                    status = "Low Stock";
                }

                return (
                    <div className="flex flex-col items-center">
                        <Badge status={color} />
                        <Text>{stock}</Text>
                        <Text type="secondary" className="text-xs">
                            {status}
                        </Text>
                    </div>
                );
            },
        },
        {
            title: "Price",
            key: "price",
            render: (_, record) => (
                <div className="flex flex-col">
                    <Text strong>${record.selling_price.toFixed(2)}</Text>
                    <Text type="secondary" className="text-xs">
                        Buy: ${record.buying_price.toFixed(2)}
                    </Text>
                </div>
            ),
            sorter: (a, b) => a.selling_price - b.selling_price,
        },
        {
            title: "Unit",
            dataIndex: ["unit_id", "unit_name"],
            key: "unit",
            responsive: ["lg"],
        },
        {
            title: "Actions",
            key: "actions",
            width: 150,
            render: (_, record) => (
                <Space>
                    <Tooltip title="View Details">
                        <Button
                            icon={<EyeOutlined />}
                            onClick={() => viewProductDetails(record)}
                            type="text"
                        />
                    </Tooltip>
                    <Tooltip title="Edit">
                        <Button
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record)}
                            type="text"
                        />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Popconfirm
                            title="Delete this product?"
                            description="This action cannot be undone. Are you sure?"
                            onConfirm={() => handleDelete(record._id)}
                            okText="Yes"
                            cancelText="No"
                            icon={
                                <ExclamationCircleOutlined
                                    style={{ color: "red" }}
                                />
                            }
                        >
                            <Button
                                icon={<DeleteOutlined />}
                                danger
                                type="text"
                            />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    // Loading state
    if (loading && products.length === 0) {
        return <LoadingSpinner tip="Loading products..." />;
    }

    // Error state
    if (error && products.length === 0) {
        return <ErrorDisplay error={error} onRetry={fetchProducts} />;
    }

    return (
        <div className="px-4 py-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                    <Title level={2} className="mb-1">
                        Products
                    </Title>
                    <Text type="secondary">Manage your inventory products</Text>
                </div>
                <div className="mt-4 md:mt-0">
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAdd}
                    >
                        Add Product
                    </Button>
                </div>
            </div>

            {/* Search and Filter Bar */}
            <Card className="mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <Input
                        placeholder="Search products by name or code"
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onPressEnter={handleSearch}
                        className="md:w-72"
                    />

                    <Space>
                        <Button
                            icon={<FilterOutlined />}
                            onClick={() => setFilterDrawerVisible(true)}
                        >
                            Filters
                        </Button>

                        <Button
                            icon={<ReloadOutlined />}
                            onClick={() => {
                                resetFilters();
                            }}
                        >
                            Reset
                        </Button>

                        <Button type="primary" onClick={handleSearch}>
                            Search
                        </Button>
                    </Space>
                </div>
            </Card>

            {/* Products Table */}
            <Card>
                <Table
                    dataSource={products}
                    columns={columns}
                    rowKey="_id"
                    loading={loading}
                    pagination={{
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} products`,
                    }}
                />
            </Card>

            {/* Add/Edit Product Modal */}
            <Modal
                title={modalTitle}
                open={modalVisible}
                onCancel={() => {
                    setModalVisible(false);
                    setEditingProduct(null);
                    form.resetFields();
                }}
                footer={[
                    <Button
                        key="cancel"
                        onClick={() => {
                            setModalVisible(false);
                            setEditingProduct(null);
                            form.resetFields();
                        }}
                    >
                        Cancel
                    </Button>,
                    <Button
                        key="save"
                        type="primary"
                        loading={confirmLoading}
                        onClick={handleSave}
                    >
                        Save
                    </Button>,
                ]}
                width={700}
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        stock: 0,
                    }}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="product_name"
                                label="Product Name"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter product name",
                                    },
                                    {
                                        max: 50,
                                        message:
                                            "Maximum 50 characters allowed",
                                    },
                                ]}
                            >
                                <Input placeholder="Enter product name" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="product_code"
                                label="Product Code"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter product code",
                                    },
                                    {
                                        max: 5,
                                        message: "Maximum 5 characters allowed",
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="Enter product code"
                                    disabled={!!editingProduct}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="category_id"
                                label="Category"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please select a category",
                                    },
                                ]}
                            >
                                <Select placeholder="Select category">
                                    {categories.map((category) => (
                                        <Option
                                            key={category._id}
                                            value={category._id}
                                        >
                                            {category.category_name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="unit_id"
                                label="Unit"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please select a unit",
                                    },
                                ]}
                            >
                                <Select placeholder="Select unit">
                                    {units.map((unit) => (
                                        <Option key={unit._id} value={unit._id}>
                                            {unit.unit_name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="buying_price"
                                label="Buying Price"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter buying price",
                                    },
                                    {
                                        type: "number",
                                        min: 0,
                                        message: "Price must be positive",
                                    },
                                ]}
                            >
                                <InputNumber
                                    placeholder="0.00"
                                    prefix="$"
                                    style={{ width: "100%" }}
                                    precision={2}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="selling_price"
                                label="Selling Price"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter selling price",
                                    },
                                    {
                                        type: "number",
                                        min: 0,
                                        message: "Price must be positive",
                                    },
                                ]}
                            >
                                <InputNumber
                                    placeholder="0.00"
                                    prefix="$"
                                    style={{ width: "100%" }}
                                    precision={2}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="product_image"
                        label="Product Image"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => {
                            if (Array.isArray(e)) {
                                return e;
                            }
                            return e?.fileList;
                        }}
                    >
                        <Upload
                            listType="picture-card"
                            maxCount={1}
                            beforeUpload={() => false}
                            onChange={handleImageChange}
                            showUploadList={false}
                        >
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt="Product"
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                    }}
                                />
                            ) : (
                                <div>
                                    <UploadOutlined />
                                    <div className="mt-2">Upload</div>
                                </div>
                            )}
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Filter Drawer */}
            <Drawer
                title="Filter Products"
                placement="right"
                onClose={() => setFilterDrawerVisible(false)}
                open={filterDrawerVisible}
                width={300}
                footer={
                    <div className="flex justify-end">
                        <Button onClick={resetFilters} className="mr-2">
                            Reset
                        </Button>
                        <Button
                            type="primary"
                            onClick={() => {
                                setFilterDrawerVisible(false);
                                fetchProducts();
                            }}
                        >
                            Apply
                        </Button>
                    </div>
                }
            >
                <div className="space-y-6">
                    <div>
                        <Text strong>Category</Text>
                        <Select
                            style={{ width: "100%", marginTop: "8px" }}
                            placeholder="Filter by category"
                            allowClear
                            value={categoryFilter}
                            onChange={(value) => setCategoryFilter(value)}
                        >
                            {categories.map((cat) => (
                                <Option key={cat._id} value={cat._id}>
                                    {cat.category_name}
                                </Option>
                            ))}
                        </Select>
                    </div>

                    <Divider />

                    <div>
                        <Text strong>Stock Status</Text>
                        <Select
                            style={{ width: "100%", marginTop: "8px" }}
                            placeholder="Filter by stock status"
                            allowClear
                            value={stockFilter}
                            onChange={(value) => setStockFilter(value)}
                        >
                            <Option value="out">Out of Stock</Option>
                            <Option value="low">Low Stock</Option>
                            <Option value="in">In Stock</Option>
                        </Select>
                    </div>
                </div>
            </Drawer>

            {/* Product Details Drawer */}
            <Drawer
                title="Product Details"
                placement="right"
                onClose={() => setDetailDrawerVisible(false)}
                open={detailDrawerVisible}
                width={500}
                extra={
                    <Space>
                        <Button
                            icon={<EditOutlined />}
                            onClick={() => {
                                setDetailDrawerVisible(false);
                                handleEdit(selectedProduct);
                            }}
                        >
                            Edit
                        </Button>
                    </Space>
                }
            >
                {selectedProduct && (
                    <div className="space-y-6">
                        <div className="flex justify-center">
                            <Image
                                src={selectedProduct.product_image}
                                alt={selectedProduct.product_name}
                                width={200}
                                height={200}
                                style={{ objectFit: "cover" }}
                                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6U"
                            />
                        </div>

                        <Divider />

                        <div>
                            <Title level={4} className="mb-0">
                                {selectedProduct.product_name}
                            </Title>
                            <Tag color="blue">
                                {selectedProduct.product_code}
                            </Tag>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Text type="secondary">Category</Text>
                                <div>
                                    {selectedProduct.category_id.category_name}
                                </div>
                            </div>

                            <div>
                                <Text type="secondary">Unit</Text>
                                <div>{selectedProduct.unit_id.unit_name}</div>
                            </div>

                            <div>
                                <Text type="secondary">Buying Price</Text>
                                <div>
                                    ${selectedProduct.buying_price.toFixed(2)}
                                </div>
                            </div>

                            <div>
                                <Text type="secondary">Selling Price</Text>
                                <div>
                                    ${selectedProduct.selling_price.toFixed(2)}
                                </div>
                            </div>

                            <div>
                                <Text type="secondary">Stock</Text>
                                <div>
                                    <Badge
                                        status={
                                            selectedProduct.stock === 0
                                                ? "error"
                                                : selectedProduct.stock <= 10
                                                  ? "warning"
                                                  : "success"
                                        }
                                        text={
                                            selectedProduct.stock === 0
                                                ? "Out of Stock"
                                                : selectedProduct.stock <= 10
                                                  ? `Low Stock (${selectedProduct.stock})`
                                                  : `In Stock (${selectedProduct.stock})`
                                        }
                                    />
                                </div>
                            </div>

                            <div>
                                <Text type="secondary">Profit Margin</Text>
                                <div>
                                    {(
                                        ((selectedProduct.selling_price -
                                            selectedProduct.buying_price) /
                                            selectedProduct.buying_price) *
                                        100
                                    ).toFixed(2)}
                                    %
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Text type="secondary">Created At</Text>
                            <div>
                                {new Date(
                                    selectedProduct.createdAt
                                ).toLocaleDateString()}
                            </div>
                        </div>

                        <div className="mt-6">
                            <Text type="secondary">Last Updated</Text>
                            <div>
                                {new Date(
                                    selectedProduct.updatedAt
                                ).toLocaleDateString()}
                            </div>
                        </div>

                        <Divider />

                        <div className="flex justify-between">
                            <Button
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => {
                                    setDetailDrawerVisible(false);
                                    Modal.confirm({
                                        title: "Delete this product?",
                                        icon: <ExclamationCircleOutlined />,
                                        content:
                                            "This action cannot be undone. Are you sure?",
                                        okText: "Yes",
                                        okType: "danger",
                                        cancelText: "No",
                                        onOk: () => {
                                            handleDelete(selectedProduct._id);
                                        },
                                    });
                                }}
                            >
                                Delete
                            </Button>

                            <Button
                                type="primary"
                                onClick={() => {
                                    setDetailDrawerVisible(false);
                                }}
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                )}
            </Drawer>
        </div>
    );
};

export default Products;
