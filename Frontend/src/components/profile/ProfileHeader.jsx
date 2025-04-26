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
            className="overflow-hidden mb-8 border-0 shadow-2xl transition-all duration-300 rounded-2xl"
            bodyStyle={{ padding: 0 }}
        >
            {/* Decorative Elements */}
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600 rounded-full opacity-10 transform -translate-x-1/2 translate-y-1/2 z-0"></div>

            {/* Background Header with Mesh Gradient */}
            <div
                className="h-36 sm:h-40 md:h-56 w-full relative overflow-hidden"
                style={{
                    background:
                        "linear-gradient(135deg, #2563eb 0%, #4f46e5 35%, #7c3aed 70%, #6366f1 100%)",
                }}
            >
                <svg
                    className="absolute bottom-0 left-0 w-full"
                    viewBox="0 0 1440 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M0 50L60 45.7C120 41.3 240 32.7 360 30.8C480 29 600 34 720 38.3C840 42.7 960 46.3 1080 43.3C1200 40.3 1320 30.7 1380 25.8L1440 21V101H1380C1320 101 1200 101 1080 101C960 101 840 101 720 101C600 101 480 101 360 101C240 101 120 101 60 101H0V50Z"
                        fill="white"
                    />
                </svg>
            </div>

            <div className="relative px-4 sm:px-6 pb-8 pt-16 sm:pt-4 md:pt-0">
                {/* Avatar Section - Repositioned for mobile */}
                <div className="absolute -top-16 sm:-top-16 md:-top-20 left-1/2 sm:left-8 md:left-10 transform -translate-x-1/2 sm:translate-x-0">
                    <div className="relative flex items-center justify-center">
                        <div className="absolute w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse opacity-50"></div>
                        <div className="rounded-full p-1 bg-white shadow-2xl">
                            <Badge
                                dot={isVerified}
                                color="green"
                                offset={[-4, 4]}
                                size="large"
                            >
                                <Spin spinning={avatarLoading}>
                                    <Avatar
                                        size={128}
                                        src={user?.avatar}
                                        icon={!user?.avatar && <UserOutlined />}
                                        className="border-4 border-white shadow-xl sm:w-28 sm:h-28 md:w-32 md:h-32"
                                    />
                                </Spin>
                            </Badge>
                        </div>

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
                                size="middle"
                                className="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:scale-110 transition-transform duration-300"
                            />
                        </Upload>
                    </div>
                </div>

                {/* User Info Section */}
                <div className="mt-12 sm:mt-16 md:mt-0 md:ml-40 p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="text-center md:text-left">
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-1 flex items-center justify-center md:justify-start flex-wrap">
                                {user?.username}
                                {isVerified && (
                                    <Tooltip title="Verified Account">
                                        <span className="inline-flex ml-2 items-center justify-center bg-green-100 rounded-full p-1">
                                            <CheckCircleOutlined className="text-green-500 text-sm" />
                                        </span>
                                    </Tooltip>
                                )}
                            </h1>
                            <div className="flex items-center gap-2 mb-4 justify-center md:justify-start text-gray-600 text-sm sm:text-base">
                                <MailOutlined className="text-blue-500" />
                                <p className="truncate max-w-xs sm:max-w-md">
                                    {user?.email}
                                </p>
                            </div>
                            <p className="text-gray-500 max-w-md hidden md:block">
                                {user?.role === "admin"
                                    ? "Administrator account with extended privileges"
                                    : "Standard user account with basic access"}
                            </p>
                        </div>
                        <div className="mt-4 md:mt-0 flex justify-center md:justify-end">
                            <Button
                                type="primary"
                                icon={<EditOutlined />}
                                onClick={() => setEditMode(true)}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0 rounded-full shadow-md px-6 h-10 flex items-center gap-1"
                            >
                                Edit Profile
                            </Button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-6">
                        <div className="bg-white rounded-xl shadow-md p-3 sm:p-4 border border-gray-100 hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px] group">
                            <div className="flex items-center gap-3">
                                <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-2 sm:p-3 rounded-full group-hover:bg-blue-200 transition-colors duration-300 flex items-center">
                                    <CalendarOutlined className="text-blue-500 text-base sm:text-lg" />
                                </div>
                                <div>
                                    <Text className="text-gray-500 text-xs uppercase tracking-wider">
                                        Member Since
                                    </Text>
                                    <p className="text-gray-800 font-medium text-sm sm:text-base">
                                        {user?.createdAt
                                            ? new Date(
                                                  user.createdAt
                                              ).toLocaleDateString()
                                            : "N/A"}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-md p-3 sm:p-4 border border-gray-100 hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px] group">
                            <div className="flex items-center gap-3">
                                <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-2 sm:p-3 rounded-full group-hover:bg-purple-200 transition-colors duration-300 flex items-center">
                                    <IdcardOutlined className="text-purple-500 text-base sm:text-lg" />
                                </div>
                                <div>
                                    <Text className="text-gray-500 text-xs uppercase tracking-wider">
                                        Account Type
                                    </Text>
                                    <p className="text-gray-800 font-medium text-sm sm:text-base">
                                        {user?.role || "Standard User"}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-md p-3 sm:p-4 border border-gray-100 hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px] group">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`p-2 sm:p-3 rounded-full transition-colors duration-300 ${
                                        isVerified
                                            ? "bg-gradient-to-br from-green-100 to-green-200 group-hover:bg-green-200 flex items-center"
                                            : "bg-gradient-to-br from-red-100 to-red-200 group-hover:bg-red-200 flex items-center"
                                    }`}
                                >
                                    <SecurityScanOutlined
                                        className={
                                            isVerified
                                                ? "text-green-500 text-base sm:text-lg"
                                                : "text-red-500 text-base sm:text-lg"
                                        }
                                    />
                                </div>
                                <div>
                                    <Text className="text-gray-500 text-xs uppercase tracking-wider">
                                        Account Status
                                    </Text>
                                    <p
                                        className={
                                            isVerified
                                                ? "text-green-600 font-medium text-sm sm:text-base"
                                                : "text-red-600 font-medium text-sm sm:text-base"
                                        }
                                    >
                                        {isVerified ? "Verified" : "Unverified"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default ProfileHeader;
