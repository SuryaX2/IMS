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
                <div className="text-lg font-medium text-gray-800">
                    {editingUnit ? "Edit Unit" : "Add New Unit"}
                </div>
            }
            open={visible}
            onCancel={onClose}
            footer={null}
            width={Math.min(480, window.innerWidth * 0.9)}
            centered
            className="unit-modal"
            styles={{
                body: { padding: "24px" },
                header: {
                    borderBottom: "1px solid #f0f0f0",
                    paddingBottom: "16px",
                },
            }}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                className="space-y-6"
                size="large"
            >
                <Form.Item
                    name="unit_name"
                    label={
                        <span className="text-sm font-medium text-gray-700">
                            Unit Name
                        </span>
                    }
                    rules={FORM_RULES.UNIT_NAME}
                    className="mb-6"
                >
                    <Input
                        placeholder="Enter unit name (e.g., kg, pcs, ltr)"
                        className="h-11 rounded-md border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                        prefix={
                            <AppstoreOutlined className="text-gray-400 text-sm" />
                        }
                    />
                </Form.Item>

                <Form.Item className="mb-0">
                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-gray-100">
                        <Button
                            onClick={onClose}
                            className="h-10 px-6 rounded-md border-gray-300 hover:border-gray-400 transition-colors duration-200"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="h-10 px-6 rounded-md bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700 transition-colors duration-200"
                        >
                            {editingUnit ? "Update Unit" : "Create Unit"}
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UnitModal;
