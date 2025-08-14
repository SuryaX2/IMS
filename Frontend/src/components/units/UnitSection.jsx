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
        <div className="w-full">
            <Card
                className="shadow-sm border-0"
                style={{
                    borderRadius: "12px",
                    background: "#ffffff",
                }}
                title={
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                            <AppstoreOutlined className="text-green-600 text-sm" />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-900 font-semibold text-base sm:text-lg">
                                Units
                            </span>
                            <Badge
                                count={units.length}
                                showZero
                                style={{
                                    backgroundColor: "#f0fdf4",
                                    color: "#166534",
                                    border: "1px solid #dcfce7",
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
                                onClick={loadUnits}
                                loading={loading}
                                className="border-gray-200 hover:border-green-400 hover:text-green-600 mt-2 lg:mt-0"
                                style={{ height: "36px" }}
                            >
                                Refresh
                            </Button>
                        </Tooltip>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => openModal()}
                            className="bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700"
                            style={{
                                height: "36px",
                                borderRadius: "8px",
                                fontWeight: 500,
                            }}
                        >
                            <span className="hidden sm:inline">Add Unit</span>
                            <span className="sm:hidden">Add</span>
                        </Button>
                    </div>
                }
                bodyStyle={{ padding: "20px 24px" }}
            >
                <div className="space-y-4">
                    <SearchFilter
                        searchText={searchText}
                        setSearchText={setSearchText}
                        filter={filter}
                        setFilter={setFilter}
                        onClear={clearFilters}
                        placeholder="Search units..."
                        isAdmin={isAdmin}
                    />

                    <div className="overflow-x-auto">
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
        </div>
    );
};

export default UnitSection;
