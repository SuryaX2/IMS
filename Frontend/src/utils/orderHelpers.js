import { CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";

export const getStatusColor = (status) => {
    const colors = {
        pending: "orange",
        processing: "blue",
        completed: "green",
        cancelled: "red",
    };
    return colors[status] || "default";
};

export const calculateOrderTotals = (orderItems) => {
    const subTotal = orderItems.reduce(
        (sum, item) => sum + item.quantity * item.unitcost,
        0
    );
    const gst = subTotal * 0.18; // 18% GST
    const total = subTotal + gst;

    return { subTotal, gst, total };
};

export const calculateStats = (orders, pagination) => {
    const totalOrders = pagination.total;
    const pendingOrders = orders.filter(
        (order) => order.order_status === "pending"
    ).length;
    const completedOrders = orders.filter(
        (order) => order.order_status === "completed"
    ).length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

    return {
        total: totalOrders,
        pending: pendingOrders,
        completed: completedOrders,
        revenue: totalRevenue,
    };
};

export const ORDER_STATUSES = [
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
];
