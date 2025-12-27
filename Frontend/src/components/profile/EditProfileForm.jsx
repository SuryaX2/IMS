import React from "react";
import { Form, Typography } from "antd";
import {
    SaveOutlined,
    CloseOutlined,
    UserOutlined,
    MailOutlined,
    LockOutlined,
} from "@ant-design/icons";
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
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-5 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-sm">
                            <UserOutlined className="text-white text-xl" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 m-0 leading-tight">
                                Edit Profile
                            </h2>
                            <Text className="text-sm text-gray-600">
                                Update your account information
                            </Text>
                        </div>
                    </div>
                </div>

                <div className="p-6 sm:p-8">
                    <Form
                        form={profileForm}
                        layout="vertical"
                        onFinish={handleProfileUpdate}
                    >
                        <div className="space-y-6">
                            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                                <div className="flex items-center gap-2.5 mb-4">
                                    <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                                        <UserOutlined className="text-blue-600 text-base" />
                                    </div>
                                    <div>
                                        <Text
                                            strong
                                            className="text-sm text-gray-900 block leading-none"
                                        >
                                            Username
                                        </Text>
                                        <Text className="text-xs text-gray-500">
                                            Choose a unique username
                                        </Text>
                                    </div>
                                </div>
                                <UsernameFormItem />
                            </div>

                            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                                <div className="flex items-center gap-2.5 mb-4">
                                    <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                                        <MailOutlined className="text-gray-400 text-base" />
                                    </div>
                                    <div>
                                        <Text
                                            strong
                                            className="text-sm text-gray-900 block leading-none"
                                        >
                                            Email Address
                                        </Text>
                                        <Text className="text-xs text-gray-500 flex items-center gap-1">
                                            <LockOutlined className="text-xs" />
                                            Cannot be changed
                                        </Text>
                                    </div>
                                </div>
                                <EmailFormItem value={user?.email} />
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <Form.Item className="mb-0">
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                    <PrimaryButton
                                        htmlType="submit"
                                        loading={loading}
                                        icon={<SaveOutlined />}
                                        className="sm:flex-none bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0 rounded-lg shadow-sm h-11 font-medium"
                                    >
                                        Save Changes
                                    </PrimaryButton>

                                    <SecondaryButton
                                        onClick={() => setEditMode(false)}
                                        icon={<CloseOutlined />}
                                        className="sm:flex-none border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 h-11 font-medium"
                                    >
                                        Cancel
                                    </SecondaryButton>
                                </div>
                            </Form.Item>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default EditProfileForm;
