import React from "react";
import { Row, Col, Button, Divider, Badge, Typography, Tooltip } from "antd";
import {
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    LockOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

const AccountInfoTab = ({ user, isVerified, handleTabChange }) => {
    return (
        <div className="p-6 animate-fadeIn">
            <div className="max-w-xl mb-8">
                <h1 className="mb-4 text-3xl font-bold text-indigo-800 flex items-center">
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
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-300">
                    <Row gutter={[24, 24]}>
                        <Col span={24} md={12}>
                            <p className="block text-sm text-gray-500 mb-1">
                                Username
                            </p>
                            <p className="text-lg font-medium text-gray-800">
                                {user?.username}
                            </p>
                        </Col>
                        <Col span={24} md={12}>
                            <p className="block text-sm text-gray-500 mb-1">
                                Email Address
                            </p>
                            <div className="flex items-center gap-2">
                                <p className="text-lg font-medium text-gray-800">
                                    {user?.email}
                                </p>
                                {isVerified ? (
                                    <Tooltip title="Email Verified">
                                        <CheckCircleOutlined className="text-green-500" />
                                    </Tooltip>
                                ) : (
                                    <Tooltip title="Email Not Verified">
                                        <ExclamationCircleOutlined className="text-red-500" />
                                    </Tooltip>
                                )}
                            </div>
                        </Col>
                        <Col span={24} md={12}>
                            <p className="block text-sm text-gray-500 mb-1">
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
                            <p className="block text-sm text-gray-500 mb-1">
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

            <Divider className="my-8 border-indigo-100" />

            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="mb-2 text-3xl font-bold text-indigo-800">
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
                    className="bg-indigo-600 hover:bg-indigo-700 border-0 rounded-lg shadow-md transition-all duration-300 hover:scale-105 mt-4 md:mt-0"
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
    