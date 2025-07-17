import React from "react";
import { Modal, Table, Alert, Button, Tag, Typography } from "antd";

const { Text } = Typography;

const ReturnPreview = ({
    visible,
    onCancel,
    onProceed,
    returnPreviewData,
    purchases,
}) => {
    const returnPreviewColumns = [
        {
            title: "Product",
            dataIndex: "product_name",
            key: "product_name",
        },
        {
            title: "Purchased Qty",
            dataIndex: "purchased_quantity",
            key: "purchased_quantity",
        },
        {
            title: "Current Stock",
            dataIndex: "current_stock",
            key: "current_stock",
        },
        {
            title: "Returnable Qty",
            dataIndex: "returnable_quantity",
            key: "returnable_quantity",
            render: (qty, record) => (
                <span
                    className={
                        record.can_fully_return
                            ? "text-green-600"
                            : "text-red-600"
                    }
                >
                    {qty}
                </span>
            ),
        },
        {
            title: "Unit Cost",
            dataIndex: "unit_cost",
            key: "unit_cost",
            render: (cost) => `₹${cost.toFixed(2)}`,
        },
        {
            title: "Potential Refund",
            dataIndex: "potential_refund",
            key: "potential_refund",
            render: (refund) => `₹${refund.toFixed(2)}`,
        },
        {
            title: "Status",
            key: "status",
            render: (_, record) => (
                <Tag color={record.can_fully_return ? "green" : "orange"}>
                    {record.can_fully_return ? "Full Return" : "Partial Return"}
                </Tag>
            ),
        },
    ];

    const handleProceed = () => {
        onCancel();
        const purchase = purchases.find(
            (p) => p._id === returnPreviewData?.purchase_id
        );
        if (purchase) {
            onProceed(purchase._id, "returned");
        }
    };

    return (
        <Modal
            title={`Return Preview - ${returnPreviewData?.purchase_no}`}
            open={visible}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button
                    key="proceed"
                    type="primary"
                    danger
                    onClick={handleProceed}
                >
                    Proceed with Return
                </Button>,
            ]}
            width={1000}
        >
            {returnPreviewData && (
                <>
                    <Alert
                        message="Return Preview"
                        description={`Total potential refund: ₹${returnPreviewData.total_potential_refund.toFixed(2)}`}
                        type="info"
                        showIcon
                        className="mb-4"
                    />

                    <Alert
                        message="Important Notice"
                        description="Items with insufficient stock will be partially returned. Only the available stock quantity will be processed for return."
                        type="warning"
                        showIcon
                        className="mb-4"
                    />

                    <Table
                        columns={returnPreviewColumns}
                        dataSource={returnPreviewData.return_preview}
                        rowKey="product_id"
                        pagination={false}
                        scroll={{ x: 800 }}
                        summary={(pageData) => {
                            const totalRefund = pageData.reduce(
                                (sum, record) =>
                                    sum + (record.potential_refund || 0),
                                0
                            );
                            const fullReturns = pageData.filter(
                                (item) => item.can_fully_return
                            ).length;
                            const partialReturns = pageData.filter(
                                (item) => !item.can_fully_return
                            ).length;

                            return (
                                <Table.Summary fixed>
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell
                                            index={0}
                                            colSpan={5}
                                        >
                                            <div className="text-right">
                                                <Text strong>
                                                    Total Potential Refund:{" "}
                                                </Text>
                                                <Text strong type="danger">
                                                    ₹{totalRefund.toFixed(2)}
                                                </Text>
                                                <br />
                                                <Text type="success">
                                                    Full Returns: {fullReturns}
                                                </Text>
                                                {partialReturns > 0 && (
                                                    <>
                                                        <Text> | </Text>
                                                        <Text type="warning">
                                                            Partial Returns:{" "}
                                                            {partialReturns}
                                                        </Text>
                                                    </>
                                                )}
                                            </div>
                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                </Table.Summary>
                            );
                        }}
                    />
                </>
            )}
        </Modal>
    );
};

export default ReturnPreview;
