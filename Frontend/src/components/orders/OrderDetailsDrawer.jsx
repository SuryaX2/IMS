import React from "react";
import { Drawer, Descriptions, Tag, Card, Empty, Spin, Button } from "antd";
import { FilePdfOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { getStatusColor } from "../../utils/orderHelpers";
import { getStatusIcon } from "../../data";


const OrderDetailsDrawer = ({
    visible,
    onClose,
    selectedOrder,
    orderDetails,
    detailsLoading,
    onGenerateInvoice,
}) => {
    if (!selectedOrder) return null;

    return (
        <Drawer
            title={`Order Details - ${selectedOrder.invoice_no}`}
            placement="right"
            onClose={onClose}
            open={visible}
            width={600}
        >
            <div className="space-y-6">
                <Descriptions title="Order Information" bordered>
                    <Descriptions.Item label="Invoice No" span={2}>
                        #{selectedOrder.invoice_no}
                    </Descriptions.Item>
                    <Descriptions.Item label="Status">
                        <Tag
                            icon={getStatusIcon(selectedOrder.order_status)}
                            color={getStatusColor(selectedOrder.order_status)}
                        >
                            {selectedOrder.order_status.toUpperCase()}
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Customer">
                        {selectedOrder.customer_id?.name || "N/A"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Order Date">
                        {dayjs(selectedOrder.order_date).format(
                            "MMMM DD, YYYY"
                        )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Total Products">
                        {selectedOrder.total_products}
                    </Descriptions.Item>
                    <Descriptions.Item label="Sub Total">
                        ${selectedOrder.sub_total?.toFixed(2)}
                    </Descriptions.Item>
                    <Descriptions.Item label="GST (18%)">
                        $
                        {(
                            selectedOrder.total - selectedOrder.sub_total
                        )?.toFixed(2)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Total Amount">
                        <span className="text-lg font-semibold text-green-600">
                            ${selectedOrder.total?.toFixed(2)}
                        </span>
                    </Descriptions.Item>
                </Descriptions>

                <div>
                    <h3 className="text-lg font-medium mb-4">Order Items</h3>
                    {detailsLoading ? (
                        <div className="text-center py-8">
                            <Spin size="large" />
                        </div>
                    ) : orderDetails.length > 0 ? (
                        <div className="space-y-3">
                            {orderDetails.map((item, index) => (
                                <Card
                                    key={index}
                                    size="small"
                                    className="border border-gray-200"
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h4 className="font-medium">
                                                {item.product_id?.product_name}
                                            </h4>
                                            <p className="text-gray-500 text-sm">
                                                Quantity: {item.quantity} × $
                                                {item.unitcost?.toFixed(2)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-green-600">
                                                ${item.total?.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Empty description="No order items found" />
                    )}
                </div>

                <div className="flex gap-2 pt-4 border-t">
                    <Button
                        type="primary"
                        icon={<FilePdfOutlined />}
                        onClick={() =>
                            onGenerateInvoice(
                                selectedOrder._id,
                                selectedOrder.invoice_no
                            )
                        }
                        className="bg-red-600 hover:bg-red-700"
                    >
                        Download Invoice
                    </Button>
                </div>
            </div>
        </Drawer>
    );
};

export default OrderDetailsDrawer;
