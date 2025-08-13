import React, { useEffect } from "react";
import { Modal, Form, Input, Button, Space } from "antd";
import { TagsOutlined } from "@ant-design/icons";
import { FORM_RULES, MODAL_WIDTH } from "../../utils/category_units/constants";

const CategoryModal = ({
    visible,
    onClose,
    onSubmit,
    editingCategory,
    form,
}) => {
    useEffect(() => {
        if (visible) {
            if (editingCategory) {
                form.setFieldsValue({
                    category_name: editingCategory.category_name,
                });
            } else {
                form.resetFields();
            }
        }
    }, [visible, editingCategory, form]);

    const handleSubmit = (values) => {
        onSubmit(values);
    };

    return (
        <Modal
            title={
                <div className="text-lg font-medium text-gray-800">
                    {editingCategory ? "Edit Category" : "Add New Category"}
                </div>
            }
            open={visible}
            onCancel={onClose}
            footer={null}
            width={Math.min(480, window.innerWidth * 0.9)}
            centered
            className="category-modal"
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
                    name="category_name"
                    label={
                        <span className="text-sm font-medium text-gray-700">
                            Category Name
                        </span>
                    }
                    rules={FORM_RULES.CATEGORY_NAME}
                    className="mb-6"
                >
                    <Input
                        placeholder="Enter category name"
                        className="h-11 rounded-md border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                        prefix={
                            <TagsOutlined className="text-gray-400 text-sm" />
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
                            className="h-10 px-6 rounded-md bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 transition-colors duration-200"
                        >
                            {editingCategory
                                ? "Update Category"
                                : "Create Category"}
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CategoryModal;
