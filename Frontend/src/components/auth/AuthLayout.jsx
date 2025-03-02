import React from "react";
import PropTypes from "prop-types";

const AuthLayout = ({ children, imageSrc }) => {
    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Image section - half of screen */}
            <div className="hidden md:flex md:w-1/2 justify-center items-center relative">
                <img
                    src={imageSrc || "/Inventory-management-system.webp"}
                    alt="Authentication"
                    className="object-contain h-full w-full"
                />
            </div>

            {/* Form section - half of screen */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-6">
                {children}
            </div>
        </div>
    );
};

AuthLayout.propTypes = {
    children: PropTypes.node.isRequired,
    imageSrc: PropTypes.string,
};

export default AuthLayout;
