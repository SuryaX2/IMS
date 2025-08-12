import React, { useState } from "react";
import { Form } from "antd";
import { PlusOutlined, ShoppingCartOutlined } from "@ant-design/icons";

// Components
import PageHeader from "../components/common/PageHeader";
import OrderStats from "../components/orders/OrderStats";
import OrderFilters from "../components/orders/OrderFilters";
import OrdersTable from "../components/orders/OrdersTable";
import CreateOrderModal from "../components/orders/CreateOrderModal";
import OrderDetailsDrawer from "../components/orders/OrderDetailsDrawer";

// Hooks
import { useOrders } from "../hooks/orders/useOrders";
import { useOrderOperations } from "../hooks/orders/useOrderOperations";

const Orders = () => {
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [createForm] = Form.useForm();

    // Main orders hook
    const {
        orders,
        customers,
        products,
        loading,
        pagination,
        filters,
        stats,
        setFilters,
        fetchOrders,
    } = useOrders();

    // Order operations hook
    const {
        orderDetails,
        detailsLoading,
        updateOrderStatus,
        generateInvoice,
        createOrder,
        fetchOrderDetails,
    } = useOrderOperations(() =>
        fetchOrders(pagination.current, pagination.pageSize)
    );

    // Event handlers
    const handleTableChange = (paginationInfo) => {
        fetchOrders(paginationInfo.current, paginationInfo.pageSize);
    };

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
    };

    const handleApplyFilters = () => {
        fetchOrders(1, pagination.pageSize, filters);
    };

    const handleResetFilters = () => {
        const resetFilters = {
            search: "",
            customer_id: "",
            order_status: "",
            date_range: null,
            total_range: { min: "", max: "" },
        };
        setFilters(resetFilters);
        fetchOrders(1, pagination.pageSize, resetFilters);
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setDetailsDrawerVisible(true);
        fetchOrderDetails(order._id);
    };

    const handleCreateOrder = async (values) => {
        const success = await createOrder(values);
        if (success) {
            setCreateModalVisible(false);
            createForm.resetFields();
        }
    };

    const handleCreateModalCancel = () => {
        setCreateModalVisible(false);
        createForm.resetFields();
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Main Container */}
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="mb-8">
                    <PageHeader
                        title="Orders"
                        subtitle="Manage and track your orders"
                        icon={
                            <ShoppingCartOutlined className="text-blue-600" />
                        }
                        actionText="Create Order"
                        actionIcon={<PlusOutlined />}
                        onActionClick={() => setCreateModalVisible(true)}
                    />
                </div>

                {/* Stats Section */}
                <div className="mb-8">
                    <OrderStats stats={stats} />
                </div>

                {/* Filters Section */}
                <div className="mb-6">
                    <OrderFilters
                        filters={filters}
                        customers={customers}
                        onFilterChange={handleFilterChange}
                        onApplyFilters={handleApplyFilters}
                        onResetFilters={handleResetFilters}
                    />
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <OrdersTable
                        orders={orders}
                        loading={loading}
                        pagination={pagination}
                        onTableChange={handleTableChange}
                        onViewDetails={handleViewDetails}
                        onUpdateStatus={updateOrderStatus}
                        onGenerateInvoice={generateInvoice}
                    />
                </div>

                {/* Create Order Modal */}
                <CreateOrderModal
                    visible={createModalVisible}
                    onCancel={handleCreateModalCancel}
                    onSubmit={handleCreateOrder}
                    customers={customers}
                    products={products}
                    form={createForm}
                />

                {/* Order Details Drawer */}
                <OrderDetailsDrawer
                    visible={detailsDrawerVisible}
                    onClose={() => setDetailsDrawerVisible(false)}
                    selectedOrder={selectedOrder}
                    orderDetails={orderDetails}
                    detailsLoading={detailsLoading}
                    onGenerateInvoice={generateInvoice}
                />
            </div>
        </div>
    );
};

export default Orders;
