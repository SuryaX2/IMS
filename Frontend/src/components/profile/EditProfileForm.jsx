import React from "react";
import { Form, Input, Button, Divider, Typography } from "antd";
import { UserOutlined, MailOutlined, SaveOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const EditProfileForm = ({
    profileForm,
    handleProfileUpdate,
    loading,
    setEditMode,
    user,
}) => {
    return (
        <div className="px-6 py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="mb-4 text-3xl font-bold text-indigo-800">
                    Edit Profile
                </h1>
                <Button
                    type="primary"
                    onClick={() => setEditMode(false)}
                    className="bg-indigo-600 hover:bg-indigo-700 border-0 rounded-lg shadow-md px-6 hover:scale-105 transition-all duration-300"
                    size="large"
                >
                    Cancel
                </Button>
            </div>
            <Form
                form={profileForm}
                layout="vertical"
                onFinish={handleProfileUpdate}
                className="max-w-lg"
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: "Please input your username!",
                        },
                    ]}
                >
                    <Input
                        prefix={<UserOutlined className="text-indigo-400" />}
                        placeholder="Username"
                        size="large"
                        className="rounded-lg"
                    />
                </Form.Item>

                <Form.Item label="Email">
                    <Input
                        prefix={<MailOutlined className="text-indigo-400" />}
                        value={user?.email}
                        disabled
                        className="bg-gray-50 text-gray-500 rounded-lg"
                        size="large"
                    />
                    <Text type="secondary" className="text-xs mt-1 block">
                        Email cannot be changed for security reasons
                    </Text>
                </Form.Item>

                <Divider />

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        icon={<SaveOutlined />}
                        className="bg-indigo-600 hover:bg-indigo-700 border-0 rounded-lg mr-2"
                        size="large"
                    >
                        Save Changes
                    </Button>
                    <Button
                        onClick={() => {
                            setEditMode(false);
                            profileForm.setFieldsValue({
                                username: user?.username,
                            });
                        }}
                        size="large"
                        className="rounded-lg"
                    >
                        Cancel
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default EditProfileForm;
