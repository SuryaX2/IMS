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
        <Card 
            className="overflow-hidden mb-8 border-0 shadow-2xl transition-all duration-300 rounded-3xl"
            style={{
                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #3B82F6 100%)',
            }}
        >
            <div className="flex flex-col md:flex-row items-center p-6 md:p-10 gap-8">
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
                        <div className="rounded-full p-2 bg-white/30 backdrop-blur-sm">
                            <Spin spinning={avatarLoading}>
                                <Avatar
                                    size={120}
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
                            className="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:scale-110 transition-transform duration-300"
                        />
                    </Upload>
                </div>

                <div className="text-center md:text-left flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-1 text-white">
                                {user?.username}
                            </h1>
                            <div className="flex items-center gap-2 mb-4 justify-center md:justify-start text-white/90">
                                <MailOutlined className="text-white" />
                                <p>{user?.email}</p>
                                {isVerified && (
                                    <Tooltip title="Email Verified">
                                        <CheckCircleOutlined className="text-green-400" />
                                    </Tooltip>
                                )}
                            </div>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <Button
                                type="default"
                                icon={<EditOutlined />}
                                onClick={() => setEditMode(true)}
                                className="border-white text-indigo-700 hover:text-indigo-800 bg-white hover:bg-white/90 rounded-full shadow-md px-6 hover:scale-105 transition-all duration-300"
                                size="large"
                            >
                                Edit Profile
                            </Button>
                        </div>
                    </div>

                    <Row gutter={[16, 16]} className="mt-6">
                        <Col xs={24} sm={12} md={8}>
                            <div className="flex items-center gap-3 mb-2 bg-white/20 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-white/30 hover:bg-white/30 transition-all duration-300">
                                <CalendarOutlined className="text-white text-2xl" />
                                <div>
                                    <p className="text-white/70 text-xs block">
                                        Member Since
                                    </p>
                                    <p className="text-white font-medium">
                                        {user?.createdAt
                                            ? new Date(
                                                  user.createdAt
                                              ).toLocaleDateString()
                                            : "N/A"}
                                    </p>
                                </div>
                            </div>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <div className="flex items-center gap-3 mb-2 bg-white/20 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-white/30 hover:bg-white/30 transition-all duration-300">
                                <IdcardOutlined className="text-white text-2xl" />
                                <div>
                                    <p className="text-white/70 text-xs block">
                                        Account Type
                                    </p>
                                    <p className="text-white font-medium">
                                        {user?.role || "Standard User"}
                                    </p>
                                </div>
                            </div>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <div className="flex items-center gap-3 mb-2 bg-white/20 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-white/30 hover:bg-white/30 transition-all duration-300">
                                <SecurityScanOutlined className="text-white text-2xl" />
                                <div>
                                    <p className="text-white/70 text-xs block">
                                        Account Status
                                    </p>
                                    <p
                                        className={`font-medium ${isVerified ? "text-green-300" : "text-red-300"}`}
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