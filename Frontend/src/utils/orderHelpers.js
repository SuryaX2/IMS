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
    const gst = subTotal * 0.18;
    const total = subTotal + gst;
    return { subTotal, gst, total };
};

export const calculateStats = (orders, pagination) => {
    const nonCancelledOrders = orders.filter(
        (order) => order.order_status !== "cancelled"
    );

    return {
        total: pagination.total,
        pending: orders.filter((o) => o.order_status === "pending").length,
        completed: orders.filter((o) => o.order_status === "completed").length,
        revenue: nonCancelledOrders.reduce(
            (sum, order) => sum + order.total,
            0
        ),
    };
};

export const TERMINAL_STATUSES = ["completed", "cancelled"];

export const ORDER_STATUSES = [
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
];
