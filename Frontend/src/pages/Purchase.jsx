import React from "react";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { PurchaseList } from "../components/Purchase";
import { usePurchase } from "../hooks/usePurchase";

const Purchase = () => {
    const {
        // State
        purchases,
        suppliers,
        products,
        loading,
        purchaseDetails,
        returnPreviewData,
        stats,

        // Actions
        createPurchase,
        updatePurchaseStatus,
        fetchPurchaseDetails,
        fetchReturnPreview,
    } = usePurchase();

    return (
        <PurchaseList
            purchases={purchases}
            suppliers={suppliers}
            products={products}
            loading={loading}
            stats={stats}
            onCreatePurchase={createPurchase}
            onUpdateStatus={updatePurchaseStatus}
            onFetchPurchaseDetails={fetchPurchaseDetails}
            onFetchReturnPreview={fetchReturnPreview}
            purchaseDetails={purchaseDetails}
            returnPreviewData={returnPreviewData}
        />
    );
};

export default Purchase;
