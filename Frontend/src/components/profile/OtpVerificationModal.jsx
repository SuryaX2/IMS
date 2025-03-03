import React from "react";
import { Modal, Form, Input, Button, Typography } from "antd";
import { ClockCircleOutlined, SafetyOutlined } from "@ant-design/icons";

const { Text } = Typography;

const OtpVerificationModal = ({
    showOtpModal,
    setShowOtpModal,
    otpForm,
    handleVerifyOtp,
    handleSendOtp,
    loading,
    newPasswordData,
}) => {
    return (
        <Modal
            title={
                <div className="flex items-center gap-2 p-2">
                    <SafetyOutlined className="text-indigo-500 text-2xl" />
                    <span className="text-indigo-800 font-bold text-xl">
                        Security Verification
                    </span>
                </div>
            }
            open={showOtpModal}
            onCancel={() => setShowOtpModal(false)}
            footer={null}
            centered
            className="rounded-2xl overflow-hidden"
            width={420}
            styles={{
                padding: "24px",
            }}
        >
            <Form form={otpForm} layout="vertical" onFinish={handleVerifyOtp}>
                <div className="bg-white p-4 rounded-xl mb-6 border-l-4 border-indigo-500 shadow-md">
                    <div className="flex items-start gap-3">
                        <ClockCircleOutlined className="text-indigo-500 text-xl mt-1" />
                        <div>
                            <Text
                                strong
                                className="text-indigo-700 block mb-1 text-lg"
                            >
                                {newPasswordData
                                    ? "Verify Password Change"
                                    : "Email Verification"}
                            </Text>
                            <Text className="text-gray-600">
                                {newPasswordData
                                    ? "To complete your password change, please enter the OTP sent to your email."
                                    : "Please enter the verification code sent to your email."}
                            </Text>
                        </div>
                    </div>
                </div>

                <Form.Item
                    name="otp"
                    rules={[
                        {
                            required: true,
                            message: "Please input the OTP!",
                        },
                    ]}
                >
                    <Input
                        placeholder="Enter 6-digit OTP"
                        className="text-center text-xl rounded-lg h-14 font-mono"
                        maxLength={6}
                        size="large"
                    />
                </Form.Item>

                <div className="flex justify-between mt-6">
                    <Button
                        onClick={() => handleSendOtp()}
                        className="text-indigo-600 hover:text-indigo-700 hover:border-indigo-500 rounded-lg"
                    >
                        Resend OTP
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        className="bg-indigo-600 hover:bg-indigo-700 border-0 rounded-lg shadow-md h-10 px-6"
                    >
                        Verify
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default OtpVerificationModal;
