import React from "react";
import { Button as AntButton } from "antd";
import { Link } from "react-router-dom";

const Button = ({
    children,
    href,
    onClick,
    type = "default", // primary, secondary, outline, text
    size = "medium", // small, medium, large
    icon,
    iconPosition = "right",
    className = "",
    ...rest
}) => {
    // Map our custom types to appropriate class combinations
    const typeClasses = {
        primary:
            "bg-blue-600 hover:bg-blue-700 text-white border-blue-600 shadow-md",
        secondary:
            "bg-white text-blue-700 border-white hover:bg-gray-100 hover:text-blue-800 hover:border-gray-100 shadow-lg",
        outline:
            "border-2 text-white hover:text-white hover:border-white bg-transparent",
        text: "border-none bg-transparent text-blue-600 hover:text-blue-800 shadow-none",
    };

    const sizeClasses = {
        small: "px-4 h-9 text-sm",
        medium: "px-6 h-10",
        large: "px-8 h-12 text-lg",
    };

    const buttonContent = (
        <>
            {icon && iconPosition === "left" && (
                <span className="mr-2">{icon}</span>
            )}
            {children}
            {icon && iconPosition === "right" && (
                <span className="ml-2">{icon}</span>
            )}
        </>
    );

    // Apply all classes
    const buttonClasses = `${typeClasses[type]} ${sizeClasses[size]} ${className} flex items-center justify-center transition-all duration-300`;

    // If it's a link, use Link component
    if (href) {
        return (
            <Link to={href} className={buttonClasses} {...rest}>
                {buttonContent}
            </Link>
        );
    }

    // Otherwise, use AntButton
    return (
        <AntButton onClick={onClick} className={buttonClasses} {...rest}>
            {buttonContent}
        </AntButton>
    );
};

export default Button;
