import React, { useState } from "react";
import { PlusOutlined, UserOutlined } from "@ant-design/icons";
import PageHeader from "../components/common/PageHeader";
import SupplierStats from "../components/suppliers/SupplierStats";
import SupplierFilters from "../components/suppliers/SupplierFilters";
import SupplierTable from "../components/suppliers/SupplierTable";
import SupplierForm from "../components/suppliers/SupplierForm";
import SupplierViewModal from "../components/suppliers/SupplierViewModal";
import { useSuppliers } from "../hooks/useSuppliers";
import { useSupplierForm } from "../hooks/useSupplierForm";
import { filterSuppliers } from "../utils/supplierUtils";

const Suppliers = () => {
    // State for search and filtering
    const [searchText, setSearchText] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);

    // Custom hooks
    const {
        suppliers,
        loading,
        stats,
        createSupplier,
        updateSupplier,
        deleteSupplier,
    } = useSuppliers();

    const {
        modalVisible,
        editMode,
        form,
        fileList,
        uploadProps,
        openCreateModal,
        openEditModal,
        closeModal,
        handleSubmit,
    } = useSupplierForm();

    // Filter suppliers based on search and filter criteria
    const filteredSuppliers = filterSuppliers(
        suppliers,
        searchText,
        filterType
    );

    // Handle form submission
    const onSubmit = async (values) => {
        await handleSubmit(values, createSupplier, updateSupplier);
    };

    // Handle view supplier
    const handleView = (supplier) => {
        setSelectedSupplier(supplier);
        setViewModalVisible(true);
    };

    // Handle edit supplier
    const handleEdit = (supplier) => {
        openEditModal(supplier);
    };

    // Handle delete supplier
    const handleDelete = (id) => {
        deleteSupplier(id);
    };

    // Close view modal
    const closeViewModal = () => {
        setViewModalVisible(false);
        setSelectedSupplier(null);
    };

    return (
        <div className="p-6">
            {/* Page Header */}
            <PageHeader
                title="Suppliers"
                subtitle="Manage your suppliers and their information"
                icon={<UserOutlined />}
                actionText="Add Supplier"
                actionIcon={<PlusOutlined />}
                onActionClick={openCreateModal}
            />

            {/* Statistics Cards */}
            <SupplierStats stats={stats} />

            {/* Search and Filter */}
            <SupplierFilters
                searchText={searchText}
                setSearchText={setSearchText}
                filterType={filterType}
                setFilterType={setFilterType}
            />

            {/* Suppliers Table */}
            <SupplierTable
                suppliers={filteredSuppliers}
                loading={loading}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {/* Add/Edit Modal */}
            <SupplierForm
                visible={modalVisible}
                onCancel={closeModal}
                onSubmit={onSubmit}
                form={form}
                editMode={editMode}
                fileList={fileList}
                uploadProps={uploadProps}
            />

            {/* View Modal */}
            <SupplierViewModal
                visible={viewModalVisible}
                onCancel={closeViewModal}
                supplier={selectedSupplier}
                onEdit={handleEdit}
            />
        </div>
    );
};

export default Suppliers;
