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
            className="py-20 md:py-32 container mx-auto px-4 relative overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50/30 via-transparent to-indigo-50/30 pointer-events-none"></div>
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-tl from-indigo-400/10 to-blue-400/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">
                <SectionTitle
                    overline="PROCESS"
                    title="How It Works"
                    description="Get started in minutes with our simple three-step process"
                />

                <Row gutter={[80, 80]} align="middle" className="mt-20">
                    <Col xs={24} md={12}>
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/20 via-indigo-400/20 to-blue-400/20 rounded-3xl blur-2xl opacity-60"></div>

                            <div className="absolute inset-0 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-3xl transform rotate-3 transition-transform duration-500 hover:rotate-6"></div>
                            <div className="absolute inset-0 bg-gradient-to-tl from-indigo-200/30 to-blue-200/30 rounded-3xl transform -rotate-3 transition-transform duration-500 hover:-rotate-6"></div>

                            <div className="relative bg-white rounded-2xl p-3 shadow-[0_20px_60px_-15px_rgba(59,130,246,0.3)]">
                                <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-1 border border-gray-100">
                                    <img
                                        src="/Inventory-management-system.webp"
                                        alt="Dashboard Preview"
                                        className="w-full object-contain rounded-lg"
                                    />
                                </div>
                            </div>

                            <div className="absolute -top-8 -left-8 w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full opacity-20 blur-2xl hidden md:block animate-pulse"></div>
                            <div
                                className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-full opacity-20 blur-2xl hidden md:block animate-pulse"
                                style={{ animationDelay: "1s" }}
                            ></div>
                        </div>
                    </Col>
                    <Col xs={24} md={12}>
                        <div className="space-y-10 relative">
                            <div className="absolute top-8 bottom-32 left-5 w-0.5 bg-gradient-to-b from-blue-300 via-indigo-300 to-transparent hidden md:block"></div>

                            {steps.map((step, index) => (
                                <ProcessStep key={index} {...step} />
                            ))}

                            <div className="ml-16 pt-6">
                                <Button
                                    type="primary"
                                    size="large"
                                    onClick={onGetStarted}
                                    icon={<ArrowRightOutlined />}
                                    iconPosition="right"
                                >
                                    Get Started Now
                                </Button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default HowItWorks;
