import React, { createContext, useContext, useState, useEffect } from "react";
import { theme } from "antd";

const ThemeContext = createContext();

// Custom hook to use theme context
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Load theme preference from localStorage on component mount
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            setIsDarkMode(savedTheme === "dark");
        } else {
            // Check system preference
            const systemDarkMode = window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches;
            setIsDarkMode(systemDarkMode);
        }
    }, []);

    // Save theme preference to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("theme", isDarkMode ? "dark" : "light");
        // Update document class for global styles
        document.documentElement.classList.toggle("dark", isDarkMode);
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode((prev) => !prev);
    };

    // Ant Design theme configuration
    const antdTheme = {
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
            colorPrimary: "#1890ff",
            borderRadius: 8,
            ...(isDarkMode && {
                colorBgContainer: "#141414",
                colorBgLayout: "#000000",
                colorBgElevated: "#1f1f1f",
                colorText: "rgba(255, 255, 255, 0.85)",
                colorTextSecondary: "rgba(255, 255, 255, 0.65)",
                colorBorder: "#303030",
            }),
        },
        components: {
            Layout: {
                bodyBg: isDarkMode ? "#000000" : "#f5f5f5",
                headerBg: isDarkMode ? "#001529" : "#ffffff",
                siderBg: isDarkMode ? "#001529" : "#ffffff",
            },
            Menu: {
                itemBg: "transparent",
                itemSelectedBg: isDarkMode ? "#1890ff" : "#e6f7ff",
                itemHoverBg: isDarkMode
                    ? "rgba(255, 255, 255, 0.08)"
                    : "#f5f5f5",
            },
            Card: {
                colorBgContainer: isDarkMode ? "#1f1f1f" : "#ffffff",
            },
            Table: {
                headerBg: isDarkMode ? "#1f1f1f" : "#fafafa",
                rowHoverBg: isDarkMode
                    ? "rgba(255, 255, 255, 0.04)"
                    : "#f5f5f5",
            },
        },
    };

    const value = {
        isDarkMode,
        toggleTheme,
        theme: antdTheme,
    };

    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    );
};
