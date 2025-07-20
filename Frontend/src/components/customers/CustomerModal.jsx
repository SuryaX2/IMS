import React from "react";
import { Modal } from "antd";
import CustomerForm from "./CustomerForm";

const CustomerModal = ({
    visible,
    onCancel,
    form,
    onSubmit,
    loading,
    fileList,
    setFileList,
    editingCustomer,
}) => {
    return (
        <Modal
            title={editingCustomer ? "Edit Customer" : "Add New Customer"}
            open={visible}
            onCancel={onCancel}
            footer={null}
            width={800}
            destroyOnClose
        >
            <CustomerForm
                form={form}
                onSubmit={onSubmit}
                onCancel={onCancel}
                loading={loading}
                fileList={fileList}
                setFileList={setFileList}
                editingCustomer={editingCustomer}
            />
        </Modal>
    );
};

export default CustomerModal;
