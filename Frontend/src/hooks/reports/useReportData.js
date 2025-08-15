import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { api } from "../../api/api";

const useReportData = (endpoint, params = {}, dependencies = []) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.get(endpoint, { params });

            if (response.data.success) {
                setData(response.data.data);
                return response.data.data;
            } else {
                throw new Error(
                    response.data.message || "Failed to fetch data"
                );
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            setError(errorMessage);
            toast.error(errorMessage);
            setData(null);
            return null;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, dependencies);

    const refetch = () => {
        return fetchData();
    };

    return {
        data,
        loading,
        error,
        refetch,
    };
};

export default useReportData;
