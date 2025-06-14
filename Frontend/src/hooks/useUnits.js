import { useState, useEffect } from "react";
import { api } from "../api/api";

export const useUnits = () => {
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchUnits = async () => {
        try {
            setLoading(true);
            const response = await api.get("/units");
            if (response.data.success) {
                setUnits(response.data.data);
            }
        } catch (err) {
            console.error("Units fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUnits();
    }, []);

    return { units, loading, fetchUnits };
};
