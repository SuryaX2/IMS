import React from "react";
import {
    Card,
    Avatar,
    Badge,
    Spin,
    Upload,
    Button,
    Tooltip,
    Typography,
} from "antd";
import {
    UserOutlined,
    EditOutlined,
    MailOutlined,
    CheckCircleOutlined,
    CalendarOutlined,
    CameraOutlined,
    IdcardOutlined,
    SecurityScanOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

const ProfileHeader = ({
    user,
    isVerified,
    avatarLoading,
    handleAvatarUpload,
    customUploadRequest,
    setEditMode,
}) => {
    return (
        <Card
            className="mb-8 border border-gray-200 rounded-2xl shadow-sm"
            bodyStyle={{ padding: 0 }}
        >
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 px-6 py-8 md:px-8 md:py-10 rounded-t-2xl">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                    <div className="flex justify-center md:justify-start">
                        <div className="relative">
                            <Badge
                                dot={isVerified}
                                color="#10b981"
                                offset={[-8, 8]}
                            >
                                <Spin spinning={avatarLoading}>
                                    <Avatar
                                        size={112}
                                        src={user?.avatar}
                                        icon={!user?.avatar && <UserOutlined />}
                                        className="ring-4 ring-white shadow-lg"
                                    />
                                </Spin>
                            </Badge>
                            <Upload
                                name="avatar"
                                showUploadList={false}
                                customRequest={customUploadRequest}
                                onChange={handleAvatarUpload}
                            >
                                <Button
                                    type="primary"
                                    shape="circle"
                                    icon={<CameraOutlined />}
                                    size="small"
                                    className="absolute bottom-1 right-1 bg-blue-600 hover:bg-blue-700 border-2 border-white shadow-md"
                                />
                            </Upload>
                        </div>
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                                    <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
                                        {user?.username}
                                    </h1>
                                    {isVerified && (
                                        <Tooltip title="Verified Account">
                                            <CheckCircleOutlined className="text-green-500 text-lg" />
                                        </Tooltip>
                                    )}
                                </div>
                                <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600 mb-1">
                                    <MailOutlined className="text-sm" />
                                    <p className="text-sm truncate max-w-xs sm:max-w-md">
                                        {user?.email}
                                    </p>
                                </div>
                                <p className="text-sm text-gray-500 mt-2 hidden md:block">
                                    {user?.role === "admin"
                                        ? "Administrator account with extended privileges"
                                        : "Standard user account with basic access"}
                                </p>
                            </div>
                            <div>
                                <Button
                                    type="primary"
                                    icon={<EditOutlined />}
                                    onClick={() => setEditMode(true)}
                                    className="bg-blue-600 hover:bg-blue-700 border-0 rounded-lg px-6 h-10"
                                >
                                    Edit Profile
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-6 py-6 md:px-8 bg-white rounded-b-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-blue-100 rounded-lg">
                            <CalendarOutlined className="text-blue-600 text-lg" />
                        </div>
                        <div className="min-w-0">
                            <Text className="text-xs text-gray-500 uppercase font-medium block">
                                Member Since
                            </Text>
                            <p className="text-sm font-semibold text-gray-900 truncate">
                                {user?.createdAt
                                    ? new Date(
                                          user.createdAt
                                      ).toLocaleDateString()
                                    : "N/A"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-purple-100 rounded-lg">
                            <IdcardOutlined className="text-purple-600 text-lg" />
                        </div>
                        <div className="min-w-0">
                            <Text className="text-xs text-gray-500 uppercase font-medium block">
                                Account Type
                            </Text>
                            <p className="text-sm font-semibold text-gray-900 capitalize truncate">
                                {user?.role || "Standard User"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div
                            className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg ${
                                isVerified ? "bg-green-100" : "bg-red-100"
                            }`}
                        >
                            <SecurityScanOutlined
                                className={`text-lg ${
                                    isVerified
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}
                            />
                        </div>
                        <div className="min-w-0">
                            <Text className="text-xs text-gray-500 uppercase font-medium block">
                                Status
                            </Text>
                            <p
                                className={`text-sm font-semibold truncate ${
                                    isVerified
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}
                            >
                                {isVerified ? "Verified" : "Unverified"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default ProfileHeader;
