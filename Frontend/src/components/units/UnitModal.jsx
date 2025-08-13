import React, { useEffect } from "react";
import { Modal, Form, Input, Button, Space } from "antd";
import { AppstoreOutlined } from "@ant-design/icons";
import { FORM_RULES, MODAL_WIDTH } from "../../utils/category_units/constants";

const UnitModal = ({ visible, onClose, onSubmit, editingUnit, form }) => {
    useEffect(() => {
        if (visible) {
            if (editingUnit) {
                form.setFieldsValue({
                    unit_name: editingUnit.unit_name,
                });
            } else {
                form.resetFields();
            }
        }
    }, [visible, editingUnit, form]);

    const handleSubmit = (values) => {
        onSubmit(values);
    };

    return (
        <Modal
            title={
                <div className="flex items-center space-x-2">
                    <AppstoreOutlined />
                    <span>{editingUnit ? "Edit Unit" : "Add New Unit"}</span>
                </div>
            }
            open={visible}
            onCancel={onClose}
            footer={null}
            width={MODAL_WIDTH.FORM}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                className="mt-4"
            >
                <Form.Item
                    name="unit_name"
                    label="Unit Name"
                    rules={FORM_RULES.UNIT_NAME}
                >
                    <Input
                        placeholder="Enter unit name (e.g., kg, pcs, ltr)"
                        prefix={<AppstoreOutlined />}
                    />
                </Form.Item>

                <Form.Item className="mb-0 flex justify-end">
                    <Space>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button type="primary" htmlType="submit">
                            {editingUnit ? "Update" : "Create"}
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UnitModal;
