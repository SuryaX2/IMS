import React from "react";
import { Layout, Button, Row, Col } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import FeatureCard from "../components/FeatureCard";
import Hero from "../components/Hero";
import TestimonialSection from "../components/Testimonial";
import Footer from "../components/Footer";
import { features } from "../data";

const { Content } = Layout;

const LandingPage = () => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate("/signup");
    };

    return (
        <Layout className="overflow-hidden bg-white">
            <Navbar />

            {/* Content with top padding to account for fixed navbar */}
            <Content>
                <Hero onGetStarted={handleGetStarted} />

                {/* Features Section */}
                <div
                    id="features"
                    className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white relative"
                >
                    {/* Decorative elements */}
                    <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white to-transparent"></div>
                    <div className="absolute -top-10 right-10 w-32 h-32 bg-blue-100 rounded-full opacity-30"></div>

                    <div className="container mx-auto px-4 relative z-10">
                        <div className="text-center mb-16">
                            <span className="text-blue-600 font-semibold mb-2 inline-block">
                                FEATURES
                            </span>
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                Powerful Features
                            </h1>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Everything you need to manage your inventory
                                efficiently in one place
                            </p>
                            <div className="w-24 h-1 bg-blue-600 mx-auto mt-6 rounded-full"></div>
                        </div>
                        <Row gutter={[24, 32]} justify="center">
                            {features.map((feature, index) => (
                                <Col xs={24} sm={12} md={8} key={index}>
                                    <FeatureCard {...feature} />
                                </Col>
                            ))}
                        </Row>
                    </div>
                </div>

                {/* How It Works Section */}
                <div
                    id="process"
                    className="py-16 md:py-24 container mx-auto px-4 relative"
                >
                    <div className="absolute -top-10 left-10 w-32 h-32 bg-indigo-100 rounded-full opacity-30"></div>

                    <div className="text-center mb-16">
                        <span className="text-blue-600 font-semibold mb-2 inline-block">
                            PROCESS
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            How It Works
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Get started in minutes with our simple three-step
                            process
                        </p>
                        <div className="w-24 h-1 bg-blue-600 mx-auto mt-6 rounded-full"></div>
                    </div>

                    <Row gutter={[48, 48]} align="middle">
                        <Col xs={24} md={12}>
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-100/50 rounded-xl transform -rotate-2"></div>
                                <img
                                    src="/Inventory-management-system.webp"
                                    alt="Dashboard Preview"
                                    className="w-full object-contain relative z-10 rounded-lg shadow-xl"
                                />
                                {/* Decorative elements */}
                                <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-blue-400 rounded-full opacity-60 hidden md:block"></div>
                            </div>
                        </Col>
                        <Col xs={24} md={12}>
                            <div className="space-y-10 md:space-y-12 relative">
                                {/* Connection line */}
                                <div className="absolute top-12 bottom-12 left-4 md:left-4 w-0.5 bg-blue-100 hidden md:block"></div>

                                <div className="relative">
                                    <div className="bg-blue-600 rounded-full h-8 w-8 flex items-center justify-center mr-6 absolute top-0 left-0 z-10">
                                        <span className="text-white font-semibold">
                                            1
                                        </span>
                                    </div>
                                    <div className="ml-14">
                                        <h1 className="text-2xl font-bold mb-3 text-gray-800">
                                            Sign Up for an Account
                                        </h1>
                                        <p className="text-gray-600 text-lg">
                                            Create your account in minutes and
                                            set up your inventory profiles.
                                        </p>
                                    </div>
                                </div>

                                <div className="relative">
                                    <div className="bg-blue-600 rounded-full h-8 w-8 flex items-center justify-center mr-6 absolute top-0 left-0 z-10">
                                        <span className="text-white font-semibold">
                                            2
                                        </span>
                                    </div>
                                    <div className="ml-14">
                                        <h1 className="text-2xl font-bold mb-3 text-gray-800">
                                            Import Your Inventory
                                        </h1>
                                        <p className="text-gray-600 text-lg">
                                            Easily import your existing
                                            inventory data or start fresh.
                                        </p>
                                    </div>
                                </div>

                                <div className="relative">
                                    <div className="bg-blue-600 rounded-full h-8 w-8 flex items-center justify-center mr-6 absolute top-0 left-0 z-10">
                                        <span className="text-white font-semibold">
                                            3
                                        </span>
                                    </div>
                                    <div className="ml-14">
                                        <h1 className="text-2xl font-bold mb-3 text-gray-800">
                                            Start Managing Efficiently
                                        </h1>
                                        <p className="text-gray-600 text-lg">
                                            Track, analyze, and optimize your
                                            inventory in real-time.
                                        </p>
                                    </div>
                                </div>

                                <Button
                                    type="primary"
                                    size="large"
                                    className="ml-14 bg-blue-600 hover:bg-blue-700 h-12 px-8 shadow-md mt-6"
                                    onClick={handleGetStarted}
                                >
                                    Get Started Now{" "}
                                    <ArrowRightOutlined className="ml-2" />
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </div>

                <TestimonialSection />

                {/* CTA Section */}
                <div className="py-16 md:py-24 bg-gradient-to-r from-blue-600 to-indigo-700 text-center text-white relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white"></div>
                        <div className="absolute bottom-0 left-1/4 w-48 h-48 rounded-full bg-white"></div>
                    </div>

                    <div className="container mx-auto px-4 relative z-10">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            Ready to Optimize Your Inventory?
                        </h1>
                        <p className="text-xl mb-10 max-w-3xl mx-auto text-white opacity-90">
                            Join thousands of businesses that have transformed
                            their inventory management with InventoryPro
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button
                                type="default"
                                size="large"
                                className="bg-white text-blue-700 border-white hover:bg-gray-100 hover:text-blue-800 h-12 px-8 shadow-lg"
                                onClick={() => navigate("/signup")}
                            >
                                Sign Up Free
                            </Button>
                            <Button
                                ghost
                                size="large"
                                className="border-2 hover:text-white hover:border-white h-12 px-8"
                                onClick={() => navigate("/login")}
                            >
                                Login
                            </Button>
                        </div>
                    </div>
                </div>
            </Content>

            <Footer />
        </Layout>
    );
};

export default LandingPage;
