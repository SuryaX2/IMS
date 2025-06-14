import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { api } from "../api/api";

export const useProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProducts = async (filters = {}) => {
        try {
            setLoading(true);
            setError(null);

            const params = new URLSearchParams();
            if (filters.search) params.append("search", filters.search);
            if (filters.category) params.append("category", filters.category);
            if (filters.stockFilter === "out") params.append("max_stock", 0);
            if (filters.stockFilter === "low") {
                params.append("min_stock", 1);
                params.append("max_stock", 10);
            }

            const response = await api.get(`/products?${params.toString()}`);

            if (response.data.success) {
                setProducts(response.data.data);
            } else {
                setError("Failed to fetch products");
                toast.error("Failed to load products");
            }
        } catch (err) {
            console.error("Products fetch error:", err);
            const errorMessage =
                err.response?.data?.message ||
                "Something went wrong while fetching products";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const createProduct = async (formData) => {
        try {
            const response = await api.post("/products", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data.success) {
                toast.success("Product created successfully");
                setProducts((prev) => [...prev, response.data.data]);
                return { success: true, data: response.data.data };
            }
        } catch (err) {
            console.error("Create product error:", err);
            const errorMessage =
                err.response?.data?.message || "Failed to create product";
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const updateProduct = async (productId, formData) => {
        try {
            const response = await api.patch(
                `/products/${productId}`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            if (response.data.success) {
                toast.success("Product updated successfully");
                setProducts((prev) =>
                    prev.map((p) =>
                        p._id === productId ? response.data.data : p
                    )
                );
                return { success: true, data: response.data.data };
            }
        } catch (err) {
            console.error("Update product error:", err);
            const errorMessage =
                err.response?.data?.message || "Failed to update product";
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const deleteProduct = async (productId) => {
        try {
            const response = await api.delete(`/products/${productId}`);

            if (response.data.success) {
                toast.success("Product deleted successfully");
                setProducts((prev) => prev.filter((p) => p._id !== productId));
                return { success: true };
            } else {
                toast.error("Failed to delete product");
                return { success: false };
            }
        } catch (err) {
            console.error("Delete product error:", err);
            const errorMessage =
                err.response?.data?.message || "Failed to delete product";
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return {
        products,
        loading,
        error,
        fetchProducts,
        createProduct,
        updateProduct,
        deleteProduct,
    };
};
