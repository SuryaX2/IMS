import React from "react";
import { Card } from "antd";

const FeatureCard = ({ icon, title, description }) => {
    return (
        <Card 
            className="h-full hover:shadow-lg transition-shadow border-none rounded-xl overflow-hidden bg-white hover:-translate-y-1 transition-transform duration-500"
        >
            <div className="flex flex-col h-full">
                <div className="mb-6">
                    <div className="bg-blue-100 text-blue-600 rounded-lg p-3 inline-block text-3xl">
                        {icon}
                    </div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">{title}</h3>
                <p className="text-gray-600 flex-grow">{description}</p>
                
                <div className="mt-6">
                    <a 
                        href="#" 
                        className="text-blue-600 font-medium hover:text-blue-800 transition-colors inline-flex items-center"
                    >
                        Learn more 
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </a>
                </div>
            </div>
        </Card>
    );
};

export default FeatureCard;