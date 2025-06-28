import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { api } from "../api/api";
import { calculateStats } from "../utils/orderHelpers";

export const useOrders = () => {
    const [orders, setOrders] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const [filters, setFilters] = useState({
        search: "",
        customer_id: "",
        order_status: "",
        date_range: null,
        total_range: { min: "", max: "" },
    });
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        completed: 0,
        revenue: 0,
    });

    const fetchOrders = async (
        page = 1,
        pageSize = 10,
        currentFilters = filters
    ) => {
        setLoading(true);
        try {
            const params = {
                page,
                limit: pageSize,
                ...(currentFilters.search && { search: currentFilters.search }),
                ...(currentFilters.customer_id && {
                    customer_id: currentFilters.customer_id,
                }),
                ...(currentFilters.order_status && {
                    order_status: currentFilters.order_status,
                }),
                ...(currentFilters.date_range && {
                    start_date:
                        currentFilters.date_range[0].format("YYYY-MM-DD"),
                    end_date: currentFilters.date_range[1].format("YYYY-MM-DD"),
                }),
                ...(currentFilters.total_range.min && {
                    min_total: currentFilters.total_range.min,
                }),
                ...(currentFilters.total_range.max && {
                    max_total: currentFilters.total_range.max,
                }),
            };

            const response = await api.get("/orders", { params });
            const { orders: ordersData, pagination: paginationData } =
                response.data.data;

            setOrders(ordersData);
            setPagination({
                current: paginationData.page,
                pageSize: paginationData.limit,
                total: paginationData.total,
            });

            setStats(calculateStats(ordersData, paginationData));
        } catch (error) {
            toast.error("Failed to fetch orders");
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCustomers = async () => {
        try {
            const response = await api.get("/customers");
            setCustomers(response.data.data);
        } catch (error) {
            console.error("Error fetching customers:", error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await api.get("/products");
            setProducts(response.data.data.products || response.data.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    useEffect(() => {
        fetchOrders();
        fetchCustomers();
        fetchProducts();
    }, []);

    return {
        orders,
        customers,
        products,
        loading,
        pagination,
        filters,
        stats,
        setFilters,
        fetchOrders,
        setPagination,
    };
};
