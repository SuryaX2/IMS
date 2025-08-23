import React from "react";
import { Switch, Tooltip } from "antd";
import { SunOutlined, MoonOutlined } from "@ant-design/icons";
import { useTheme } from "../../context/ThemeContext";

const ThemeSwitcher = ({
    size = "default", // 'small', 'default'
    showIcon = true,
    showText = false,
    className = "",
}) => {
    const { isDarkMode, toggleTheme } = useTheme();

    const handleChange = (checked) => {
        toggleTheme();
    };

    return (
        <Tooltip title={`Switch to ${isDarkMode ? "light" : "dark"} mode`}>
            <div className={`flex items-center ${className}`}>
                {showIcon && (
                    <SunOutlined
                        className={`mr-2 transition-colors duration-200 ${
                            isDarkMode ? "text-gray-400" : "text-yellow-500"
                        }`}
                    />
                )}
                {showText && (
                    <span className="mr-2 text-sm">
                        {isDarkMode ? "Dark" : "Light"}
                    </span>
                )}
                <Switch
                    checked={isDarkMode}
                    onChange={handleChange}
                    size={size}
                    checkedChildren={<MoonOutlined />}
                    unCheckedChildren={<SunOutlined />}
                    className="theme-switcher"
                />
                {showIcon && (
                    <MoonOutlined
                        className={`ml-2 transition-colors duration-200 ${
                            isDarkMode ? "text-blue-400" : "text-gray-400"
                        }`}
                    />
                )}
            </div>
        </Tooltip>
    );
};

export default ThemeSwitcher;
