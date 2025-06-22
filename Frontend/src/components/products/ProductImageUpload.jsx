import React from "react";
import { Form, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const ProductImageUpload = ({ imageUrl, onChange }) => {
    return (
        <Form.Item
            name="product_image"
            label="Product Image"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
                if (Array.isArray(e)) {
                    return e;
                }
                return e?.fileList;
            }}
        >
            <Upload
                listType="picture-card"
                maxCount={1}
                beforeUpload={() => false}
                onChange={onChange}
                showUploadList={false}
                style={{
                    width: "100%",
                    minHeight: "120px",
                }}
            >
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt="Product"
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            minHeight: "100px",
                        }}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center p-4">
                        <UploadOutlined className="text-lg mb-2" />
                        <div className="text-sm">Upload</div>
                    </div>
                )}
            </Upload>
        </Form.Item>
    );
};

export default ProductImageUpload;