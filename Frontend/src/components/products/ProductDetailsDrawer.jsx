import React from "react";
import { Drawer, Descriptions, Image, Badge, Typography, Divider } from "antd";

const { Text, Title } = Typography;

const ProductDetailsDrawer = ({ visible, product, onClose }) => {
    if (!product) return null;

    const getStockStatus = (stock) => {
        if (stock === 0) {
            return { status: "error", text: "Out of Stock" };
        } else if (stock <= 10) {
            return { status: "warning", text: "Low Stock" };
        }
        return { status: "success", text: "In Stock" };
    };

    const stockStatus = getStockStatus(product.stock);

    return (
        <Drawer
            title="Product Details"
            placement="right"
            onClose={onClose}
            open={visible}
            width={400}
        >
            <div className="space-y-6">
                {/* Product Image */}
                <div className="text-center">
                    <Image
                        src={product.product_image}
                        alt={product.product_name}
                        width={200}
                        height={200}
                        style={{ objectFit: "cover" }}
                        fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6U"
                    />
                </div>

                <Divider />

                {/* Product Information */}
                <div>
                    <Title level={4}>{product.product_name}</Title>
                    <Text type="secondary">Code: {product.product_code}</Text>
                </div>

                <Descriptions column={1} bordered size="small">
                    <Descriptions.Item label="Category">
                        {product.category_id?.category_name}
                    </Descriptions.Item>

                    <Descriptions.Item label="Unit">
                        {product.unit_id?.unit_name}
                    </Descriptions.Item>

                    <Descriptions.Item label="Stock Status">
                        <Badge
                            status={stockStatus.status}
                            text={stockStatus.text}
                        />
                    </Descriptions.Item>

                    <Descriptions.Item label="Current Stock">
                        <Text strong>{product.stock}</Text>
                    </Descriptions.Item>

                    <Descriptions.Item label="Buying Price">
                        <Text>${product.buying_price?.toFixed(2)}</Text>
                    </Descriptions.Item>

                    <Descriptions.Item label="Selling Price">
                        <Text strong>${product.selling_price?.toFixed(2)}</Text>
                    </Descriptions.Item>

                    <Descriptions.Item label="Profit Margin">
                        <Text type="success">
                            $
                            {(
                                product.selling_price - product.buying_price
                            )?.toFixed(2)}
                        </Text>
                    </Descriptions.Item>
                </Descriptions>

                {/* Additional Information */}
                <div>
                    <Text type="secondary" className="text-sm">
                        Created:{" "}
                        {new Date(product.createdAt).toLocaleDateString()}
                    </Text>
                    <br />
                    <Text type="secondary" className="text-sm">
                        Last Updated:{" "}
                        {new Date(product.updatedAt).toLocaleDateString()}
                    </Text>
                </div>
            </div>
        </Drawer>
    );
};

export default ProductDetailsDrawer;
