import React, { useState, useCallback } from "react";
import { Layout, Card, Button, Form, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";

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
            <Content className="p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold">Products</h1>
                            <p className="text-gray-600">
                                Manage your product inventory
                            </p>
                        </div>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={handleAddProduct}
                            size="large"
                        >
                            Add Product
                        </Button>
                    </div>

                    {/* Search Bar */}
                    <ProductSearchBar
                        searchText={searchText}
                        onSearchChange={setSearchText}
                        onSearch={handleSearch}
                        onShowFilters={() => setIsFiltersVisible(true)}
                        onReset={handleReset}
                    />

                    {/* Products Table */}
                    <Card>
                        <ProductsTable
                            products={products}
                            loading={loading}
                            categories={categories}
                            onEdit={handleEditProduct}
                            onDelete={handleDeleteProduct}
                            onViewDetails={handleViewDetails}
                        />
                    </Card>

                    {/* Product Modal */}
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
                    />

                    {/* Filters Drawer */}
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
                    />

                    {/* Product Details Drawer */}
                    <ProductDetailsDrawer
                        visible={isDetailsVisible}
                        product={selectedProduct}
                        onClose={() => {
                            setIsDetailsVisible(false);
                            setSelectedProduct(null);
                        }}
                    />
                </div>
            </Content>
        </Layout>
    );
};

export default Products;
