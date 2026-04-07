export const generatePurchaseNo = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const random = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0");
    return `P${year}${month}${day}${random}`;
};

export const getStatusColor = (status) => {
    switch (status) {
        case "pending":
            return "orange";
        case "completed":
            return "green";
        case "returned":
            return "red";
        default:
            return "default";
    }
};

export const calculateStats = (purchaseData) => {
    const pending = purchaseData.filter(
        (p) => p.purchase_status === "pending"
    ).length;
    const completed = purchaseData.filter(
        (p) => p.purchase_status === "completed"
    ).length;
    const returned = purchaseData.filter(
        (p) => p.purchase_status === "returned"
    ).length;

    return {
        pending,
        completed,
        returned,
        total: purchaseData.length,
    };
};
