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
        <>
            <Card
                className="h-full border-0 shadow-none"
                title={
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <TagsOutlined className="text-blue-600 text-lg" />
                            </div>
                            <div>
                                <span className="text-lg font-semibold text-gray-800">
                                    Categories
                                </span>
                                <Badge
                                    count={categories.length}
                                    showZero
                                    className="ml-2"
                                    style={{ backgroundColor: "#1890ff" }}
                                />
                            </div>
                        </div>
                    </div>
                }
                extra={
                    <Space size="small">
                        <Tooltip title="Refresh Categories">
                            <Button
                                icon={<ReloadOutlined />}
                                onClick={loadCategories}
                                loading={loading}
                                className="border-gray-300 hover:border-blue-400 hover:text-blue-600"
                                size="small"
                            />
                        </Tooltip>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => openModal()}
                            className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 shadow-sm"
                            size="small"
                        >
                            <span className="hidden sm:inline">
                                Add Category
                            </span>
                            <span className="sm:hidden">Add</span>
                        </Button>
                    </Space>
                }
                bodyStyle={{ padding: "20px" }}
            >
                <div className="space-y-4">
                    <div className="bg-gray-50/50 p-4 rounded-lg border">
                        <SearchFilter
                            searchText={searchText}
                            setSearchText={setSearchText}
                            filter={filter}
                            setFilter={setFilter}
                            onClear={clearFilters}
                            placeholder="Search categories..."
                            isAdmin={isAdmin}
                        />
                    </div>

                    <div className="bg-white rounded-lg border border-gray-100">
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
        </>
    );
};

export default CategorySection;
