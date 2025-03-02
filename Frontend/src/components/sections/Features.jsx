import React from "react";
import { Row, Col } from "antd";
import SectionTitle from "../common/SectionTitle";
import FeatureCard from "../ui/FeatureCard";
import GradientBackground from "../common/GradientBackground";

const Features = ({ features }) => {
    return (
        <GradientBackground
            id="features"
            className="py-16 md:py-24"
            type="blue-to-white"
        >
            <SectionTitle
                overline="FEATURES"
                title="Powerful Features"
                description="Everything you need to manage your inventory efficiently in one place"
            />
            <Row gutter={[24, 32]} justify="center">
                {features.map((feature, index) => (
                    <Col xs={24} sm={12} md={8} key={index}>
                        <FeatureCard {...feature} />
                    </Col>
                ))}
            </Row>
        </GradientBackground>
    );
};

export default Features;
