import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { api } from "../../api/api";

export const useSuppliers = (isAdmin = false) => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        individual: 0,
        wholesale: 0,
        retail: 0,
        company: 0,
    });

    const calculateStats = (suppliersData) => {
        const individual = suppliersData.filter(
            (s) => s.type === "individual"
        ).length;
        const wholesale = suppliersData.filter(
            (s) => s.type === "wholesale"
        ).length;
        const retail = suppliersData.filter((s) => s.type === "retail").length;
        const company = suppliersData.filter(
            (s) => s.type === "company"
        ).length;

        setStats({ individual, wholesale, retail, company });
    };

    const fetchSuppliers = async () => {
        setLoading(true);
        try {
            // Use admin route if user is admin, otherwise use regular route
            const endpoint = isAdmin ? "/suppliers/admin/all" : "/suppliers";
            const response = await api.get(endpoint);
            setSuppliers(response.data.data);
            calculateStats(response.data.data);
        } catch (error) {
            toast.error("Failed to fetch suppliers");
            console.error("Error fetching suppliers:", error);
        } finally {
            setLoading(false);
        }
    };

    const createSupplier = async (formData) => {
        try {
            await api.post("/suppliers", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success("Supplier created successfully");
            fetchSuppliers();
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "Creation failed");
            return false;
        }
    };

    const updateSupplier = async (id, formData) => {
        try {
            await api.patch(`/suppliers/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success("Supplier updated successfully");
            fetchSuppliers();
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "Update failed");
            return false;
        }
    };

    const deleteSupplier = async (id) => {
        try {
            await api.delete(`/suppliers/${id}`);
            toast.success("Supplier deleted successfully");
            fetchSuppliers();
        } catch (error) {
            toast.error("Failed to delete supplier");
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, [isAdmin]);

    return {
        suppliers,
        loading,
        stats,
        fetchSuppliers,
        createSupplier,
        updateSupplier,
        deleteSupplier,
    };
};
