import React from "react";
import { Row, Col } from "antd";
import { ArrowRightOutlined, PlayCircleOutlined } from "@ant-design/icons";
import Button from "../common/Button";
import GradientBackground from "../common/GradientBackground";

const Hero = ({ onGetStarted }) => {
    return (
        <GradientBackground className="py-20 md:py-32" type="blue">
            <Row gutter={[48, 48]} align="middle">
                <Col xs={24} md={12}>
                    <div className="text-white space-y-8">
                        <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight max-w-xl">
                            Smart Inventory Management for Modern Businesses
                        </h1>
                        <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-xl">
                            Streamline your inventory, reduce costs, and boost
                            efficiency with our powerful yet intuitive inventory
                            solution.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-2">
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
                    <div className="relative">
                        <div className="absolute inset-0 bg-white/5 rounded-2xl transform rotate-2 blur-sm"></div>
                        <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-3 shadow-2xl">
                            <img
                                src="/Inventory-management-system.webp"
                                alt="Inventory Dashboard"
                                className="w-full rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl"
                            />
                        </div>
                        <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-white/10 rounded-full blur-xl hidden md:block"></div>
                        <div className="absolute -top-6 -right-6 w-16 h-16 bg-white/10 rounded-full blur-lg hidden md:block"></div>
                    </div>
                </Col>
            </Row>
        </GradientBackground>
    );
};

export default Hero;
