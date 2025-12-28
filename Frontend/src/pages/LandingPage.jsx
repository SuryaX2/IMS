import React from "react";
import { Layout } from "antd";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Hero from "../components/sections/Hero";
import Features from "../components/sections/Features";
import HowItWorks from "../components/sections/HowItWorks";
import Testimonials from "../components/sections/Testimonials";
import CTASection from "../components/sections/CTASection";
import Footer from "../components/layout/Footer";
import { features, testimonials, steps } from "../data";

const { Content } = Layout;

const LandingPage = () => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate("/signup");
    };

    return (
        <Layout className="min-h-screen bg-white">
            <Navbar />
            <Content>
                <Hero onGetStarted={handleGetStarted} />
                <Features features={features} />
                <HowItWorks steps={steps} onGetStarted={handleGetStarted} />
                <Testimonials testimonials={testimonials} />
                <CTASection />
            </Content>
            <Footer />
        </Layout>
    );
};

export default LandingPage;
