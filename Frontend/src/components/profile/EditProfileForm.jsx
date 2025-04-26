import React from "react";
import { Form, Typography } from "antd";
import { SaveOutlined, CloseOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";
import { FormDivider, PrimaryButton, SecondaryButton } from "../common/UI";
import { EmailFormItem, UsernameFormItem } from "../common/FormItems";

const { Text } = Typography;

const EditProfileForm = ({
    profileForm,
    handleProfileUpdate,
    loading,
    setEditMode,
    user,
}) => {
    return (
        <div className="p-4 md:p-8 animate-fadeIn">
            <div className="flex flex-row justify-between items-center mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                    <UserOutlined className="text-blue-500" />
                    <span>Edit Profile</span>
                </h1>
                <SecondaryButton
                    onClick={() => setEditMode(false)}
                    icon={<CloseOutlined />}
                    className="rounded-lg hover:scale-105 transition-transform"
                />
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 max-w-lg">
                <div className="bg-blue-50 rounded-lg p-4 mb-6 border-l-4 border-blue-500">
                    <Text className="text-blue-700">
                        Update your profile information below. Your email address is used for account verification and cannot be changed.
                    </Text>
                </div>
                
                <Form
                    form={profileForm}
                    layout="vertical"
                    onFinish={handleProfileUpdate}
                    className="space-y-4"
                >
                    <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                        <div className="flex items-center gap-2 mb-2">
                            <UserOutlined className="text-blue-500" />
                            <Text strong className="text-gray-700">Username</Text>
                        </div>
                        <UsernameFormItem />
                    </div>
                    
                    <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                        <div className="flex items-center gap-2 mb-2">
                            <MailOutlined className="text-blue-500" />
                            <Text strong className="text-gray-700">Email Address</Text>
                        </div>
                        <EmailFormItem value={user?.email} />
                        <Text type="secondary" className="text-xs mt-1 block">
                            Email cannot be changed for security reasons
                        </Text>
                    </div>

                    <FormDivider />

                    <Form.Item className="mb-0">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <PrimaryButton
                                htmlType="submit"
                                loading={loading}
                                icon={<SaveOutlined />}
                                className="bg-blue-600 hover:bg-blue-700 rounded-lg"
                            >
                                Save Changes
                            </PrimaryButton>
                            
                            <SecondaryButton
                                onClick={() => setEditMode(false)}
                                className="border-gray-300 text-gray-700 rounded-lg"
                            >
                                Cancel
                            </SecondaryButton>
                        </div>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default EditProfileForm;