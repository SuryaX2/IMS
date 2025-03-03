import React from "react";
import { Form, Typography } from "antd";
import { SaveOutlined, CloseOutlined } from "@ant-design/icons";
import { FormDivider, PrimaryButton, SecondaryButton } from "../common/UI";
import { EmailFormItem, UsernameFormItem } from "../common/FormItems";

EmailFormItem;

const { Text } = Typography;

const EditProfileForm = ({
    profileForm,
    handleProfileUpdate,
    loading,
    setEditMode,
    user,
}) => {
    return (
        <div className="px-4 md:px-8 py-6">
            <div className="flex flex-row justify-between items-start md:items-center mb-6">
                <h1 className="mb-4 md:mb-0 text-2xl md:text-3xl font-bold text-indigo-800">
                    Edit Profile
                </h1>
                <SecondaryButton
                    onClick={() => setEditMode(false)}
                    icon={<CloseOutlined />}
                />
            </div>
            <Form
                form={profileForm}
                layout="vertical"
                onFinish={handleProfileUpdate}
                className="max-w-lg"
            >
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <UsernameFormItem />
                    <EmailFormItem value={user?.email} />
                    <Text type="secondary" className="text-xs mt-1 block">
                        Email cannot be changed for security reasons
                    </Text>

                    <FormDivider />

                    <Form.Item>
                        <PrimaryButton
                            htmlType="submit"
                            loading={loading}
                            icon={<SaveOutlined />}
                            className="mb-2 md:mr-2"
                        >
                            Save Changes
                        </PrimaryButton>
                    </Form.Item>
                </div>
            </Form>
        </div>
    );
};

export default EditProfileForm;
