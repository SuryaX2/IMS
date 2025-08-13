import { useState, useCallback, useEffect } from "react";
import { api } from "../../api/api";
import { useAuth } from "../useAuth";
import toast from "react-hot-toast";

export const useCategories = () => {
    const { user, isAdmin } = useAuth();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [filter, setFilter] = useState("all");

    const loadCategories = useCallback(async () => {
        setLoading(true);
        try {
            let response;
            if (isAdmin) {
                response = await api.get("/categories/admin/all");
            } else {
                response = await api.get("/categories/user");
            }

            if (response.data.success) {
                setCategories(response.data.data);
                return response.data.data;
            }
        } catch (error) {
            toast.error("Failed to load categories");
            console.error("Error loading categories:", error);
            return [];
        } finally {
            setLoading(false);
        }
    }, [isAdmin]);

    useEffect(() => {
        loadCategories();
    }, []);

    const createCategory = useCallback(
        async (values) => {
            const loadingToast = toast.loading("Creating category...");
            try {
                const response = await api.post("/categories", values);
                if (response.data.success) {
                    toast.success("Category created successfully", {
                        id: loadingToast,
                    });
                    await loadCategories();
                    return { success: true, data: response.data.data };
                }
            } catch (error) {
                const errorMsg =
                    error.response?.data?.message ||
                    "Failed to create category";
                toast.error(errorMsg, { id: loadingToast });
                return { success: false, error: errorMsg };
            }
        },
        [loadCategories]
    );

    const updateCategory = useCallback(
        async (id, values) => {
            const loadingToast = toast.loading("Updating category...");
            try {
                const endpoint = isAdmin
                    ? `/categories/admin/${id}`
                    : `/categories/user/${id}`;

                const response = await api.patch(endpoint, values);
                if (response.data.success) {
                    toast.success("Category updated successfully", {
                        id: loadingToast,
                    });
                    await loadCategories();
                    return { success: true, data: response.data.data };
                }
            } catch (error) {
                const errorMsg =
                    error.response?.data?.message ||
                    "Failed to update category";
                toast.error(errorMsg, { id: loadingToast });
                return { success: false, error: errorMsg };
            }
        },
        [isAdmin, loadCategories]
    );

    const deleteCategory = useCallback(
        async (id) => {
            const loadingToast = toast.loading("Deleting category...");
            try {
                const endpoint = isAdmin
                    ? `/categories/admin/${id}`
                    : `/categories/user/${id}`;

                const response = await api.delete(endpoint);
                if (response.data.success) {
                    toast.success("Category deleted successfully", {
                        id: loadingToast,
                    });
                    await loadCategories();
                    return { success: true };
                }
            } catch (error) {
                const errorMsg =
                    error.response?.data?.message ||
                    "Failed to delete category";
                toast.error(errorMsg, { id: loadingToast });
                return { success: false, error: errorMsg };
            }
        },
        [isAdmin, loadCategories]
    );

    const filteredCategories = categories.filter((category) => {
        const matchesSearch = category.category_name
            .toLowerCase()
            .includes(searchText.toLowerCase());
        const matchesFilter =
            filter === "all" ||
            (filter === "mine" && category.created_by._id === user?._id) ||
            (filter === "others" && category.created_by._id !== user?._id);
        return matchesSearch && matchesFilter;
    });

    const canEdit = useCallback(
        (category) => {
            return isAdmin || category.created_by._id === user?._id;
        },
        [isAdmin, user]
    );

    const clearFilters = useCallback(() => {
        setSearchText("");
        setFilter("all");
    }, []);

    const stats = {
        total: categories.length,
        mine: categories.filter((cat) => cat.created_by._id === user?._id)
            .length,
        others: categories.filter((cat) => cat.created_by._id !== user?._id)
            .length,
    };

    return {
        categories: filteredCategories,
        loading,
        searchText,
        setSearchText,
        filter,
        setFilter,
        stats,
        loadCategories,
        createCategory,
        updateCategory,
        deleteCategory,
        canEdit,
        clearFilters,
    };
};
