import { useState } from "react";
import { Form, Steps, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../api/api.js";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthCard from "../../components/auth/AuthCard";
import {
    EmailInput,
    PasswordInput,
    OtpInput,
} from "../../components/auth/FormItems";
import AuthButton from "../../components/auth/AuthButton";

const { Step } = Steps;

const ResetPassword = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const navigate = useNavigate();

    const handleSendOTP = async () => {
        if (!email) {
            message.error("Please enter your email address");
            return;
        }

        try {
            setLoading(true);
            const response = await api.post("/users/send-reset-otp", { email });

            if (response.data.success) {
                message.success("OTP sent to your email");
                setOtpSent(true);
                setCurrentStep(1);
            } else {
                message.error(response.data.message || "Failed to send OTP");
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || "Something went wrong";
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!otp) {
            message.error("Please enter the OTP");
            return;
        }

        if (!newPassword) {
            message.error("Please enter a new password");
            return;
        }

        if (newPassword !== confirmPassword) {
            message.error("Passwords do not match");
            return;
        }

        try {
            setLoading(true);
            const response = await api.post("/users/reset-password", {
                email,
                otp,
                newPassword,
            });

            if (response.data.success) {
                message.success("Password reset successfully");
                navigate("/login");
            } else {
                message.error(
                    response.data.message || "Failed to reset password"
                );
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || "Something went wrong";
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        {
            title: "Email",
            content: (
                <Form layout="vertical">
                    <EmailInput
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <AuthButton onClick={handleSendOTP} loading={loading}>
                        Send OTP
                    </AuthButton>
                </Form>
            ),
        },
        {
            title: "Verify",
            content: (
                <Form layout="vertical">
                    <OtpInput
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                    <PasswordInput
                        name="newPassword"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <PasswordInput
                        name="confirmPassword"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <AuthButton onClick={handleResetPassword} loading={loading}>
                        Reset Password
                    </AuthButton>
                </Form>
            ),
        },
    ];

    return (
        <AuthLayout>
            <AuthCard
                title="Reset Password"
                subtitle={
                    otpSent
                        ? "Enter the OTP sent to your email"
                        : "Enter your email to reset password"
                }
            >
                <Steps current={currentStep} className="mb-8">
                    {steps.map((item) => (
                        <Step key={item.title} title={item.title} />
                    ))}
                </Steps>

                <div>{steps[currentStep].content}</div>

                {currentStep === 1 && (
                    <div className="mt-4 text-center">
                        <AuthButton
                            type="link"
                            onClick={handleSendOTP}
                            disabled={loading}
                            className="p-0"
                        >
                            Resend OTP
                        </AuthButton>
                    </div>
                )}

                <div className="text-center mt-4">
                    <span className="text-gray-600">
                        Remember your password?{" "}
                    </span>{" "}
                    <Link
                        to="/login"
                        className="text-blue-500 hover:text-blue-700 font-medium"
                    >
                        Log in
                    </Link>
                </div>
            </AuthCard>
        </AuthLayout>
    );
};

export default ResetPassword;
