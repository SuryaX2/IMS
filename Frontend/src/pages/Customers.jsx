import React, { useState, useEffect, useCallback } from "react";
import { Button, Input, Card, Form } from "antd";
import { PlusOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";
import { toast } from "react-hot-toast";
import { api } from "../api/api";
import {
    CustomerStats,
    CustomerTable,
    CustomerModal,
    CustomerViewModal,
} from "../components/customers";

const Customers = () => {
    // State management
    const [state, setState] = useState({
        customers: [],
        loading: false,
        modalVisible: false,
        viewModalVisible: false,
        searchText: "",
        stats: { total: 0, regular: 0, wholesale: 0, retail: 0 },
    });

    const [editing, setEditing] = useState({
        customer: null,
        fileList: [],
    });

    const [viewing, setViewing] = useState({
        customer: null,
    });

    const [form] = Form.useForm();

    // Initialize component
    useEffect(() => {
        fetchCustomers();
    }, []);

    // Utility functions
    const updateState = (updates) => {
        setState((prev) => ({ ...prev, ...updates }));
    };

    const calculateStats = useCallback((data) => {
        const total = data.length;
        const regular = data.filter((c) => c.type === "regular").length;
        const wholesale = data.filter((c) => c.type === "wholesale").length;
        const retail = data.filter((c) => c.type === "retail").length;
        return { total, regular, wholesale, retail };
    }, []);

    const getFilteredCustomers = useCallback(() => {
        const { customers, searchText } = state;
        if (!searchText) return customers;

        return customers.filter((customer) => {
            const searchLower = searchText.toLowerCase();
            return (
                customer.name.toLowerCase().includes(searchLower) ||
                customer.email.toLowerCase().includes(searchLower) ||
                customer.phone.includes(searchText) ||
                (customer.store_name &&
                    customer.store_name.toLowerCase().includes(searchLower))
            );
        });
    }, [state.customers, state.searchText]);

    // API functions
    const fetchCustomers = async () => {
        updateState({ loading: true });
        try {
            const response = await api.get("/customers");
            if (response.data.success) {
                const customers = response.data.data;
                const stats = calculateStats(customers);
                updateState({ customers, stats });
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to fetch customers"
            );
        } finally {
            updateState({ loading: false });
        }
    };

    const handleSubmit = async (values) => {
        updateState({ loading: true });
        try {
            const formData = createFormData(values);
            const response = await submitCustomerData(formData);

            if (response.data.success) {
                toast.success(response.data.message);
                await fetchCustomers();
                handleCancel();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation failed");
        } finally {
            updateState({ loading: false });
        }
    };

    const createFormData = (values) => {
        const formData = new FormData();

        Object.keys(values).forEach((key) => {
            if (
                values[key] !== undefined &&
                values[key] !== null &&
                values[key] !== ""
            ) {
                formData.append(key, values[key]);
            }
        });

        if (editing.fileList.length > 0 && editing.fileList[0].originFileObj) {
            formData.append("photo", editing.fileList[0].originFileObj);
        }

        return formData;
    };

    const submitCustomerData = (formData) => {
        const config = { headers: { "Content-Type": "multipart/form-data" } };

        return editing.customer
            ? api.patch(`/customers/${editing.customer._id}`, formData, config)
            : api.post("/customers", formData, config);
    };

    const handleDelete = async (id) => {
        try {
            const response = await api.delete(`/customers/${id}`);
            if (response.data.success) {
                toast.success("Customer deleted successfully");
                await fetchCustomers();
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to delete customer"
            );
        }
    };

    // Modal handlers
    const handleEdit = (customer) => {
        setEditing({ customer, fileList: getExistingFileList(customer) });
        form.setFieldsValue({ ...customer });
        updateState({ modalVisible: true });
    };

    const getExistingFileList = (customer) => {
        if (customer.photo && customer.photo !== "default-customer.png") {
            return [
                {
                    uid: "-1",
                    name: "current-photo.jpg",
                    status: "done",
                    url: customer.photo,
                },
            ];
        }
        return [];
    };

    const handleView = (customer) => {
        setViewing({ customer });
        updateState({ viewModalVisible: true });
    };

    const handleCancel = () => {
        updateState({ modalVisible: false });
        setEditing({ customer: null, fileList: [] });
        form.resetFields();
    };

    const handleViewCancel = () => {
        updateState({ viewModalVisible: false });
        setViewing({ customer: null });
    };

    const handleSearch = (e) => {
        updateState({ searchText: e.target.value });
    };

    const openAddModal = () => {
        updateState({ modalVisible: true });
    };

    const handleFileListChange = (newFileList) => {
        setEditing((prev) => ({ ...prev, fileList: newFileList }));
    };

    // Component render
    const filteredCustomers = getFilteredCustomers();

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-4">
                <div className="flex-1 min-w-0">
                    <h1 className="truncate mb-1 text-4xl font-bold flex items-center gap-2">
                        Customers
                        <UserOutlined className="text-blue-600 inline-block ml-2" />
                    </h1>
                    <p className="text-gray-500 text-base md:text-sm  hidden sm:block">
                        Manage your customers, view their details
                    </p>
                </div>
            </div>
            
            <CustomerStats stats={state.stats} />

            {/* Search and Add Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
                <Input
                    placeholder="Search customers by name, email, phone, or store..."
                    prefix={<SearchOutlined className="text-gray-400" />}
                    value={state.searchText}
                    onChange={handleSearch}
                    className="max-w-md"
                    size="large"
                    allowClear
                />
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={openAddModal}
                    size="large"
                    className="min-w-40"
                >
                    Add Customer
                </Button>
            </div>

            {/* Results Summary */}
            {state.searchText && (
                <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                    Found {filteredCustomers.length} customer
                    {filteredCustomers.length !== 1 ? "s" : ""}
                    {state.searchText && ` matching "${state.searchText}"`}
                </div>
            )}

            {/* Customer Table */}
            <Card className="shadow-sm">
                <CustomerTable
                    customers={filteredCustomers}
                    loading={state.loading}
                    onEdit={handleEdit}
                    onView={handleView}
                    onDelete={handleDelete}
                />
            </Card>

            {/* Modals */}
            <CustomerViewModal
                visible={state.viewModalVisible}
                onCancel={handleViewCancel}
                customer={viewing.customer}
                onEdit={handleEdit}
            />

            <CustomerModal
                visible={state.modalVisible}
                onCancel={handleCancel}
                form={form}
                onSubmit={handleSubmit}
                loading={state.loading}
                fileList={editing.fileList}
                setFileList={handleFileListChange}
                editingCustomer={editing.customer}
            />
        </div>
    );
};

export default Customers;
