import React, { useState } from "react";
import { Card, Space, Button, Tooltip, Badge, Form } from "antd";
import { TagsOutlined, ReloadOutlined, PlusOutlined } from "@ant-design/icons";
import CategoryTable from "./CategoryTable";
import CategoryModal from "./CategoryModal";
import CategoryViewModal from "./CategoryViewModal";
import SearchFilter from "../shared/SearchFilter";
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
        <>
            <Card
                title={
                    <div className="flex items-center space-x-2">
                        <TagsOutlined className="text-blue-500" />
                        <span>Categories</span>
                        <Badge count={categories.length} showZero />
                    </div>
                }
                extra={
                    <Space>
                        <Tooltip title="Refresh">
                            <Button
                                icon={<ReloadOutlined />}
                                onClick={loadCategories}
                                loading={loading}
                            />
                        </Tooltip>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => openModal()}
                        >
                            Add Category
                        </Button>
                    </Space>
                }
            >
                <SearchFilter
                    searchText={searchText}
                    setSearchText={setSearchText}
                    filter={filter}
                    setFilter={setFilter}
                    onClear={clearFilters}
                    placeholder="Search categories..."
                    isAdmin={isAdmin}
                />

                <CategoryTable
                    categories={categories}
                    loading={loading}
                    user={user}
                    isAdmin={isAdmin}
                    onEdit={handleEdit}
                    onView={handleView}
                    onDelete={deleteCategory}
                />
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
        </>
    );
};

export default CategorySection;
