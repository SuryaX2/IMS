import React from "react";
import { Card } from "antd";
import PropTypes from "prop-types";

const AuthCard = ({ title, subtitle, children }) => {
    return (
        <Card
            className="w-full max-w-md bg-white shadow-sm border border-zinc-200/80"
            styles={{
                body: { padding: "2.5rem" },
            }}
            style={{
                borderRadius: "0.75rem",
            }}
        >
            <div className="text-center mb-7">
                <h2 className="text-4xl font-bold text-zinc-900 tracking-tight mb-2">
                    {title}
                </h2>
                {subtitle && (
                    <p className="text-sm text-zinc-500 mt-2">{subtitle}</p>
                )}
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
