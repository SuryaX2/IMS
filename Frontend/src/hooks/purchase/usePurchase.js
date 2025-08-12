import { useState, useEffect } from "react";
import { message } from "antd";
import toast from "react-hot-toast";
import { api } from "../../api/api.js";
import { calculateStats } from "../../utils/purchaseUtils.js";

export const usePurchase = () => {
    const [purchases, setPurchases] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [purchaseDetails, setPurchaseDetails] = useState([]);
    const [returnPreviewData, setReturnPreviewData] = useState(null);
    const [stats, setStats] = useState({
        pending: 0,
        completed: 0,
        returned: 0,
        total: 0,
    });

    // Fetch all purchases
    const fetchPurchases = async () => {
        setLoading(true);
        try {
            const response = await api.get("/purchases");
            if (response.data.success) {
                setPurchases(response.data.data);
                setStats(calculateStats(response.data.data));
            } else {
                toast.error("Failed to fetch purchases");
            }
        } catch (error) {
            toast.error("Error fetching purchases");
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch suppliers
    const fetchSuppliers = async () => {
        try {
            const response = await api.get("/suppliers");
            if (response.data.success) {
                setSuppliers(response.data.data);
            }
        } catch (error) {
            toast.error("Error fetching suppliers");
            console.error("Error:", error);
        }
    };

    // Fetch products
    const fetchProducts = async () => {
        try {
            const response = await api.get("/products");
            if (response.data.success) {
                setProducts(response.data.data);
            }
        } catch (error) {
            toast.error("Error fetching products");
            console.error("Error:", error);
        }
    };

    // Fetch purchase details
    const fetchPurchaseDetails = async (purchaseId) => {
        try {
            const response = await api.get(`/purchases/${purchaseId}`);
            if (response.data.success) {
                setPurchaseDetails(response.data.data);
                return response.data.data;
            }
        } catch (error) {
            toast.error("Error fetching purchase details");
            console.error("Error:", error);
        }
    };

    // Fetch return preview
    const fetchReturnPreview = async (purchaseId) => {
        try {
            const response = await api.get(
                `/purchases/${purchaseId}/return-preview`
            );
            if (response.data.success) {
                setReturnPreviewData(response.data.data);
                return response.data.data;
            } else {
                toast.error(
                    response.data.message || "Failed to fetch return preview"
                );
            }
        } catch (error) {
            toast.error("Error fetching return preview");
            console.error("Error:", error);
        }
    };

    // Create purchase
    const createPurchase = async (values) => {
        try {
            const response = await api.post("/purchases", values);
            if (response.data.success) {
                toast.success("Purchase created successfully");
                fetchPurchases();
                return { success: true };
            } else {
                toast.error(
                    response.data.message || "Failed to create purchase"
                );
                return { success: false };
            }
        } catch (error) {
            toast.error("Error creating purchase");
            console.error("Error:", error);
            return { success: false };
        }
    };

    // Update purchase status
    const updatePurchaseStatus = async (purchaseId, status) => {
        try {
            const response = await api.patch(`/purchases/${purchaseId}`, {
                purchase_status: status,
            });
            if (response.data.success) {
                toast.success("Purchase status updated successfully");
                fetchPurchases();

                // Show return information if status is returned
                if (status === "returned" && response.data.data.returnInfo) {
                    const returnInfo = response.data.data.returnInfo;
                    message.success(
                        `Purchase returned successfully! Total refund: ₹${returnInfo.total_refund_amount.toFixed(2)}`
                    );
                }
                return { success: true };
            } else {
                toast.error(
                    response.data.message || "Failed to update purchase status"
                );
                return { success: false };
            }
        } catch (error) {
            toast.error("Error updating purchase status");
            console.error("Error:", error);
            return { success: false };
        }
    };

    // Initialize data
    useEffect(() => {
        fetchPurchases();
        fetchSuppliers();
        fetchProducts();
    }, []);

    return {
        // State
        purchases,
        suppliers,
        products,
        loading,
        purchaseDetails,
        returnPreviewData,
        stats,

        // Actions
        fetchPurchases,
        fetchSuppliers,
        fetchProducts,
        fetchPurchaseDetails,
        fetchReturnPreview,
        createPurchase,
        updatePurchaseStatus,

        // Setters
        setPurchaseDetails,
        setReturnPreviewData,
    };
};
