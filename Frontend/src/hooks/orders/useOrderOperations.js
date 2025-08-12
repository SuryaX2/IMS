import { useState } from "react";
import { toast } from "react-hot-toast";
import { api } from "../../api/api";
import { calculateOrderTotals } from "../../utils/orderHelpers";

export const useOrderOperations = (refreshOrders) => {
    const [orderDetails, setOrderDetails] = useState([]);
    const [detailsLoading, setDetailsLoading] = useState(false);

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await api.patch(`/orders/${orderId}/status`, {
                order_status: newStatus,
            });
            toast.success("Order status updated successfully");
            refreshOrders();
        } catch (error) {
            toast.error("Failed to update order status");
            console.error("Error updating order status:", error);
        }
    };

    const generateInvoice = async (orderId, invoiceNo) => {
        try {
            const response = await api.get(`/orders/${orderId}/invoice`, {
                responseType: "blob",
            });

            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `invoice-${invoiceNo}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success("Invoice downloaded successfully");
        } catch (error) {
            toast.error("Failed to generate invoice");
            console.error("Error generating invoice:", error);
        }
    };

    const createOrder = async (values) => {
        try {
            const { subTotal, gst, total } = calculateOrderTotals(
                values.orderItems
            );

            const orderData = {
                customer_id: values.customer_id,
                invoice_no: values.invoice_no,
                order_status: values.order_status || "pending",
                orderItems: values.orderItems.map((item) => ({
                    product_id: item.product_id,
                    quantity: item.quantity,
                    unitcost: item.unitcost,
                })),
                sub_total: subTotal,
                gst,
                total,
                total_products: values.orderItems.length,
            };

            await api.post("/orders", orderData);
            toast.success("Order created successfully");
            refreshOrders();
            return true;
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to create order"
            );
            console.error("Error creating order:", error);
            return false;
        }
    };

    const fetchOrderDetails = async (orderId) => {
        setDetailsLoading(true);
        try {
            const response = await api.get(`/orders/${orderId}/details`);
            setOrderDetails(response.data.data);
        } catch (error) {
            toast.error("Failed to fetch order details");
            console.error("Error fetching order details:", error);
        } finally {
            setDetailsLoading(false);
        }
    };

    return {
        orderDetails,
        detailsLoading,
        updateOrderStatus,
        generateInvoice,
        createOrder,
        fetchOrderDetails,
    };
};
