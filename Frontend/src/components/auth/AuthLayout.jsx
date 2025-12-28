import React from "react";
import PropTypes from "prop-types";

const AuthLayout = ({ children, imageSrc }) => {
    return (
        <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800">
                <div className="absolute inset-0 bg-black/10" />
                <div className="relative z-10 flex items-center justify-center w-full p-12">
                    <img
                        src={imageSrc || "/Inventory-management-system.webp"}
                        alt="Authentication"
                        className="object-contain max-h-[85vh] w-auto drop-shadow-2xl"
                    />
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12">
                <div className="w-full max-w-md">{children}</div>
            </div>
        </div>
    );
};

AuthLayout.propTypes = {
    children: PropTypes.node.isRequired,
    imageSrc: PropTypes.string,
};

export default AuthLayout;
