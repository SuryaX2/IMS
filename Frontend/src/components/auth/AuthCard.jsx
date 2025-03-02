import React from "react";
import { Card } from "antd";
import PropTypes from "prop-types";

const AuthCard = ({ title, subtitle, children }) => {
    return (
        <Card
            className="w-full max-w-md rounded-lg bg-gray-100"
            variant={false}
        >
            <div className="text-center mb-8">
                <h2 className="text-5xl font-bold text-gray-800 tracking-wider mb-6">
                    {title}
                </h2>
                {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
            </div>
            {children}
        </Card>
    );
};

AuthCard.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    children: PropTypes.node.isRequired,
};

export default AuthCard;
