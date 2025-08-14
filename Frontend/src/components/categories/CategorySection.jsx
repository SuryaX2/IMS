import React, { useState } from "react";
import { Card, Space, Button, Tooltip, Badge, Form } from "antd";
import { TagsOutlined, ReloadOutlined, PlusOutlined } from "@ant-design/icons";
import CategoryTable from "./CategoryTable";
import CategoryModal from "./CategoryModal";
import CategoryViewModal from "./CategoryViewModal";
import SearchFilter from "../common/SearchFilter";
import { useCategories } from "../../hooks/categories_units/useCategories";

const CategorySection = ({ user, isAdmin }) => {
    const {
        categories,
        loading,
        searchText,
        setSearchText,
        filter,
        setFilter,
        loadCategories,
        createCategory,
        updateCategory,
        deleteCategory,
        clearFilters,
    } = useCategories();

    const [modalVisible, setModalVisible] = useState(false);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [viewingCategory, setViewingCategory] = useState(null);
    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        const result = editingCategory
            ? await updateCategory(editingCategory._id, values)
            : await createCategory(values);

        if (result?.success) {
            setModalVisible(false);
            form.resetFields();
            setEditingCategory(null);
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setModalVisible(true);
    };

    const handleView = (category) => {
        setViewingCategory(category);
        setViewModalVisible(true);
    };

    const openModal = (category = null) => {
        setEditingCategory(category);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        form.resetFields();
        setEditingCategory(null);
    };

    return (
        <div className="w-full">
            <Card
                className="shadow-sm border-0"
                style={{ 
                    borderRadius: '12px',
                    background: '#ffffff'
                }}
                title={
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                            <TagsOutlined className="text-blue-600 text-sm" />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-900 font-semibold text-base sm:text-lg">
                                Categories
                            </span>
                            <Badge 
                                count={categories.length} 
                                showZero 
                                style={{ 
                                    backgroundColor: '#f0f9ff',
                                    color: '#1e40af',
                                    border: '1px solid #dbeafe'
                                }}
                            />
                        </div>
                    </div>
                }
                extra={
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Tooltip title="Refresh">
                            <Button
                                icon={<ReloadOutlined />}
                                onClick={loadCategories}
                                loading={loading}
                                className="border-gray-200 hover:border-blue-400 hover:text-blue-600 mt-2 lg:mt-0"
                                style={{ height: '36px' }}
                            >
                                Refresh
                            </Button>
                        </Tooltip>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => openModal()}
                            className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700"
                            style={{ 
                                height: '36px',
                                borderRadius: '8px',
                                fontWeight: 500
                            }}
                        >
                            <span className="hidden sm:inline">Add Category</span>
                            <span className="sm:hidden">Add</span>
                        </Button>
                    </div>
                }
                bodyStyle={{ padding: '20px 24px' }}
            >
                <div className="space-y-4">
                    <SearchFilter
                        searchText={searchText}
                        setSearchText={setSearchText}
                        filter={filter}
                        setFilter={setFilter}
                        onClear={clearFilters}
                        placeholder="Search categories..."
                        isAdmin={isAdmin}
                    />

                    <div className="overflow-x-auto">
                        <CategoryTable
                            categories={categories}
                            loading={loading}
                            user={user}
                            isAdmin={isAdmin}
                            onEdit={handleEdit}
                            onView={handleView}
                            onDelete={deleteCategory}
                        />
                    </div>
                </div>
            </Card>

            <CategoryModal
                visible={modalVisible}
                onClose={closeModal}
                onSubmit={handleSubmit}
                editingCategory={editingCategory}
                form={form}
            />

            <CategoryViewModal
                visible={viewModalVisible}
                onClose={() => setViewModalVisible(false)}
                category={viewingCategory}
                user={user}
                isAdmin={isAdmin}
                onEdit={handleEdit}
            />
        </div>
    );
};

export default CategorySection;