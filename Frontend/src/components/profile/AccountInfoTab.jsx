import React from "react";
import { Button, Typography, Card } from "antd";
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
        <div className="max-w-6xl mx-auto">
            <div className="px-4 md:px-6 py-6 md:py-8">
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">
                        Account Information
                    </h1>
                    <Text className="text-gray-600">
                        View and manage your account details
                    </Text>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-6">
                    <Card className="rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                                <UserOutlined className="text-blue-600 text-lg" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <Text className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">
                                    Username
                                </Text>
                                <Text className="text-base font-medium text-gray-900 block truncate">
                                    {user?.username || "Not set"}
                                </Text>
                            </div>
                        </div>
                    </Card>

                    <Card className="rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                                <MailOutlined className="text-indigo-600 text-lg" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <Text className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">
                                    Email Address
                                </Text>
                                <Text className="text-base font-medium text-gray-900 block truncate">
                                    {user?.email || "Not set"}
                                </Text>
                            </div>
                        </div>
                    </Card>

                    <Card className="rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                                <CalendarOutlined className="text-purple-600 text-lg" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <Text className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">
                                    Member Since
                                </Text>
                                <Text className="text-base font-medium text-gray-900 block">
                                    {user?.createdAt
                                        ? new Date(
                                              user.createdAt
                                          ).toLocaleDateString("en-US", {
                                              year: "numeric",
                                              month: "long",
                                              day: "numeric",
                                          })
                                        : "N/A"}
                                </Text>
                            </div>
                        </div>
                    </Card>

                    <Card className="rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200">
                        <div className="flex items-start gap-3">
                            <div
                                className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${isVerified ? "bg-green-50" : "bg-red-50"}`}
                            >
                                {isVerified ? (
                                    <CheckCircleOutlined className="text-green-600 text-lg" />
                                ) : (
                                    <CloseCircleOutlined className="text-red-600 text-lg" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <Text className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">
                                    Verification Status
                                </Text>
                                <Text
                                    className={`text-base font-medium block ${isVerified ? "text-green-700" : "text-red-700"}`}
                                >
                                    {isVerified ? "Verified" : "Unverified"}
                                </Text>
                            </div>
                        </div>
                    </Card>
                </div>

                {!isVerified && (
                    <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                                <InfoCircleOutlined className="text-amber-600 text-sm" />
                            </div>
                            <div>
                                <Title
                                    level={5}
                                    className="text-amber-900 m-0 mb-1 text-sm font-semibold"
                                >
                                    Account Verification Required
                                </Title>
                                <Text className="text-amber-800 text-sm">
                                    Please verify your account to unlock all
                                    features and ensure account security.
                                </Text>
                            </div>
                        </div>
                    </div>
                )}

                <Card className="rounded-lg shadow-sm border border-gray-200 bg-gradient-to-br from-gray-50 to-white">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center">
                                <LockOutlined className="text-white text-xl" />
                            </div>
                            <div>
                                <Title
                                    level={5}
                                    className="text-gray-900 m-0 mb-1 font-semibold"
                                >
                                    Security Settings
                                </Title>
                                <Text className="text-gray-600 text-sm">
                                    Update your password to keep your account
                                    secure
                                </Text>
                            </div>
                        </div>
                        <Button
                            type="primary"
                            onClick={() => handleTabChange("2")}
                            className="bg-blue-600 hover:bg-blue-700 border-0 rounded-lg shadow-sm h-10 px-6 font-medium"
                            icon={<LockOutlined />}
                        >
                            Change Password
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AccountInfoTab;
