import React from "react";
import { Row, Col } from "antd";
import SectionTitle from "../common/SectionTitle";
import FeatureCard from "../ui/FeatureCard";
import GradientBackground from "../common/GradientBackground";

const Features = ({ features }) => {
    return (
        <GradientBackground
            id="features"
            className="py-24 md:py-32 relative overflow-hidden"
            type="blue-to-white"
        >
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <SectionTitle
                    overline="FEATURES"
                    title="Powerful Features"
                    description="Everything you need to manage your inventory efficiently in one place"
                />
                
                <Row gutter={[32, 32]} justify="center" className="mt-16">
                    {features.map((feature, index) => (
                        <Col xs={24} sm={12} md={8} key={index}>
                            <FeatureCard {...feature} />
                        </Col>
                    ))}
                </Row>
            </div>
        </GradientBackground>
    );
};

export default Features;