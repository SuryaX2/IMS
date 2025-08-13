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
                className="h-full border-0 shadow-none"
                title={
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <AppstoreOutlined className="text-green-600 text-lg" />
                            </div>
                            <div>
                                <span className="text-lg font-semibold text-gray-800">
                                    Units
                                </span>
                                <Badge
                                    count={units.length}
                                    showZero
                                    className="ml-2"
                                    style={{ backgroundColor: "#52c41a" }}
                                />
                            </div>
                        </div>
                    </div>
                }
                extra={
                    <Space size="small">
                        <Tooltip title="Refresh Units">
                            <Button
                                icon={<ReloadOutlined />}
                                onClick={loadUnits}
                                loading={loading}
                                className="border-gray-300 hover:border-green-400 hover:text-green-600"
                                size="small"
                            />
                        </Tooltip>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => openModal()}
                            className="bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700 shadow-sm"
                            size="small"
                        >
                            <span className="hidden sm:inline">Add Unit</span>
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
                            placeholder="Search units..."
                            isAdmin={isAdmin}
                        />
                    </div>

                    <div className="bg-white rounded-lg border border-gray-100">
                        <UnitTable
                            units={units}
                            loading={loading}
                            user={user}
                            isAdmin={isAdmin}
                            onEdit={handleEdit}
                            onView={handleView}
                            onDelete={deleteUnit}
                        />
                    </div>
                </div>
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
