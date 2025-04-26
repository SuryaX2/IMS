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
        <div className="animate-fadeIn">
            {/* Background Header with Gradient */}
            <div 
                className="h-32 lg:h-56 w-full relative overflow-hidden rounded-t-2xl"
                style={{
                    background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 35%, #7c3aed 70%, #6366f1 100%)',
                }}
            >
                <div className="absolute inset-0 flex items-center px-8">
                    <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm flex items-center justify-center shadow-lg">
                        <UserOutlined className="text-white text-xl" />
                    </div>
                    <div className="ml-4">
                        <h1 className="text-2xl md:text-3xl font-bold text-white m-0">
                            Edit Profile
                        </h1>
                        <Text className="text-white/80">
                            Update your account information
                        </Text>
                    </div>
                </div>
                <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 50L60 45.7C120 41.3 240 32.7 360 30.8C480 29 600 34 720 38.3C840 42.7 960 46.3 1080 43.3C1200 40.3 1320 30.7 1380 25.8L1440 21V101H1380C1320 101 1200 101 1080 101C960 101 840 101 720 101C600 101 480 101 360 101C240 101 120 101 60 101H0V50Z" fill="white"/>
                </svg>
            </div>
            
            <div className="px-4 md:px-8 pb-8 pt-6 flex flex-col items-center">
                {/* <div className="flex flex-row justify-end mb-6">
                    <SecondaryButton
                        onClick={() => setEditMode(false)}
                        icon={<CloseOutlined />}
                        className="rounded-full hover:scale-105 transition-transform shadow-md"
                    />
                </div> */}
                
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 max-w-full">
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
                                <div className="bg-blue-100 p-2 rounded-full flex items-center justify-center">
                                    <UserOutlined className="text-blue-500 text-lg" />
                                </div>
                                <Text strong className="text-gray-700">Username</Text>
                            </div>
                            <UsernameFormItem />
                        </div>
                        
                        <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="bg-blue-100 p-2 rounded-full flex items-center justify-center">
                                    <MailOutlined className="text-blue-500 text-lg" />
                                </div>
                                <Text strong className="text-gray-700">Email Address</Text>
                            </div>
                            <EmailFormItem value={user?.email} />
                            <Text type="secondary" className="text-xs mt-1 block">
                                Email cannot be changed for security reasons
                            </Text>
                        </div>

                        <FormDivider />

                        <Form.Item className="mb-0">
                            <div className="flex flex-col justify-between sm:flex-row gap-3">
                                <PrimaryButton
                                    htmlType="submit"
                                    loading={loading}
                                    icon={<SaveOutlined />}
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
                                >
                                    Save Changes
                                </PrimaryButton>
                                
                                <SecondaryButton
                                    onClick={() => setEditMode(false)}
                                    className="border-gray-300 text-gray-700 rounded-full hover:bg-gray-100 hover:text-gray-800 transition-all duration-300"
                                >
                                    Cancel
                                </SecondaryButton>
                            </div>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default EditProfileForm;