import React from "react";
import { Row, Col, Button, Divider, Badge, Typography, Card } from "antd";
import {
    LockOutlined,
    InfoCircleOutlined,
    CalendarOutlined,
    UserOutlined,
    MailOutlined,
    KeyOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;

const AccountInfoTab = ({ user, isVerified, handleTabChange }) => {
    return (
        <div className="p-4 md:p-8 animate-fadeIn">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-full shadow-md">
                        <InfoCircleOutlined className="text-white text-lg" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 m-0">
                            Account Details
                        </h1>
                        <Text className="text-gray-500">
                            View and manage your account information
                        </Text>
                    </div>
                </div>
            </div>

            {/* Account Info Cards in Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <Card
                    className="rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border-0 overflow-hidden transform hover:translate-y-[-3px]"
                    bodyStyle={{ padding: 0 }}
                >
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-3">
                        <Title
                            level={5}
                            className="text-white m-0 flex items-center gap-2"
                        >
                            <UserOutlined />
                            <span>Username</span>
                        </Title>
                    </div>
                    <div className="p-5">
                        <Text className="text-xl font-medium text-gray-800 block">
                            {user?.username || "Not set"}
                        </Text>
                        <Text className="text-gray-500 text-sm block mt-1">
                            Your unique identifier on the platform
                        </Text>
                    </div>
                </Card>

                <Card
                    className="rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border-0 overflow-hidden transform hover:translate-y-[-3px]"
                    bodyStyle={{ padding: 0 }}
                >
                    <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-5 py-3">
                        <Title
                            level={5}
                            className="text-white m-0 flex items-center gap-2"
                        >
                            <MailOutlined />
                            <span>Email Address</span>
                        </Title>
                    </div>
                    <div className="p-5">
                        <Text className="text-xl font-medium text-gray-800 block">
                            {user?.email || "Not set"}
                        </Text>
                        <Text className="text-gray-500 text-sm block mt-1">
                            Used for account verification and notifications
                        </Text>
                    </div>
                </Card>

                <Card
                    className="rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border-0 overflow-hidden transform hover:translate-y-[-3px]"
                    bodyStyle={{ padding: 0 }}
                >
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-5 py-3">
                        <Title
                            level={5}
                            className="text-white m-0 flex items-center gap-2"
                        >
                            <CalendarOutlined />
                            <span>Account Created</span>
                        </Title>
                    </div>
                    <div className="p-5">
                        <Text className="text-xl font-medium text-gray-800 block">
                            {user?.createdAt
                                ? new Date(user.createdAt).toLocaleDateString(
                                      "en-US",
                                      {
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                      }
                                  )
                                : "N/A"}
                        </Text>
                        <Text className="text-gray-500 text-sm block mt-1">
                            The date your account was created
                        </Text>
                    </div>
                </Card>

                <Card
                    className={`rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border-0 overflow-hidden transform hover:translate-y-[-3px]`}
                    bodyStyle={{ padding: 0 }}
                >
                    <div
                        className={`px-5 py-3 ${isVerified ? "bg-gradient-to-r from-green-500 to-green-600" : "bg-gradient-to-r from-red-500 to-red-600"}`}
                    >
                        <Title
                            level={5}
                            className="text-white m-0 flex items-center gap-2"
                        >
                            <KeyOutlined />
                            <span>Account Status</span>
                        </Title>
                    </div>
                    <div className="p-5">
                        <div className="flex items-center gap-3">
                            {isVerified ? (
                                <>
                                    <div className="bg-green-100 p-2 rounded-full">
                                        <CheckCircleOutlined className="text-green-500 text-lg" />
                                    </div>
                                    <div>
                                        <Text className="text-xl font-medium text-green-600 block">
                                            Verified
                                        </Text>
                                        <Text className="text-gray-500 text-sm block mt-1">
                                            Your account is verified and secure
                                        </Text>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="bg-red-100 p-2 rounded-full">
                                        <CloseCircleOutlined className="text-red-500 text-lg" />
                                    </div>
                                    <div>
                                        <Text className="text-xl font-medium text-red-600 block">
                                            Unverified
                                        </Text>
                                        <Text className="text-gray-500 text-sm block mt-1">
                                            Please verify your account for full
                                            access
                                        </Text>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </Card>
            </div>

            <Divider className="my-8 border-gray-200" />

            {/* Security Options Card */}
            <Card className="w-full rounded-2xl shadow-lg border-0 overflow-hidden bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 p-2">
                    <div className="flex gap-4 items-start">
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-4 rounded-full shadow-md">
                            <LockOutlined className="text-white text-xl" />
                        </div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                                Security Options
                            </h2>
                            <p className="text-gray-600 max-w-md">
                                Protect your account by regularly updating your
                                password. Enhanced security helps prevent
                                unauthorized access.
                            </p>
                        </div>
                    </div>
                    <Button
                        type="primary"
                        onClick={() => handleTabChange("2")}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0 rounded-full shadow-lg transition-all duration-300 hover:scale-105 h-12 px-8 flex items-center justify-center"
                        size="large"
                        icon={<LockOutlined />}
                    >
                        Change Password
                    </Button>
                </div>
            </Card>

            {/* Verification Banner (only show if unverified) */}
            {!isVerified && (
                <div className="mt-8 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                        <div className="bg-amber-100 p-2 rounded-full mt-1">
                            <InfoCircleOutlined className="text-amber-600" />
                        </div>
                        <div>
                            <Title
                                level={5}
                                className="text-amber-800 m-0 mb-1"
                            >
                                Verify Your Account
                            </Title>
                            <Text className="text-amber-700">
                                Your account is currently unverified. Complete
                                verification to unlock all features.
                            </Text>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountInfoTab;
