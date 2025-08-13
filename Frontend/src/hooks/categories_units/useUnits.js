import { useState, useCallback } from "react";
import { api } from "../../api/api";
import { useAuth } from "../useAuth";
import toast from "react-hot-toast";

export const useUnits = () => {
    const { user, isAdmin } = useAuth();
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [filter, setFilter] = useState("all");

    const loadUnits = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get("/units");
            if (response.data.success) {
                setUnits(response.data.data);
                return response.data.data;
            }
        } catch (error) {
            toast.error("Failed to load units");
            console.error("Error loading units:", error);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const createUnit = useCallback(
        async (values) => {
            const loadingToast = toast.loading("Creating unit...");
            try {
                const response = await api.post("/units", values);
                if (response.data.success) {
                    toast.success("Unit created successfully", {
                        id: loadingToast,
                    });
                    await loadUnits();
                    return { success: true, data: response.data.data };
                }
            } catch (error) {
                const errorMsg =
                    error.response?.data?.message || "Failed to create unit";
                toast.error(errorMsg, { id: loadingToast });
                return { success: false, error: errorMsg };
            }
        },
        [loadUnits]
    );

    const updateUnit = useCallback(
        async (id, values) => {
            const loadingToast = toast.loading("Updating unit...");
            try {
                const response = await api.patch(`/units/${id}`, values);
                if (response.data.success) {
                    toast.success("Unit updated successfully", {
                        id: loadingToast,
                    });
                    await loadUnits();
                    return { success: true, data: response.data.data };
                }
            } catch (error) {
                const errorMsg =
                    error.response?.data?.message || "Failed to update unit";
                toast.error(errorMsg, { id: loadingToast });
                return { success: false, error: errorMsg };
            }
        },
        [loadUnits]
    );

    const deleteUnit = useCallback(
        async (id) => {
            const loadingToast = toast.loading("Deleting unit...");
            try {
                const response = await api.delete(`/units/${id}`);
                if (response.data.success) {
                    toast.success("Unit deleted successfully", {
                        id: loadingToast,
                    });
                    await loadUnits();
                    return { success: true };
                }
            } catch (error) {
                const errorMsg =
                    error.response?.data?.message || "Failed to delete unit";
                toast.error(errorMsg, { id: loadingToast });
                return { success: false, error: errorMsg };
            }
        },
        [loadUnits]
    );

    const filteredUnits = units.filter((unit) => {
        const matchesSearch = unit.unit_name
            .toLowerCase()
            .includes(searchText.toLowerCase());
        const matchesFilter =
            filter === "all" ||
            (filter === "mine" && unit.created_by._id === user?._id) ||
            (filter === "others" && unit.created_by._id !== user?._id);
        return matchesSearch && matchesFilter;
    });

    const canEdit = useCallback(
        (unit) => {
            return isAdmin || unit.created_by._id === user?._id;
        },
        [isAdmin, user]
    );

    const clearFilters = useCallback(() => {
        setSearchText("");
        setFilter("all");
    }, []);

    const stats = {
        total: units.length,
        mine: units.filter((unit) => unit.created_by._id === user?._id).length,
        others: units.filter((unit) => unit.created_by._id !== user?._id)
            .length,
    };

    return {
        units: filteredUnits,
        loading,
        searchText,
        setSearchText,
        filter,
        setFilter,
        stats,
        loadUnits,
        createUnit,
        updateUnit,
        deleteUnit,
        canEdit,
        clearFilters,
    };
};
