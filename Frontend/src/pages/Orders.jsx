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
import { useOrders } from "../hooks/useOrders";
import { useOrderOperations } from "../hooks/useOrderOperations";

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
        <div className="min-h-screen bg-gray-50">
            {/* Container with responsive padding */}
            <div className="px-3 py-4 sm:px-4 sm:py-6 lg:px-6 lg:py-8 max-w-full">
                {/* Page Header */}
                <div className="mb-4 sm:mb-6">
                    <PageHeader
                        title="Orders"
                        subtitle="Manage and track your orders"
                        icon={
                            <ShoppingCartOutlined className="text-blue-600 inline-block ml-2" />
                        }
                        actionText={
                            <>
                                <span className="hidden xs:inline">
                                    Create Order
                                </span>
                                <span className="xs:hidden">Create</span>
                            </>
                        }
                        actionIcon={<PlusOutlined />}
                        onActionClick={() => setCreateModalVisible(true)}
                    />
                </div>

                {/* Stats Cards with responsive spacing */}
                <div className="mb-4 sm:mb-6">
                    <OrderStats stats={stats} />
                </div>

                {/* Filters with responsive spacing */}
                <div className="mb-4 sm:mb-6">
                    <OrderFilters
                        filters={filters}
                        customers={customers}
                        onFilterChange={handleFilterChange}
                        onApplyFilters={handleApplyFilters}
                        onResetFilters={handleResetFilters}
                    />
                </div>

                {/* Orders Table with responsive container */}
                <div className="w-full overflow-hidden">
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
