import { useState, useContext } from "react";
import { Form, Divider } from "antd";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthCard from "../../components/auth/AuthCard";
import { EmailInput, PasswordInput } from "../../components/auth/FormItems";
import AuthButton from "../../components/auth/AuthButton";

const Login = () => {
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        const result = await login(values);
        if (result.success) {
            navigate("/email-verify");
        }
        setLoading(false);
    };

    return (
        <AuthLayout imageSrc="/Inventory-management-system.webp">
            <AuthCard
                title="Login"
                subtitle="Sign in to continue to your account"
            >
                <Form
                    name="login-form"
                    className="w-full"
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <EmailInput />
                    <PasswordInput />

                    <Form.Item className="mb-2">
                        <div className="flex justify-end">
                            <Link
                                to="/reset-password"
                                className="text-blue-500 hover:text-blue-700 font-medium"
                            >
                                Forgot password?
                            </Link>
                        </div>
                    </Form.Item>

                    <Form.Item>
                        <AuthButton loading={loading}>Sign In</AuthButton>
                    </Form.Item>

                    <Divider plain>Or</Divider>

                    <div className="text-center mt-4">
                        <span className="text-gray-600">
                            Don't have an account?
                        </span>{" "}
                        <Link
                            to="/signup"
                            className="text-blue-500 hover:text-blue-700 font-medium"
                        >
                            Sign up
                        </Link>
                    </div>
                </Form>
            </AuthCard>
        </AuthLayout>
    );
};

export default Login;
