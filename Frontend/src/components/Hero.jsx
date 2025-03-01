import React from "react";
import { Button, Row, Col } from "antd";
import { ArrowRightOutlined, PlayCircleOutlined } from "@ant-design/icons";

const Hero = ({ onGetStarted }) => {
    return (
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white pt-16 md:py-24 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute -top-0 -right-24 w-96 h-96 rounded-full bg-white"></div>
                <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full bg-white"></div>
                <div className="absolute bottom-0 right-1/3 w-48 h-48 rounded-full bg-white"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <Row gutter={[32, 40]} align="middle">
                    <Col xs={24} md={12}>
                        <div className="text-white">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4 md:mb-6 leading-tight">
                                Smart Inventory Management for Modern Businesses
                            </h1>
                            <p className="text-lg md:text-xl opacity-90 mb-6 md:mb-10 max-w-lg">
                                Streamline your inventory, reduce costs, and
                                boost efficiency with our powerful yet intuitive
                                inventory solution.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Button
                                    type="primary"
                                    size="large"
                                    className="bg-white text-blue-700 border-white hover:bg-gray-100 hover:text-blue-800 hover:border-gray-100 shadow-lg h-12 px-6 md:px-8 flex items-center"
                                    onClick={onGetStarted}
                                >
                                    Get Started{" "}
                                    <ArrowRightOutlined className="ml-2" />
                                </Button>
                                <Button
                                    ghost
                                    size="large"
                                    className="border-2 hover:text-white hover:border-white h-12 px-6 md:px-8 flex items-center"
                                >
                                    <PlayCircleOutlined className="mr-2" />{" "}
                                    Watch Demo
                                </Button>
                            </div>
                        </div>
                    </Col>
                    <Col xs={24} md={12}>
                        <div className="relative mt-6 md:mt-0">
                            {/* Image frame with shadow and border */}
                            <div className="absolute inset-0 bg-white/10 rounded-xl transform rotate-3"></div>
                            <img
                                src="/Inventory-management-system.webp"
                                alt="Inventory Dashboard"
                                className="w-full object-contain rounded-lg shadow-2xl relative z-10 transform hover:scale-105 transition-transform duration-500"
                            />
                            {/* Decorative elements */}
                            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-blue-400 rounded-full opacity-60 hidden md:block"></div>
                            <div className="absolute -top-4 -right-4 w-10 h-10 bg-indigo-500 rounded-full opacity-60 hidden md:block"></div>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default Hero;
