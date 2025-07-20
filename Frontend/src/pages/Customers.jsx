import React, { useState, useEffect } from "react";
import { Button, Input, Card, Form } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { toast } from "react-hot-toast";
import { api } from "../api/api";
import {
    CustomerStats,
    CustomerTable,
    CustomerModal,
    CustomerViewModal,
} from "../components/customers";

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [viewingCustomer, setViewingCustomer] = useState(null);
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState("");
    const [fileList, setFileList] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        regular: 0,
        wholesale: 0,
        retail: 0,
    });

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const response = await api.get("/customers");
            if (response.data.success) {
                setCustomers(response.data.data);
                calculateStats(response.data.data);
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to fetch customers"
            );
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (data) => {
        const total = data.length;
        const regular = data.filter((c) => c.type === "regular").length;
        const wholesale = data.filter((c) => c.type === "wholesale").length;
        const retail = data.filter((c) => c.type === "retail").length;
        setStats({ total, regular, wholesale, retail });
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const formData = new FormData();
            Object.keys(values).forEach((key) => {
                if (values[key] !== undefined && values[key] !== null) {
                    formData.append(key, values[key]);
                }
            });

            if (fileList.length > 0 && fileList[0].originFileObj) {
                formData.append("photo", fileList[0].originFileObj);
            }

            const config = {
                headers: { "Content-Type": "multipart/form-data" },
            };
            const response = editingCustomer
                ? await api.patch(
                      `/customers/${editingCustomer._id}`,
                      formData,
                      config
                  )
                : await api.post("/customers", formData, config);

            if (response.data.success) {
                toast.success(response.data.message);
                fetchCustomers();
                handleCancel();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation failed");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (customer) => {
        setEditingCustomer(customer);
        form.setFieldsValue({ ...customer });

        if (customer.photo && customer.photo !== "default-customer.png") {
            setFileList([
                {
                    uid: "-1",
                    name: "current-photo.jpg",
                    status: "done",
                    url: customer.photo,
                },
            ]);
        }
        setModalVisible(true);
    };

    const handleView = (customer) => {
        setViewingCustomer(customer);
        setViewModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            const response = await api.delete(`/customers/${id}`);
            if (response.data.success) {
                toast.success("Customer deleted successfully");
                fetchCustomers();
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to delete customer"
            );
        }
    };

    const handleCancel = () => {
        setModalVisible(false);
        setEditingCustomer(null);
        form.resetFields();
        setFileList([]);
    };

    const filteredCustomers = customers.filter(
        (customer) =>
            customer.name.toLowerCase().includes(searchText.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchText.toLowerCase()) ||
            customer.phone.includes(searchText)
    );

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                    Customer Management
                </h1>

                <CustomerStats stats={stats} />

                <div className="flex justify-between items-center">
                    <Input
                        placeholder="Search customers..."
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: 300 }}
                    />
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setModalVisible(true)}
                    >
                        Add Customer
                    </Button>
                </div>
            </div>

            <Card>
                <CustomerTable
                    customers={filteredCustomers}
                    loading={loading}
                    onEdit={handleEdit}
                    onView={handleView}
                    onDelete={handleDelete}
                />
            </Card>

            <CustomerViewModal
                visible={viewModalVisible}
                onCancel={() => setViewModalVisible(false)}
                customer={viewingCustomer}
                onEdit={handleEdit}
            />

            <CustomerModal
                visible={modalVisible}
                onCancel={handleCancel}
                form={form}
                onSubmit={handleSubmit}
                loading={loading}
                fileList={fileList}
                setFileList={setFileList}
                editingCustomer={editingCustomer}
            />
        </div>
    );
};

export default Customers;
