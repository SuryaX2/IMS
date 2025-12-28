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
        <AuthLayout imageSrc="/imsTopImage.png">
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
                    <div className="space-y-4 mb-6">
                        <EmailInput />
                        <PasswordInput />
                    </div>

                    <div className="flex justify-end mb-5">
                        <Link
                            to="/reset-password"
                            className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <Form.Item className="mb-0">
                        <AuthButton loading={loading}>Sign In</AuthButton>
                    </Form.Item>

                    <Divider plain className="my-6 text-gray-400 text-sm">
                        Or
                    </Divider>

                    <div className="text-center text-sm">
                        <span className="text-gray-600">
                            Don't have an account?
                        </span>{" "}
                        <Link
                            to="/signup"
                            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
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
