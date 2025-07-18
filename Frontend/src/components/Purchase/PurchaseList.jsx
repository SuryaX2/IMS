import React, { useState } from "react";
import { Card, Input, Button, Row, Col, Typography } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import PurchaseStats from "./PurchaseStats";
import PurchaseTable from "./PurchaseTable";
import PurchaseForm from "./PurchaseForm";
import PurchaseDetails from "./PurchaseDetails";
import ReturnPreview from "./ReturnPreview";
import { generatePurchaseNo } from "../../utils/purchaseUtils";
import { Form } from "antd";

const { Title } = Typography;

const PurchaseList = ({
    purchases,
    suppliers,
    products,
    loading,
    stats,
    onCreatePurchase,
    onUpdateStatus,
    onFetchPurchaseDetails,
    onFetchReturnPreview,
    purchaseDetails,
    returnPreviewData,
}) => {
    const [searchText, setSearchText] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [returnPreviewModalVisible, setReturnPreviewModalVisible] =
        useState(false);
    const [selectedPurchase, setSelectedPurchase] = useState(null);
    const [form] = Form.useForm();

    const handleViewDetails = async (purchase) => {
        setSelectedPurchase(purchase);
        await onFetchPurchaseDetails(purchase._id);
        setDetailModalVisible(true);
    };

    const handleReturnPreview = async (purchaseId) => {
        await onFetchReturnPreview(purchaseId);
        setReturnPreviewModalVisible(true);
    };

    const handleCreatePurchase = async (values) => {
        const result = await onCreatePurchase(values);
        if (result.success) {
            setModalVisible(false);
            form.resetFields();
        }
    };

    const handleAddPurchase = () => {
        form.resetFields();
        form.setFieldsValue({
            purchase_no: generatePurchaseNo(),
            purchase_status: "pending",
            details: [{}],
        });
        setModalVisible(true);
    };

    return (
        <div className="p-6 bg-white min-h-screen">
            <div className="mb-6">
                <h2 className="text-4xl font-bold flex items-center gap-2 mb-4">
                    Purchase Management
                </h2>

                <PurchaseStats stats={stats} />

                <Row justify="space-between" align="middle" className="mb-4">
                    <Col>
                        <Input.Search
                            placeholder="Search purchases..."
                            allowClear
                            enterButton={<SearchOutlined />}
                            size="large"
                            onSearch={(value) => setSearchText(value)}
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{ width: 300 }}
                        />
                    </Col>
                    <Col>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            size="large"
                            onClick={handleAddPurchase}
                        >
                            Add Purchase
                        </Button>
                    </Col>
                </Row>
            </div>

            <Card>
                <PurchaseTable
                    purchases={purchases}
                    loading={loading}
                    searchText={searchText}
                    onViewDetails={handleViewDetails}
                    onUpdateStatus={onUpdateStatus}
                    onReturnPreview={handleReturnPreview}
                />
            </Card>

            <PurchaseForm
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                onSubmit={handleCreatePurchase}
                suppliers={suppliers}
                products={products}
                form={form}
                initialValues={{
                    purchase_no: generatePurchaseNo(),
                    purchase_status: "pending",
                    details: [{}],
                }}
            />

            <PurchaseDetails
                visible={detailModalVisible}
                onCancel={() => setDetailModalVisible(false)}
                purchase={selectedPurchase}
                details={purchaseDetails}
            />

            <ReturnPreview
                visible={returnPreviewModalVisible}
                onCancel={() => setReturnPreviewModalVisible(false)}
                onProceed={onUpdateStatus}
                returnPreviewData={returnPreviewData}
                purchases={purchases}
            />
        </div>
    );
};

export default PurchaseList;
