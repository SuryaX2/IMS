import React from "react";
import { Card } from "antd";

const FeatureCard = ({ icon, title, description }) => {
    return (
        <Card className="h-full border border-gray-100 rounded-2xl overflow-hidden bg-white hover:border-blue-200 hover:shadow-xl transition-all duration-300 group">
            <div className="flex flex-col h-full p-2">
                <div className="mb-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 rounded-xl p-4 inline-flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                        {icon}
                    </div>
                </div>

                <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                    {title}
                </h3>

                <p className="text-gray-600 leading-relaxed flex-grow mb-6">
                    {description}
                </p>

                <div className="pt-4 border-t border-gray-100">
                    <a
                        href="#"
                        className="text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200 inline-flex items-center group/link"
                    >
                        Learn more
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 ml-2 group-hover/link:translate-x-1 transition-transform duration-200"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </a>
                </div>
            </div>
        </Card>
    );
};

export default FeatureCard;
