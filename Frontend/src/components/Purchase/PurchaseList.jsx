import React, { useState } from "react";
import {
    Card,
    Input,
    Button,
    Row,
    Col,
    Typography,
    Space,
    Divider,
} from "antd";
import {
    PlusOutlined,
    SearchOutlined,
    ShoppingCartOutlined,
} from "@ant-design/icons";
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
        <div className="min-h-screen bg-white">
            <div className="p-4 sm:p-6 lg:p-8">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                        <div className="mb-4 sm:mb-0">
                            <div className="flex-1 min-w-0">
                                <h1 className="truncate mb-1 text-4xl font-bold flex items-center gap-2">
                                    Purchases
                                    <ShoppingCartOutlined className="text-blue-600 inline-block ml-2" />
                                </h1>
                            </div>
                            <p className="text-gray-600 text-sm sm:text-base">
                                Manage your purchase orders and supplier
                                relationships
                            </p>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <PurchaseStats stats={stats} />
                </div>

                {/* Search and Add Section */}
                <Card className="mb-6 shadow-sm border-0 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <Row
                        gutter={[16, 16]}
                        align="middle"
                        className="flex-col sm:flex-row"
                    >
                        <Col flex="auto" className="w-full sm:w-auto">
                            <Input.Search
                                placeholder="Search by purchase number or supplier name..."
                                allowClear
                                enterButton={
                                    <Button
                                        type="primary"
                                        icon={<SearchOutlined />}
                                    >
                                        Search
                                    </Button>
                                }
                                size="large"
                                onSearch={(value) => setSearchText(value)}
                                onChange={(e) => setSearchText(e.target.value)}
                                className="w-full"
                            />
                        </Col>
                        <Col className="w-full sm:w-auto">
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                size="large"
                                onClick={handleAddPurchase}
                                className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                Add Purchase
                            </Button>
                        </Col>
                    </Row>
                </Card>

                {/* Table Section */}
                <Card className="shadow-sm border-0 overflow-hidden">
                    <div className="p-4 sm:p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                            <Title level={4} className="!mb-0">
                                Purchase Orders
                            </Title>
                        </div>
                        <PurchaseTable
                            purchases={purchases}
                            loading={loading}
                            searchText={searchText}
                            onViewDetails={handleViewDetails}
                            onUpdateStatus={onUpdateStatus}
                            onReturnPreview={handleReturnPreview}
                        />
                    </div>
                </Card>
            </div>

            {/* Modals */}
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
