import React from "react";
import { useNavigate } from "react-router-dom";
import SectionTitle from "../common/SectionTitle";
import Button from "../common/Button";
import GradientBackground from "../common/GradientBackground";

const CTASection = () => {
    const navigate = useNavigate();

    return (
        <GradientBackground className="py-16 md:py-24" type="blue">
            <SectionTitle
                light
                title="Ready to Optimize Your Inventory?"
                description="Join thousands of businesses that have transformed their inventory management with InventoryPro"
            />
            <div className="flex flex-wrap justify-center gap-4">
                <Button
                    type="secondary"
                    size="large"
                    onClick={() => navigate("/signup")}
                >
                    Sign Up Free
                </Button>
                <Button
                    type="outline"
                    size="large"
                    onClick={() => navigate("/login")}
                >
                    Login
                </Button>
            </div>
        </GradientBackground>
    );
};

export default CTASection;
