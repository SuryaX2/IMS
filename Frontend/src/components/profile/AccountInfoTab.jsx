import React from "react";
import { Row, Col, Button, Divider, Badge, Typography } from "antd";
import { LockOutlined } from "@ant-design/icons";

const { Text } = Typography;

const AccountInfoTab = ({ user, isVerified, handleTabChange }) => {
    return (
        <div className="md:p-8 animate-fadeIn">
            <div className="md:max-w-xl w-full mb-8">
                <h1 className="mb-4 text-2xl md:text-3xl font-bold text-indigo-800 flex items-center">
                    <span className="mr-2">Account Details</span>
                    <Badge
                        status={isVerified ? "success" : "error"}
                        title={
                            isVerified
                                ? "Verified Account"
                                : "Unverified Account"
                        }
                    />
                </h1>
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl shadow-lg p-6 border border-indigo-100 hover:shadow-xl transition-all duration-300">
                    <Row gutter={[16, 16]} wrap>
                        <Col span={24} md={12}>
                            <p className="block text-sm text-indigo-500 mb-1 font-medium">
                                Username
                            </p>
                            <p className="text-lg font-medium text-gray-800">
                                {user?.username}
                            </p>
                        </Col>
                        <Col span={24} md={12}>
                            <p className="block text-sm text-indigo-500 mb-1 font-medium">
                                Email Address
                            </p>
                            <div className="flex items-center gap-2">
                                <p className="text-lg font-medium text-gray-800">
                                    {user?.email}
                                </p>
                            </div>
                        </Col>
                        <Col span={24} md={12}>
                            <p className="block text-sm text-indigo-500 mb-1 font-medium">
                                Account Created
                            </p>
                            <p className="text-lg font-medium text-gray-800">
                                {user?.createdAt
                                    ? new Date(
                                          user.createdAt
                                      ).toLocaleDateString()
                                    : "N/A"}
                            </p>
                        </Col>
                        <Col span={24} md={12}>
                            <p className="block text-sm text-indigo-500 mb-1 font-medium">
                                Account Status
                            </p>
                            <Badge
                                status={isVerified ? "success" : "error"}
                                text={
                                    <Text
                                        className={
                                            isVerified
                                                ? "text-green-600 text-lg"
                                                : "text-red-600 text-lg"
                                        }
                                    >
                                        {isVerified ? "Verified" : "Unverified"}
                                    </Text>
                                }
                            />
                        </Col>
                    </Row>
                </div>
            </div>

            <Divider className="my-8 border-indigo-200" />

            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-2xl shadow-md">
                <div>
                    <h1 className="mb-2 text-2xl md:text-3xl font-bold text-indigo-800">
                        Security Options
                    </h1>
                    <p className="text-gray-600 max-w-md">
                        Manage your password and account security settings. We
                        recommend changing your password regularly.
                    </p>
                </div>
                <Button
                    type="primary"
                    onClick={() => handleTabChange("2")}
                    className="bg-indigo-600 hover:bg-indigo-700 border-0 rounded-full shadow-lg transition-all duration-300 hover:scale-105 mt-4 md:mt-0 h-12 px-6 flex items-center justify-center"
                    size="large"
                    icon={<LockOutlined />}
                >
                    Change Password
                </Button>
            </div>
        </div>
    );
};

export default AccountInfoTab;
