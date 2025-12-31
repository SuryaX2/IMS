import { Drawer, Tag, Empty, Spin, Button, Table, Divider } from "antd";
import {
    FilePdfOutlined,
    CloseOutlined,
    ShoppingCartOutlined,
    UserOutlined,
    CalendarOutlined,
} from "@ant-design/icons";
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

    const columns = [
        {
            title: "Product",
            dataIndex: ["product_id", "product_name"],
            key: "product_name",
            render: (text) => (
                <div className="flex items-center space-x-2">
                    <ShoppingCartOutlined className="text-blue-500" />
                    <span className="font-medium text-gray-800">
                        {text || "N/A"}
                    </span>
                </div>
            ),
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
            key: "quantity",
            align: "center",
            width: 100,
            render: (quantity) => (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {quantity}
                </span>
            ),
        },
        {
            title: "Unit Price",
            dataIndex: "unitcost",
            key: "unitcost",
            align: "right",
            width: 120,
            render: (price) => (
                <span className="text-gray-700 font-medium">
                    ₹{price?.toFixed(2) || "0.00"}
                </span>
            ),
        },
        {
            title: "Total",
            dataIndex: "total",
            key: "total",
            align: "right",
            width: 120,
            render: (total) => (
                <span className="text-green-600 font-semibold text-lg">
                    ₹{total?.toFixed(2) || "0.00"}
                </span>
            ),
        },
    ];

    return (
        <Drawer
            title={
                <div className="text-center w-full">
                    <span className="text-xl font-bold tracking-wide uppercase text-gray-900">
                        Order Details - #{selectedOrder.invoice_no}
                    </span>
                </div>
            }
            placement="right"
            onClose={onClose}
            open={visible}
            width={520}
            closeIcon={<CloseOutlined className="text-gray-500" />}
            styles={{
                body: { padding: 24, backgroundColor: "#ffffff" },
                header: {
                    borderBottom: "1px solid #f0f0f0",
                    padding: "20px 24px",
                },
            }}
        >
            <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                        Order Status
                    </span>
                    <Tag
                        icon={getStatusIcon(selectedOrder.order_status)}
                        color={getStatusColor(selectedOrder.order_status)}
                        className="text-sm font-medium px-3 py-1"
                    >
                        {selectedOrder.order_status.toUpperCase()}
                    </Tag>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <div className="flex items-center space-x-2 mb-2">
                            <UserOutlined className="text-gray-400" />
                            <span className="text-xs font-medium text-gray-500 uppercase">
                                Customer
                            </span>
                        </div>
                        <p className="text-base font-semibold text-gray-900">
                            {selectedOrder.customer_id?.name || "N/A"}
                        </p>
                    </div>

                    <div>
                        <div className="flex items-center space-x-2 mb-2">
                            <CalendarOutlined className="text-gray-400" />
                            <span className="text-xs font-medium text-gray-500 uppercase">
                                Order Date
                            </span>
                        </div>
                        <p className="text-base font-semibold text-gray-900">
                            {dayjs(selectedOrder.order_date).format(
                                "MMMM DD, YYYY"
                            )}
                        </p>
                    </div>
                </div>

                <Divider style={{ margin: "24px 0" }} />

                <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-4 uppercase tracking-wide">
                        Order Summary
                    </h3>
                    <div className="bg-gray-50 rounded-2xl p-4 border-2 space-y-3 shadow-[0px_0px_20px_rgba(0,0,0,0.09)]">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                                Total Products
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                                {selectedOrder.total_products} items
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                                Subtotal
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                                ₹{selectedOrder.sub_total?.toFixed(2)}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                                GST (18%)
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                                ₹
                                {(
                                    selectedOrder.total -
                                    selectedOrder.sub_total
                                )?.toFixed(2)}
                            </span>
                        </div>
                        <Divider style={{ margin: "12px 0" }} />
                        <div className="flex items-center justify-between">
                            <span className="text-base font-semibold text-gray-900">
                                Total Amount
                            </span>
                            <span className="text-xl font-bold text-green-600">
                                ₹{selectedOrder.total?.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>

                <Divider style={{ margin: "24px 0" }} />

                <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-4 uppercase tracking-wide">
                        Order Items
                    </h3>
                    {detailsLoading ? (
                        <div className="text-center py-12">
                            <Spin size="large" />
                            <p className="mt-4 text-gray-500 text-sm">
                                Loading items...
                            </p>
                        </div>
                    ) : orderDetails.length > 0 ? (
                        <Table
                            dataSource={orderDetails}
                            columns={columns}
                            pagination={false}
                            rowKey={(record, index) => index}
                            size="middle"
                            bordered
                        />
                    ) : (
                        <div className="py-12">
                            <Empty
                                description={
                                    <span className="text-gray-500">
                                        No items found for this order
                                    </span>
                                }
                            />
                        </div>
                    )}
                </div>

                <div className="pt-4">
                    <Button
                        type="primary"
                        icon={<FilePdfOutlined />}
                        onClick={() =>
                            onGenerateInvoice(
                                selectedOrder._id,
                                selectedOrder.invoice_no
                            )
                        }
                        className="w-full"
                        size="large"
                    >
                        Download Invoice PDF
                    </Button>
                </div>
            </div>
        </Drawer>
    );
};

export default OrderDetailsDrawer;
