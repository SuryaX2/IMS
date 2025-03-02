import React, { useState } from "react";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Upload, message } from "antd";

const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
};

const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
        message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
};

const AvatarUpload = ({ onChange }) => {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState();

    const handleChange = (info) => {
        if (info.file.status === "uploading") {
            setLoading(true);
            return;
        }
        
        // This is the key change - handle errors properly
        if (info.file.status === "error") {
            setLoading(false);
            message.error("Upload failed. Please try again.");
            return;
        }
        
        if (info.file.status === "done") {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, (url) => {
                setLoading(false);
                setImageUrl(url);
            });

            // Pass the change to parent component
            if (onChange) {
                onChange(info);
            }
        }
    };

    // Alternative approach using customRequest to bypass actual upload
    const customRequest = ({ file, onSuccess }) => {
        getBase64(file, (url) => {
            setLoading(false);
            setImageUrl(url);
            
            // Manually call onSuccess to mark upload as complete
            setTimeout(() => {
                onSuccess("ok");
            }, 0);
        });
        
        // Pass the change to parent component with the file
        if (onChange) {
            // Create mock info object similar to what antd would provide
            const mockInfo = {
                file: {
                    status: 'done',
                    originFileObj: file,
                    name: file.name,
                    response: { url: 'success' }
                }
            };
            onChange(mockInfo);
        }
    };

    const uploadButton = (
        <button
            style={{
                border: 0,
                background: "none",
            }}
            type="button"
        >
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    return (
        <Upload
            name="avatar"
            listType="picture-circle"
            className="avatar-uploader"
            showUploadList={false}
            customRequest={customRequest}
            beforeUpload={beforeUpload}
            onChange={handleChange}
        >
            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt="avatar"
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center",
                        borderRadius: "50%"
                    }}
                />
            ) : (
                uploadButton
            )}
        </Upload>
    );
};

export default AvatarUpload;