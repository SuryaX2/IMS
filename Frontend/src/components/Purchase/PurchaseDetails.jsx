import React from "react";
import { Modal, Table, Descriptions, Divider, Tag, Typography } from "antd";
import dayjs from "dayjs";
import { getStatusColor } from "../../utils/purchaseUtils";
import { getStatusIconPurchase } from "../../data";

const { Text } = Typography;

const PurchaseDetails = ({ visible, onCancel, purchase, details }) => {
    const detailColumns = [
        {
            title: "Product",
            dataIndex: ["product_id", "product_name"],
            key: "product_name",
            render: (_, record) => record.product_id?.product_name || "N/A",
        },
        {
            title: "Product Code",
            dataIndex: ["product_id", "product_code"],
            key: "product_code",
            render: (_, record) => record.product_id?.product_code || "N/A",
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
            key: "quantity",
        },
        {
            title: "Unit Cost",
            dataIndex: "unitcost",
            key: "unitcost",
            render: (cost) => `₹${cost.toFixed(2)}`,
        },
        {
            title: "Total",
            dataIndex: "total",
            key: "total",
            render: (total) => `₹${total.toFixed(2)}`,
        },
        {
            title: "Return Status",
            key: "return_status",
            render: (_, record) => {
                if (record.return_processed) {
                    return (
                        <div>
                            <Tag color="red">Returned</Tag>
                            <div className="text-xs text-gray-500">
                                Qty: {record.returned_quantity || 0} | Refund: ₹
                                {(record.refund_amount || 0).toFixed(2)}
                            </div>
                        </div>
                    );
                }
                return <Tag color="default">Not Returned</Tag>;
            },
        },
    ];

    return (
        <Modal
            title={`Purchase Details - ${purchase?.purchase_no}`}
            open={visible}
            onCancel={onCancel}
            footer={null}
            width={900}
        >
            {purchase && (
                <div className="mb-4">
                    <Descriptions column={2} bordered>
                        <Descriptions.Item label="Purchase Number">
                            {purchase.purchase_no}
                        </Descriptions.Item>
                        <Descriptions.Item label="Supplier">
                            {purchase.supplier_id?.name}
                        </Descriptions.Item>
                        <Descriptions.Item label="Purchase Date">
                            {dayjs(purchase.purchase_date).format("DD/MM/YYYY")}
                        </Descriptions.Item>
                        <Descriptions.Item label="Status">
                            <Tag
                                color={getStatusColor(purchase.purchase_status)}
                                icon={getStatusIconPurchase(purchase.purchase_status)}
                            >
                                {purchase.purchase_status.toUpperCase()}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Created By">
                            {purchase.created_by?.username}
                        </Descriptions.Item>
                        <Descriptions.Item label="Created At">
                            {dayjs(purchase.createdAt).format(
                                "DD/MM/YYYY HH:mm"
                            )}
                        </Descriptions.Item>
                    </Descriptions>
                </div>
            )}

            <Divider>Purchase Items</Divider>

            <Table
                columns={detailColumns}
                dataSource={details}
                rowKey="_id"
                pagination={false}
                scroll={{ x: 800 }}
                summary={(pageData) => {
                    const total = pageData.reduce(
                        (sum, record) => sum + (record.total || 0),
                        0
                    );
                    const totalRefund = pageData.reduce(
                        (sum, record) => sum + (record.refund_amount || 0),
                        0
                    );

                    return (
                        <Table.Summary fixed>
                            <Table.Summary.Row>
                                <Table.Summary.Cell index={0} colSpan={4}>
                                    <Text strong>Total Amount:</Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={4}>
                                    <Text strong>₹{total.toFixed(2)}</Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={5}>
                                    {totalRefund > 0 && (
                                        <Text strong type="danger">
                                            Total Refund: ₹
                                            {totalRefund.toFixed(2)}
                                        </Text>
                                    )}
                                </Table.Summary.Cell>
                            </Table.Summary.Row>
                        </Table.Summary>
                    );
                }}
            />
        </Modal>
    );
};

export default PurchaseDetails;
