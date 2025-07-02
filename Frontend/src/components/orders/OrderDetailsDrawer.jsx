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
            title={
                <div className="text-sm sm:text-base">
                    Order Details - {selectedOrder.invoice_no}
                </div>
            }
            placement="right"
            onClose={onClose}
            open={visible}
            width="100vw"
            style={{ maxWidth: "600px" }}
            className="mobile-drawer"
        >
            <div className="space-y-4 sm:space-y-6">
                <Descriptions
                    title={
                        <span className="text-base sm:text-lg">
                            Order Information
                        </span>
                    }
                    bordered
                    size="small"
                    column={{ xs: 1, sm: 2 }}
                    labelStyle={{
                        fontSize: "14px",
                        fontWeight: "500",
                    }}
                    contentStyle={{
                        fontSize: "14px",
                    }}
                >
                    <Descriptions.Item
                        label="Invoice No"
                        span={{ xs: 1, sm: 2 }}
                    >
                        <span className="font-medium">
                            #{selectedOrder.invoice_no}
                        </span>
                    </Descriptions.Item>
                    <Descriptions.Item label="Status">
                        <Tag
                            icon={getStatusIcon(selectedOrder.order_status)}
                            color={getStatusColor(selectedOrder.order_status)}
                            className="text-xs"
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
                        <span className="text-base sm:text-lg font-semibold text-green-600">
                            ${selectedOrder.total?.toFixed(2)}
                        </span>
                    </Descriptions.Item>
                </Descriptions>

                <div>
                    <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">
                        Order Items
                    </h3>
                    {detailsLoading ? (
                        <div className="text-center py-6 sm:py-8">
                            <Spin size="large" />
                        </div>
                    ) : orderDetails.length > 0 ? (
                        <div className="space-y-2 sm:space-y-3">
                            {orderDetails.map((item, index) => (
                                <Card
                                    key={index}
                                    size="small"
                                    className="border border-gray-200"
                                >
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                                        <div className="flex-1">
                                            <h4 className="font-medium text-sm sm:text-base">
                                                {item.product_id?.product_name}
                                            </h4>
                                            <p className="text-gray-500 text-xs sm:text-sm">
                                                Quantity: {item.quantity} × $
                                                {item.unitcost?.toFixed(2)}
                                            </p>
                                        </div>
                                        <div className="text-left sm:text-right">
                                            <p className="font-semibold text-green-600 text-sm sm:text-base">
                                                ${item.total?.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Empty
                            description="No order items found"
                            className="my-4 sm:my-8"
                        />
                    )}
                </div>

                <div className="flex gap-2 pt-3 sm:pt-4 border-t">
                    <Button
                        type="primary"
                        icon={<FilePdfOutlined />}
                        onClick={() =>
                            onGenerateInvoice(
                                selectedOrder._id,
                                selectedOrder.invoice_no
                            )
                        }
                        className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
                        size="large"
                    >
                        <span className="hidden xs:inline">Download </span>
                        Invoice
                    </Button>
                </div>
            </div>
        </Drawer>
    );
};

export default OrderDetailsDrawer;
