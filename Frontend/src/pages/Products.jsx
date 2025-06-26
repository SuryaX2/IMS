import React, { useState, useCallback } from "react";
import { Layout, Card, Button, Form, message } from "antd";
import { PlusOutlined, ProductOutlined } from "@ant-design/icons";

// Components
import ProductSearchBar from "../components/products/ProductSearchBar";
import ProductsTable from "../components/products/ProductsTable";
import ProductModal from "../components/products/ProductModal";
import ProductFilters from "../components/products/ProductFilters";
import ProductDetailsDrawer from "../components/products/ProductDetailsDrawer";

// Hooks
import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import { useUnits } from "../hooks/useUnits";

// Utils
import {
    prepareProductFormData,
    validateProductData,
} from "../utils/productUtils";

const { Content } = Layout;

const Products = () => {
    // Hooks
    const {
        products,
        loading,
        fetchProducts,
        createProduct,
        updateProduct,
        deleteProduct,
    } = useProducts();
    const { categories } = useCategories();
    const { units } = useUnits();

    // Form
    const [form] = Form.useForm();

    // State
    const [searchText, setSearchText] = useState("");
    const [categoryFilter, setCategoryFilter] = useState(null);
    const [stockFilter, setStockFilter] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isFiltersVisible, setIsFiltersVisible] = useState(false);
    const [isDetailsVisible, setIsDetailsVisible] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState("");

    // Handlers
    const handleSearch = useCallback(() => {
        const filters = {
            search: searchText,
            category: categoryFilter,
            stockFilter: stockFilter,
        };
        fetchProducts(filters);
    }, [searchText, categoryFilter, stockFilter, fetchProducts]);

    const handleReset = useCallback(() => {
        setSearchText("");
        setCategoryFilter(null);
        setStockFilter(null);
        fetchProducts();
    }, [fetchProducts]);

    const handleAddProduct = () => {
        setEditingProduct(null);
        setImageFile(null);
        setImageUrl("");
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setImageUrl(product.product_image || "");
        setImageFile(null);
        form.setFieldsValue({
            product_name: product.product_name,
            product_code: product.product_code,
            category_id: product.category_id._id,
            unit_id: product.unit_id._id,
            buying_price: product.buying_price,
            selling_price: product.selling_price,
        });
        setIsModalVisible(true);
    };

    const handleViewDetails = (product) => {
        setSelectedProduct(product);
        setIsDetailsVisible(true);
    };

    const handleImageChange = (info) => {
        const { fileList } = info;
        if (fileList.length > 0) {
            const file = fileList[0].originFileObj;
            setImageFile(file);

            // Create preview URL
            const reader = new FileReader();
            reader.onload = (e) => setImageUrl(e.target.result);
            reader.readAsDataURL(file);
        } else {
            setImageFile(null);
            setImageUrl(editingProduct?.product_image || "");
        }
    };

    const handleSaveProduct = async () => {
        try {
            const values = await form.validateFields();

            // Validate product data
            const validation = validateProductData(values);
            if (!validation.isValid) {
                Object.keys(validation.errors).forEach((key) => {
                    message.error(validation.errors[key]);
                });
                return;
            }

            setModalLoading(true);

            // Prepare form data
            const formData = prepareProductFormData(values, imageFile);

            let result;
            if (editingProduct) {
                result = await updateProduct(editingProduct._id, formData);
            } else {
                result = await createProduct(formData);
            }

            if (result.success) {
                setIsModalVisible(false);
                form.resetFields();
                setImageFile(null);
                setImageUrl("");
                setEditingProduct(null);
            }
        } catch (error) {
            console.error("Form validation error:", error);
            message.error("Please check all required fields");
        } finally {
            setModalLoading(false);
        }
    };

    const handleDeleteProduct = async (productId) => {
        const result = await deleteProduct(productId);
        if (!result.success) {
            message.error("Failed to delete product");
        }
    };

    const handleApplyFilters = () => {
        setIsFiltersVisible(false);
        handleSearch();
    };

    const handleResetFilters = () => {
        setCategoryFilter(null);
        setStockFilter(null);
        setIsFiltersVisible(false);
        handleReset();
    };

    return (
        <Layout>
            <Content className="p-2 sm:p-4 lg:p-6 bg-white">
                <div className="max-w-full lg:max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-4">
                        <div className="flex-1 min-w-0">
                            <h1 className="truncate mb-1 text-4xl font-bold flex items-center gap-2">
                                Products
                                <ProductOutlined className="text-blue-600 inline-block ml-2" />
                            </h1>
                            <p className="text-gray-500 text-base md:text-sm  hidden sm:block">
                                Manage your product inventory
                            </p>
                        </div>
                        <div className="flex-shrink-0">
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={handleAddProduct}
                                size="large"
                                className="w-full sm:w-auto"
                                block={window.innerWidth < 640}
                            >
                                <span className="hidden xs:inline">
                                    Add Product
                                </span>
                                <span className="inline xs:hidden">Add</span>
                            </Button>
                        </div>
                    </div>

                    {/* Search Bar - Responsive */}
                    <div className="mb-4 sm:mb-6">
                        <ProductSearchBar
                            searchText={searchText}
                            onSearchChange={setSearchText}
                            onSearch={handleSearch}
                            onShowFilters={() => setIsFiltersVisible(true)}
                            onReset={handleReset}
                        />
                    </div>

                    {/* Products Table - Responsive Card */}
                    <Card
                        className="overflow-hidden"
                        bodyStyle={{
                            padding: window.innerWidth < 768 ? "12px" : "24px",
                            overflowX: "auto",
                        }}
                    >
                        <div className="min-w-full">
                            <ProductsTable
                                products={products}
                                loading={loading}
                                categories={categories}
                                onEdit={handleEditProduct}
                                onDelete={handleDeleteProduct}
                                onViewDetails={handleViewDetails}
                            />
                        </div>
                    </Card>

                    {/* Product Modal - Responsive */}
                    <ProductModal
                        visible={isModalVisible}
                        title={
                            editingProduct ? "Edit Product" : "Add New Product"
                        }
                        form={form}
                        loading={modalLoading}
                        categories={categories}
                        units={units}
                        editingProduct={editingProduct}
                        imageUrl={imageUrl}
                        onSave={handleSaveProduct}
                        onCancel={() => {
                            setIsModalVisible(false);
                            setEditingProduct(null);
                            setImageFile(null);
                            setImageUrl("");
                            form.resetFields();
                        }}
                        onImageChange={handleImageChange}
                        width={window.innerWidth < 768 ? "95%" : "800px"}
                        centered={window.innerWidth < 768}
                    />

                    {/* Filters Drawer - Already responsive as it's a drawer */}
                    <ProductFilters
                        visible={isFiltersVisible}
                        categories={categories}
                        categoryFilter={categoryFilter}
                        stockFilter={stockFilter}
                        onCategoryChange={setCategoryFilter}
                        onStockChange={setStockFilter}
                        onApply={handleApplyFilters}
                        onReset={handleResetFilters}
                        onClose={() => setIsFiltersVisible(false)}
                        placement={window.innerWidth < 768 ? "bottom" : "right"}
                        height={window.innerWidth < 768 ? "70vh" : undefined}
                        width={window.innerWidth < 768 ? "100%" : "400px"}
                    />

                    {/* Product Details Drawer - Responsive */}
                    <ProductDetailsDrawer
                        visible={isDetailsVisible}
                        product={selectedProduct}
                        onClose={() => {
                            setIsDetailsVisible(false);
                            setSelectedProduct(null);
                        }}
                        placement={window.innerWidth < 768 ? "bottom" : "right"}
                        height={window.innerWidth < 768 ? "80vh" : undefined}
                        width={window.innerWidth < 768 ? "100%" : "500px"}
                    />
                </div>
            </Content>
        </Layout>
    );
};

export default Products;
