export const filterSuppliers = (suppliers, searchText, filterType) => {
    return suppliers.filter((supplier) => {
        const matchesSearch =
            supplier.name.toLowerCase().includes(searchText.toLowerCase()) ||
            supplier.email.toLowerCase().includes(searchText.toLowerCase()) ||
            supplier.phone.includes(searchText);

        const matchesFilter =
            filterType === "all" || supplier.type === filterType;

        return matchesSearch && matchesFilter;
    });
};

export const calculateSupplierStats = (suppliers) => {
    return {
        individual: suppliers.filter((s) => s.type === "individual").length,
        wholesale: suppliers.filter((s) => s.type === "wholesale").length,
        retail: suppliers.filter((s) => s.type === "retail").length,
        company: suppliers.filter((s) => s.type === "company").length,
    };
};

export const supplierTypes = [
    { value: "individual", label: "Individual" },
    { value: "wholesale", label: "Wholesale" },
    { value: "retail", label: "Retail" },
    { value: "company", label: "Company" },
];

export const getSupplierTypeColor = (type) => {
    const colors = {
        individual: "purple",
        wholesale: "blue",
        retail: "green",
        company: "orange",
    };
    return colors[type] || "default";
};
