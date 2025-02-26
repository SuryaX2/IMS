import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, Divider, Row, Col, Card, Typography, Select, Upload } from "antd";
import { UserOutlined, LockOutlined, MailOutlined, UploadOutlined } from "@ant-design/icons";
import ReCAPTCHA from "react-google-recaptcha";
import toast from "react-hot-toast";
import axios from "axios";

const { Title, Text } = Typography;
const { Option } = Select;

const Signup = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    if (!captchaVerified) {
      toast.error("Please verify the CAPTCHA first");
      return;
    }

    if (!avatarFile) {
      toast.error("Please upload an avatar image");
      return;
    }

    setLoading(true);
    
    try {
      // Create FormData object to handle file upload
      const formData = new FormData();
      formData.append("username", values.username);
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("avatar", avatarFile);

      // Using the register API endpoint from your controller
      const response = await axios.post(
        'http://localhost:3001/api/v1/users/register', 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.statusCode === 200) {
        toast.success("Account created successfully! Verification email sent.");
        navigate("/email-verify");
      } else {
        toast.error(response.data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCaptchaChange = (value) => {
    setCaptchaVerified(!!value);
  };

  const handleAvatarChange = (info) => {
    if (info.file.status === 'done') {
      setAvatarFile(info.file.originFileObj);
      toast.success(`${info.file.name} uploaded successfully`);
    } else if (info.file.status === 'error') {
      toast.error(`${info.file.name} upload failed.`);
    }
  };

  // Custom upload props for the Upload component
  const uploadProps = {
    beforeUpload: file => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        toast.error('You can only upload image files!');
        return Upload.LIST_IGNORE;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        toast.error('Image must be smaller than 2MB!');
        return Upload.LIST_IGNORE;
      }
      setAvatarFile(file);
      return false; // Prevent automatic upload
    },
    onChange: handleAvatarChange,
  };

  return (
    <Row className="min-h-screen">
      {/* Left side - Form */}
      <Col xs={24} sm={24} md={12} className="flex items-center justify-center p-4">
        <Card variant={false} className="w-full max-w-md shadow-md">
          <div className="text-center mb-6">
            <Title level={2}>Create Account</Title>
            <Text type="secondary">Sign up to start managing your inventory</Text>
          </div>

          <Form
            form={form}
            name="signup"
            onFinish={onFinish}
            layout="vertical"
            requiredMark={false}
            size="large"
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Username is required" },
                { min: 3, message: "Username must be at least 3 characters" }
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Username" />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email address" }
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Email Address" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please enter your password" },
                { min: 6, message: "Password must be at least 6 characters" }
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Password" />
            </Form.Item>

            <Form.Item
              name="avatar"
              label="Profile Picture"
              rules={[{ required: true, message: "Please upload your profile picture" }]}
            >
              <Upload 
                {...uploadProps}
                listType="picture" 
                maxCount={1}
                showUploadList={true}
              >
                <Button icon={<UploadOutlined />}>Upload Avatar</Button>
              </Upload>
            </Form.Item>

            <Form.Item>
              <div className="flex justify-center mb-4">
                <ReCAPTCHA
                  sitekey="6Lcvp-MqAAAAAFKl_skUAXiKIGK_si0uSDyqJsGX" // Replace with your actual sitekey
                  onChange={handleCaptchaChange}
                />
              </div>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                icon={<UserOutlined />}
                disabled={!captchaVerified}
              >
                Create Account
              </Button>
            </Form.Item>

            <Divider plain>Or</Divider>

            <div className="text-center">
              <Text type="secondary">Already have an account?</Text>{" "}
              <Link to="/login" className="text-blue-600 hover:text-blue-800">
                Log in
              </Link>
            </div>
          </Form>
        </Card>
      </Col>

      {/* Right side - Image */}
      <Col xs={0} sm={0} md={12} className="bg-blue-50">
        <div className="h-full flex items-center justify-center">
          <img 
            src="/Inventory-management-system.webp" 
            alt="Inventory Management" 
            className="max-w-full max-h-full p-8"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg";
            }}
          />
        </div>
      </Col>
    </Row>
  );
};

export default Signup;