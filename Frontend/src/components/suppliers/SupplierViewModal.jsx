import React from "react";
import { Modal, Button, Avatar, Tag, Descriptions } from "antd";
import { UserOutlined } from "@ant-design/icons";

const SupplierViewModal = ({ visible, onCancel, supplier, onEdit }) => {
    if (!supplier) return null;

    return (
        <Modal
            title="Supplier Details"
            open={visible}
            onCancel={onCancel}
            footer={[
                <Button key="close" onClick={onCancel}>
                    Close
                </Button>,
                <Button
                    key="edit"
                    type="primary"
                    onClick={() => {
                        onCancel();
                        onEdit(supplier);
                    }}
                >
                    Edit Supplier
                </Button>,
            ]}
            width={600}
        >
            <div>
                <div className="text-center mb-4">
                    <Avatar
                        size={80}
                        src={
                            supplier.photo !== "default-supplier.png"
                                ? supplier.photo
                                : null
                        }
                        icon={<UserOutlined />}
                    />
                    <h3 className="mt-2 mb-0">{supplier.name}</h3>
                    <Tag color={supplier.type === "company" ? "blue" : "green"}>
                        {supplier.type?.toUpperCase() || "N/A"}
                    </Tag>
                </div>

                <Descriptions column={1} bordered>
                    <Descriptions.Item label="Email">
                        {supplier.email}
                    </Descriptions.Item>
                    <Descriptions.Item label="Phone">
                        {supplier.phone}
                    </Descriptions.Item>
                    <Descriptions.Item label="Address">
                        {supplier.address}
                    </Descriptions.Item>
                    <Descriptions.Item label="Shop Name">
                        {supplier.shopname || "-"}
                    </Descriptions.Item>
                    {supplier.bank_name && (
                        <>
                            <Descriptions.Item label="Bank Name">
                                {supplier.bank_name}
                            </Descriptions.Item>
                            <Descriptions.Item label="Account Holder">
                                {supplier.account_holder || "-"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Account Number">
                                {supplier.account_number || "-"}
                            </Descriptions.Item>
                        </>
                    )}
                    <Descriptions.Item label="Created">
                        {new Date(supplier.createdAt).toLocaleDateString()}
                    </Descriptions.Item>
                </Descriptions>
            </div>
        </Modal>
    );
};

export default SupplierViewModal;
