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
                <div className="flex items-center space-x-2">
                    <TagsOutlined />
                    <span>
                        {editingCategory ? "Edit Category" : "Add New Category"}
                    </span>
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
                    name="category_name"
                    label="Category Name"
                    rules={FORM_RULES.CATEGORY_NAME}
                >
                    <Input
                        placeholder="Enter category name"
                        prefix={<TagsOutlined />}
                    />
                </Form.Item>

                <Form.Item className="mb-0 flex justify-end">
                    <Space>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button type="primary" htmlType="submit">
                            {editingCategory ? "Update" : "Create"}
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CategoryModal;
