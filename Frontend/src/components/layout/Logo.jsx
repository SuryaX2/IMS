import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const Logo = ({
    size = "default", // 'small', 'default', 'large'
    showText = true,
    className = "",
    onClick = null,
}) => {
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else {
            navigate("/dashboard");
        }
    };

    const sizeClasses = {
        small: "h-8",
        default: "h-10",
        large: "h-12",
    };

    const textSizeClasses = {
        small: "text-lg",
        default: "text-xl",
        large: "text-2xl",
    };

    return (
        <div
            className={`flex items-center cursor-pointer transition-all duration-200 hover:opacity-80 ${className}`}
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    handleClick();
                }
            }}
        >
            <img
                src="/InventoryPro.png"
                alt="InventoryPro Logo"
                className={`${sizeClasses[size]} w-auto object-contain`}
                style={{
                    filter: isDarkMode
                        ? "brightness(1.1) contrast(1.1)"
                        : "none",
                }}
            />
            {showText && (
                <span
                    className={`ml-3 font-bold ${textSizeClasses[size]} ${
                        isDarkMode ? "text-white" : "text-gray-800"
                    }`}
                >
                    InventoryPro
                </span>
            )}
        </div>
    );
};

export default Logo;
