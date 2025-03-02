import { useState } from "react";
import { Form, Divider } from "antd";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthCard from "../../components/auth/AuthCard";
import {
    EmailInput,
    PasswordInput,
    UsernameInput,
} from "../../components/auth/FormItems";
import AuthButton from "../../components/auth/AuthButton";
import AvatarUpload from "../../components/common/AvatarUpload";
import { api } from "../../api/api";

const Signup = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [avatarFile, setAvatarFile] = useState(null);
    const navigate = useNavigate();

    const handleAvatarChange = (info) => {
        if (info.file.status === "done") {
            setAvatarFile(info.file.originFileObj);
        }
    };

    const onFinish = async (values) => {
        if (!avatarFile) {
            toast.error("Please upload an avatar");
            return;
        }

        try {
            setLoading(true);

            // Create FormData for file upload
            const formData = new FormData();
            formData.append("username", values.username);
            formData.append("email", values.email);
            formData.append("password", values.password);
            formData.append("avatar", avatarFile);

            // Send the form data to the backend
            const response = await api.post(`/users/register`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data.success) {
                toast.success("Your account has been created successfully.");
                navigate("/login");
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                "Something went wrong during signup";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <AuthCard
                title="Create an Account"
                subtitle="Join our platform and get started"
            >
                <Form
                    form={form}
                    name="signup_form"
                    onFinish={onFinish}
                    layout="vertical"
                    requiredMark={false}
                    className="w-full"
                >
                    <div className="w-32 mx-auto mb-7">
                        <AvatarUpload onChange={handleAvatarChange} />
                    </div>

                    <UsernameInput />
                    <EmailInput />
                    <PasswordInput hasFeedback={true} />

                    <Form.Item className="mt-6">
                        <AuthButton loading={loading}>Sign Up</AuthButton>
                    </Form.Item>
                </Form>

                <Divider plain>Or</Divider>

                <div className="text-center mt-4">
                    <span className="text-gray-600">
                        Already have an account?
                    </span>{" "}
                    <button
                        onClick={() => navigate("/login")}
                        className="text-blue-600 font-medium px-2 hover:text-blue-800"
                    >
                        Log in
                    </button>
                </div>
            </AuthCard>
        </AuthLayout>
    );
};

export default Signup;
