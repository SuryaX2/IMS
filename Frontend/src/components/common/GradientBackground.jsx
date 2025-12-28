import React from "react";

const GradientBackground = ({
    children,
    className = "",
    type = "blue", // blue, white-to-blue, blue-to-white
    decorations = true,
    id,
}) => {
    let bgClass = "";

    switch (type) {
        case "blue":
            bgClass = "bg-gradient-to-r from-blue-600 to-indigo-700 text-white";
            break;
        case "white-to-blue":
            bgClass = "bg-gradient-to-b from-white to-blue-50";
            break;
        case "blue-to-white":
            bgClass = "bg-gradient-to-b from-gray-50 to-white";
            break;
        default:
            bgClass = "bg-white";
    }

    return (
        <div id={id} className={`${bgClass} ${className} relative overflow-hidden`}>
            {decorations && type === "blue" && (
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white"></div>
                    <div className="absolute bottom-0 left-1/4 w-48 h-48 rounded-full bg-white"></div>
                </div>
            )}

            {decorations && type === "white-to-blue" && (
                <>
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-gray-50 to-transparent"></div>
                    <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-blue-100 opacity-30"></div>
                    <div className="absolute bottom-0 left-1/4 w-48 h-48 rounded-full bg-indigo-100 opacity-30"></div>
                </>
            )}

            {decorations && type === "blue-to-white" && (
                <>
                    <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white to-transparent"></div>
                    <div className="absolute -top-10 right-10 w-32 h-32 bg-blue-100 rounded-full opacity-30"></div>
                </>
            )}

            <div className="container mx-auto px-4 relative z-10" id={id}>
                {children}
            </div>
        </div>
    );
};

export default GradientBackground;
