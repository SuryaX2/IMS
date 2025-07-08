import React from "react";
import { Drawer, Descriptions, Tag, Card, Empty, Spin, Button } from "antd";
import { FilePdfOutlined, CloseOutlined } from "@ant-design/icons";
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
            title={`Order #${selectedOrder.invoice_no}`}
            placement="right"
            onClose={onClose}
            open={visible}
            width={600}
            className="order-details-drawer"
            extra={
                <Button
                    type="text"
                    icon={<CloseOutlined />}
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700"
                />
            }
            styles={{
                body: { padding: 0 },
                header: {
                    borderBottom: "1px solid #f0f0f0",
                    paddingBottom: 16,
                },
            }}
        >
            <div className="p-6 space-y-6">
                {/* Order Status */}
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Order Details
                    </h3>
                    <Tag
                        icon={getStatusIcon(selectedOrder.order_status)}
                        color={getStatusColor(selectedOrder.order_status)}
                        className="text-sm font-medium px-3 py-1"
                    >
                        {selectedOrder.order_status.toUpperCase()}
                    </Tag>
                </div>

                {/* Order Information */}
                <Card className="shadow-sm">
                    <Descriptions
                        column={{ xs: 1, sm: 2 }}
                        size="middle"
                        labelStyle={{
                            fontWeight: 600,
                            color: "#374151",
                        }}
                        contentStyle={{
                            color: "#1f2937",
                        }}
                    >
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
                        <Descriptions.Item label="Subtotal">
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
                </Card>

                {/* Order Items */}
                <Card className="shadow-sm">
                    <div className="mb-4">
                        <h4 className="text-base font-semibold text-gray-800">
                            Order Items
                        </h4>
                    </div>

                    {detailsLoading ? (
                        <div className="text-center py-8">
                            <Spin size="large" />
                            <p className="mt-4 text-gray-500">
                                Loading items...
                            </p>
                        </div>
                    ) : orderDetails.length > 0 ? (
                        <div className="space-y-3">
                            {orderDetails.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                                >
                                    <div className="flex-1">
                                        <h5 className="font-medium text-gray-800">
                                            {item.product_id?.product_name}
                                        </h5>
                                        <p className="text-sm text-gray-600">
                                            {item.quantity} × $
                                            {item.unitcost?.toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-semibold text-green-600">
                                            ${item.total?.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <Empty description="No items found" className="py-8" />
                    )}
                </Card>

                {/* Action Button */}
                <div className="pt-4 border-t">
                    <Button
                        type="primary"
                        icon={<FilePdfOutlined />}
                        onClick={() =>
                            onGenerateInvoice(
                                selectedOrder._id,
                                selectedOrder.invoice_no
                            )
                        }
                        className="w-full h-10 bg-blue-600 hover:bg-blue-700"
                        size="large"
                    >
                        Download Invoice
                    </Button>
                </div>
            </div>
        </Drawer>
    );
};

export default OrderDetailsDrawer;
