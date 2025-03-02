import React from "react";

const ProcessStep = ({ number, title, description }) => {
    return (
        <div className="relative">
            <div className="bg-blue-600 rounded-full h-8 w-8 flex items-center justify-center mr-6 absolute top-0 left-0 z-10">
                <span className="text-white font-semibold">{number}</span>
            </div>
            <div className="ml-14">
                <h1 className="text-2xl font-bold mb-3 text-gray-800">
                    {title}
                </h1>
                <p className="text-gray-600 text-lg">{description}</p>
            </div>
        </div>
    );
};

export default ProcessStep;
