import React from "react";
import {
    Card,
    Avatar,
    Badge,
    Spin,
    Upload,
    Button,
    Tooltip,
    Row,
    Col,
} from "antd";
import {
    UserOutlined,
    EditOutlined,
    MailOutlined,
    CheckCircleOutlined,
    CalendarOutlined,
    IdcardOutlined,
    SecurityScanOutlined,
    CameraOutlined,
} from "@ant-design/icons";

const ProfileHeader = ({
    user,
    isVerified,
    avatarLoading,
    handleAvatarUpload,
    customUploadRequest,
    setEditMode,
}) => {
    return (
        <Card className="shadow-xl rounded-xl overflow-hidden mb-8 border-0 bg-gradient-to-r from-indigo-100 via-purple-100 to-blue-100 hover:shadow-2xl transition-all duration-300">
            <div className="flex flex-col md:flex-row items-center p-8 gap-8">
                <div className="relative">
                    <Badge
                        dot={isVerified}
                        color="green"
                        offset={[-4, 4]}
                        size="large"
                        title={
                            isVerified
                                ? "Verified Account"
                                : "Unverified Account"
                        }
                    >
                        <div className="rounded-full p-1.5 bg-gradient-to-r from-indigo-500 to-purple-500">
                            <Spin spinning={avatarLoading}>
                                <Avatar
                                    size={150}
                                    src={user?.avatar}
                                    icon={!user?.avatar && <UserOutlined />}
                                    className="border-4 border-white shadow-xl"
                                />
                            </Spin>
                        </div>
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
                            size="large"
                            className="absolute bottom-2 right-2 bg-indigo-600 hover:bg-indigo-700 shadow-md hover:scale-110 transition-transform duration-300"
                        />
                    </Upload>
                </div>

                <div className="text-center md:text-left flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-4xl font-bold mb-1 text-gray-800">
                                {user?.username}
                            </h1>
                            <div className="flex items-center gap-2 mb-3 justify-center md:justify-start">
                                <MailOutlined className="text-indigo-600" />
                                <p className="text-gray-700">{user?.email}</p>
                                {isVerified && (
                                    <Tooltip title="Email Verified">
                                        <CheckCircleOutlined className="text-green-500" />
                                    </Tooltip>
                                )}
                            </div>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <Button
                                type="primary"
                                icon={<EditOutlined />}
                                onClick={() => setEditMode(true)}
                                className="bg-indigo-600 hover:bg-indigo-700 border-0 rounded-lg shadow-md px-6 hover:scale-105 transition-all duration-300"
                                size="large"
                            >
                                Edit Profile
                            </Button>
                        </div>
                    </div>

                    <Row gutter={16} className="mt-6">
                        <Col span={12} md={8}>
                            <div className="flex items-center gap-3 mb-2 bg-white p-3 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 hover:border-indigo-200">
                                <CalendarOutlined className="text-indigo-500 text-2xl" />
                                <div>
                                    <p className="text-gray-500 text-xs block">
                                        Member Since
                                    </p>
                                    <p className="text-gray-800 font-medium">
                                        {user?.createdAt
                                            ? new Date(
                                                  user.createdAt
                                              ).toLocaleDateString()
                                            : "N/A"}
                                    </p>
                                </div>
                            </div>
                        </Col>
                        <Col span={12} md={8}>
                            <div className="flex items-center gap-3 mb-2 bg-white p-3 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 hover:border-indigo-200">
                                <IdcardOutlined className="text-indigo-500 text-2xl" />
                                <div>
                                    <p className="text-gray-500 text-xs block">
                                        Account Type
                                    </p>
                                    <p className="text-gray-800 font-medium">
                                        {user?.role || "Standard User"}
                                    </p>
                                </div>
                            </div>
                        </Col>
                        <Col span={12} md={8}>
                            <div className="flex items-center gap-3 mb-2 bg-white p-3 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 hover:border-indigo-200">
                                <SecurityScanOutlined className="text-indigo-500 text-2xl" />
                                <div>
                                    <p className="text-gray-500 text-xs block">
                                        Account Status
                                    </p>
                                    <p
                                        className={`font-medium ${isVerified ? "text-green-600" : "text-red-600"}`}
                                    >
                                        {isVerified ? "Verified" : "Unverified"}
                                    </p>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </Card>
    );
};

export default ProfileHeader;
