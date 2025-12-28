import React from "react";
import { useNavigate } from "react-router-dom";
import SectionTitle from "../common/SectionTitle";
import Button from "../common/Button";
import GradientBackground from "../common/GradientBackground";

const CTASection = () => {
    const navigate = useNavigate();

    return (
        <GradientBackground
            className="relative py-24 md:py-36 overflow-hidden"
            type="blue"
        >
            <div className="relative max-w-5xl mx-auto px-6 text-center">
                <div className="inline-block mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                    <span className="text-white/90 text-sm font-medium tracking-wide">
                        Start Your Trial Today
                    </span>
                </div>

                <SectionTitle
                    light
                    title="Ready to Optimize Your Inventory?"
                    description="Join thousands of businesses that have transformed their inventory management with InventoryPro"
                />

                <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mt-12 md:mt-14">
                    <Button
                        type="secondary"
                        size="large"
                        onClick={() => navigate("/signup")}
                        className="group relative w-full sm:w-auto min-w-[220px] shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            Sign Up Free
                            <svg
                                className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                                />
                            </svg>
                        </span>
                    </Button>

                    <Button
                        type="outline"
                        size="large"
                        onClick={() => navigate("/login")}
                        className="w-full sm:w-auto min-w-[220px] backdrop-blur-sm bg-white/5 hover:bg-white/15 border-2 border-white/30 hover:border-white/50 transition-all duration-300 hover:scale-105"
                    >
                        Login
                    </Button>
                </div>

                <div className="mt-10 flex items-center justify-center gap-8 text-white/70 text-sm">
                    <div className="flex items-center gap-2">
                        <svg
                            className="w-5 h-5 text-green-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span>No credit card required</span>
                    </div>
                    <div className="hidden md:flex items-center gap-2">
                        <svg
                            className="w-5 h-5 text-green-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span>Start anytime</span>
                    </div>
                </div>
            </div>
        </GradientBackground>
    );
};

export default CTASection;
