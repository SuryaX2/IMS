import React from "react";
import { Row, Col } from "antd";
import { ArrowRightOutlined, PlayCircleOutlined } from "@ant-design/icons";
import Button from "../common/Button";
import GradientBackground from "../common/GradientBackground";

const Hero = ({ onGetStarted }) => {
    return (
        <GradientBackground className="pt-16 md:py-24" type="blue">
            <Row gutter={[32, 40]} align="middle">
                <Col xs={24} md={12}>
                    <div className="text-white">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 md:mb-6 leading-tight mt-10 md:mt-0">
                            Smart Inventory Management for Modern Businesses
                        </h1>
                        <p className="text-lg md:text-xl opacity-90 mb-6 md:mb-10 max-w-lg">
                            Streamline your inventory, reduce costs, and boost
                            efficiency with our powerful yet intuitive inventory
                            solution.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Button
                                type="secondary"
                                size="large"
                                icon={<ArrowRightOutlined />}
                                iconPosition="right"
                                onClick={onGetStarted}
                            >
                                Get Started
                            </Button>
                            <Button
                                type="outline"
                                size="large"
                                icon={<PlayCircleOutlined />}
                                iconPosition="left"
                            >
                                Watch Demo
                            </Button>
                        </div>
                    </div>
                </Col>
                <Col xs={24} md={12}>
                    <div className="relative mt-6 md:mt-0 mb-6">
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
        </GradientBackground>
    );
};

export default Hero;
