import { useState, useEffect } from "react";
import { api } from "../../api/api";

export const useCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await api.get("/categories/available");
            if (response.data.success) {
                setCategories(response.data.data);
            }
        } catch (err) {
            console.error("Categories fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserCategories = async () => {
        try {
            setLoading(true);
            const response = await api.get("/categories/user");
            if (response.data.success) {
                setCategories(response.data.data);
            }
        } catch (err) {
            console.error("User categories fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return { categories, loading, fetchCategories, fetchUserCategories };
};
