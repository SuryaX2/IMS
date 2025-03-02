import React from "react";
import { Row, Col } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import SectionTitle from "../common/SectionTitle";
import ProcessStep from "../ui/ProcessStep";
import Button from "../common/Button";

const HowItWorks = ({ steps, onGetStarted }) => {
    return (
        <div
            id="process"
            className="py-16 md:py-24 container mx-auto px-4 relative"
        >
            <div className="absolute -top-10 left-10 w-32 h-32 bg-indigo-100 rounded-full opacity-30"></div>

            <SectionTitle
                overline="PROCESS"
                title="How It Works"
                description="Get started in minutes with our simple three-step process"
            />

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

                        {steps.map((step, index) => (
                            <ProcessStep key={index} {...step} />
                        ))}

                        <Button
                            type="primary"
                            size="large"
                            className="ml-14"
                            onClick={onGetStarted}
                            icon={<ArrowRightOutlined />}
                            iconPosition="right"
                        >
                            Get Started Now
                        </Button>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default HowItWorks;
