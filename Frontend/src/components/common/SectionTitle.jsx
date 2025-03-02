import React from "react";

const SectionTitle = ({
    overline,
    title,
    description,
    center = true,
    light = false,
}) => {
    return (
        <div className={`${center ? "text-center" : ""} mb-16`}>
            {overline && (
                <span
                    className={`text-blue-600 font-semibold mb-2 inline-block`}
                >
                    {overline}
                </span>
            )}
            <h1
                className={`text-4xl md:text-5xl font-bold ${light ? "text-white" : "text-gray-900"} mb-4`}
            >
                {title}
            </h1>
            {description && (
                <p
                    className={`text-xl ${light ? "text-white opacity-90" : "text-gray-600"} max-w-3xl ${center ? "mx-auto" : ""}`}
                >
                    {description}
                </p>
            )}
            <div className="w-24 h-1 bg-blue-600 mx-auto mt-6 rounded-full"></div>
        </div>
    );
};

export default SectionTitle;
