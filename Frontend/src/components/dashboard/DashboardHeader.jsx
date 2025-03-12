import React from "react";

const DashboardHeader = () => {
    return (
        <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Dashboard</h1>
            <p className="text-gray-500">
                Welcome back! Here's what's happening with your inventory today.
            </p>
        </div>
    );
};

export default DashboardHeader;
