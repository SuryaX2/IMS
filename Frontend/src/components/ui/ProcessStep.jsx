import React from "react";

const ProcessStep = ({ number, title, description }) => {
    return (
        <div className="relative group">
            <div className="absolute top-0 left-0 z-10">
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full blur-md opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
                    <div className="relative bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full h-10 w-10 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-xl group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:scale-110 border-2 border-white">
                        <span className="text-white font-bold text-base">
                            {number}
                        </span>
                    </div>
                </div>
            </div>

            <div className="ml-16 bg-white rounded-xl p-6 shadow-sm border border-gray-100 group-hover:shadow-lg group-hover:border-blue-100 transition-all duration-300 group-hover:-translate-y-1">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-indigo-500 rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <h1 className="text-xl md:text-2xl font-bold mb-3 text-gray-900 leading-tight group-hover:text-blue-600 transition-colors duration-300">
                    {title}
                </h1>
                <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                    {description}
                </p>
            </div>
        </div>
    );
};

export default ProcessStep;
