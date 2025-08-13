import React, { useState } from "react";
import { Card, Space, Button, Tooltip, Badge, Form } from "antd";
import {
    AppstoreOutlined,
    ReloadOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import UnitTable from "./UnitTable";
import UnitModal from "./UnitModal";
import UnitViewModal from "./UnitViewModal";
import SearchFilter from "../common/SearchFilter";
import { useUnits } from "../../hooks/categories_units/useUnits";

const UnitSection = ({ user, isAdmin }) => {
    const {
        units,
        loading,
        searchText,
        setSearchText,
        filter,
        setFilter,
        loadUnits,
        createUnit,
        updateUnit,
        deleteUnit,
        clearFilters,
    } = useUnits();

    const [modalVisible, setModalVisible] = useState(false);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [editingUnit, setEditingUnit] = useState(null);
    const [viewingUnit, setViewingUnit] = useState(null);
    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        const result = editingUnit
            ? await updateUnit(editingUnit._id, values)
            : await createUnit(values);

        if (result?.success) {
            setModalVisible(false);
            form.resetFields();
            setEditingUnit(null);
        }
    };

    const handleEdit = (unit) => {
        setEditingUnit(unit);
        setModalVisible(true);
    };

    const handleView = (unit) => {
        setViewingUnit(unit);
        setViewModalVisible(true);
    };

    const openModal = (unit = null) => {
        setEditingUnit(unit);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        form.resetFields();
        setEditingUnit(null);
    };

    return (
        <>
            <Card
                title={
                    <div className="flex items-center space-x-2">
                        <AppstoreOutlined className="text-green-500" />
                        <span>Units</span>
                        <Badge count={units.length} showZero />
                    </div>
                }
                extra={
                    <Space>
                        <Tooltip title="Refresh">
                            <Button
                                icon={<ReloadOutlined />}
                                onClick={loadUnits}
                                loading={loading}
                            />
                        </Tooltip>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => openModal()}
                        >
                            Add Unit
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
                    placeholder="Search units..."
                    isAdmin={isAdmin}
                />

                <UnitTable
                    units={units}
                    loading={loading}
                    user={user}
                    isAdmin={isAdmin}
                    onEdit={handleEdit}
                    onView={handleView}
                    onDelete={deleteUnit}
                />
            </Card>

            <UnitModal
                visible={modalVisible}
                onClose={closeModal}
                onSubmit={handleSubmit}
                editingUnit={editingUnit}
                form={form}
            />

            <UnitViewModal
                visible={viewModalVisible}
                onClose={() => setViewModalVisible(false)}
                unit={viewingUnit}
                user={user}
                isAdmin={isAdmin}
                onEdit={handleEdit}
            />
        </>
    );
};

export default UnitSection;
