import {
    Drawer,
    Descriptions,
    Tag,
    Empty,
    Spin,
    Button,
    Table,
    Divider,
} from "antd";
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
                <div className="flex items-center space-x-2">
                    <ShoppingCartOutlined className="text-blue-500" />
                    <span className="text-xl font-bold text-gray-800">
                        Order #{selectedOrder.invoice_no}
                    </span>
                </div>
            }
            placement="right"
            onClose={onClose}
            open={visible}
            width={700}
            className="order-details-drawer"
            extra={
                <Button
                    type="text"
                    icon={<CloseOutlined />}
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                />
            }
            styles={{
                body: { padding: 0, backgroundColor: "#f8fafc" },
                header: {
                    borderBottom: "1px solid #e2e8f0",
                    paddingBottom: 16,
                    backgroundColor: "#ffffff",
                    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                },
            }}
        >
            <div className="p-6 space-y-6">
                {/* Order Status Header */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                            <span>Order Overview</span>
                        </h3>
                        <Tag
                            icon={getStatusIcon(selectedOrder.order_status)}
                            color={getStatusColor(selectedOrder.order_status)}
                            className="text-sm font-medium px-3 py-1 rounded-full"
                        >
                            {selectedOrder.order_status.toUpperCase()}
                        </Tag>
                    </div>

                    <Divider className="my-4" />

                    {/* Customer & Order Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                            <div className="flex items-center space-x-2 mb-2">
                                <UserOutlined className="text-blue-600" />
                                <span className="text-sm font-medium text-blue-800">
                                    Customer
                                </span>
                            </div>
                            <p className="text-base font-semibold text-blue-900">
                                {selectedOrder.customer_id?.name || "N/A"}
                            </p>
                        </div>

                        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                            <div className="flex items-center space-x-2 mb-2">
                                <CalendarOutlined className="text-green-600" />
                                <span className="text-sm font-medium text-green-800">
                                    Order Date
                                </span>
                            </div>
                            <p className="text-base font-semibold text-green-900">
                                {dayjs(selectedOrder.order_date).format(
                                    "MMMM DD, YYYY"
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">
                        Order Summary
                    </h4>
                    <Descriptions
                        column={{ xs: 1, sm: 2, md: 2 }}
                        size="middle"
                        labelStyle={{
                            fontWeight: 600,
                            color: "#374151",
                            fontSize: "14px",
                        }}
                        contentStyle={{
                            color: "#1f2937",
                            fontSize: "14px",
                        }}
                        className="custom-descriptions"
                    >
                        <Descriptions.Item label="Total Products">
                            <div className="flex items-center">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 whitespace-nowrap">
                                    {selectedOrder.total_products} items
                                </span>
                            </div>
                        </Descriptions.Item>
                        <Descriptions.Item label="Subtotal">
                            <span className="text-gray-700 font-medium">
                                ₹{selectedOrder.sub_total?.toFixed(2)}
                            </span>
                        </Descriptions.Item>
                        <Descriptions.Item label="GST (18%)">
                            <span className="text-gray-700 font-medium">
                                ₹
                                {(
                                    selectedOrder.total -
                                    selectedOrder.sub_total
                                )?.toFixed(2)}
                            </span>
                        </Descriptions.Item>
                        <Descriptions.Item label="Total Amount">
                            <span className="text-xs font-bold text-green-600 bg-green-100 px-2.5 py-0.5 rounded-lg">
                                ₹{selectedOrder.total?.toFixed(2)}
                            </span>
                        </Descriptions.Item>
                    </Descriptions>
                </div>

                {/* Order Items Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <h4 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                            <ShoppingCartOutlined className="text-blue-500" />
                            <span>Order Items</span>
                        </h4>
                    </div>

                    <div className="p-6">
                        {detailsLoading ? (
                            <div className="text-center py-12">
                                <Spin size="large" />
                                <p className="mt-4 text-gray-500 text-base">
                                    Loading items...
                                </p>
                            </div>
                        ) : orderDetails.length > 0 ? (
                            <Table
                                dataSource={orderDetails}
                                columns={columns}
                                pagination={false}
                                rowKey={(record, index) => index}
                                className="custom-table"
                                size="middle"
                                rowClassName="hover:bg-gray-50 transition-colors duration-200"
                            />
                        ) : (
                            <div className="py-12">
                                <Empty
                                    description={
                                        <span className="text-gray-500 text-lg">
                                            No items found for this order
                                        </span>
                                    }
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Button */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <Button
                        type="primary"
                        icon={<FilePdfOutlined />}
                        onClick={() =>
                            onGenerateInvoice(
                                selectedOrder._id,
                                selectedOrder.invoice_no
                            )
                        }
                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border-0 rounded-lg text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
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
