import React, { createContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    // Create axios instance with default config
    const api = axios.create({
        baseURL: import.meta.env.VITE_BACKEND_URL,
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",
        },
    });

    // Check authentication status on mount
    useEffect(() => {
        checkAuthStatus();
    }, []);

    // Function to check if user is authenticated
    const checkAuthStatus = async () => {
        try {
            setLoading(true);
            const response = await api.get("/users/current-user");

            if (response.data.success) {
                setUser(response.data.data);
                setAuthenticated(true);
            } else {
                setUser(null);
                setAuthenticated(false);
            }
        } catch (error) {
            console.error("Auth check error:", error);
            setUser(null);
            setAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    // Login function
    const login = async (credentials) => {
        try {
            const response = await api.post("/users/login", credentials);
            const data = response.data;

            if (data.success) {
                setUser(data.data.user);
                setAuthenticated(true);
                toast.success("Login successful");
                return { success: true };
            } else {
                toast.error(data.message || "Login failed");
                return { success: false, message: data.message };
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || "Something went wrong";
            toast.error(errorMessage);
            return { success: false, message: errorMessage };
        }
    };

    // Logout function
    const logout = async () => {
        try {
            const response = await api.post("/users/logout");

            if (response.data.success) {
                setUser(null);
                setAuthenticated(false);
                toast.success("Logged out successfully");
            } else {
                toast.error(response.data.message || "Logout failed");
            }
        } catch (error) {
            console.error("Logout error:", error);
            toast.error(error.response?.data?.message || "Logout failed");
        }
    };

    // Check if user is verified
    const isVerified = () => {
        return user?.isVerified === true;
    };

    const authContextValue = {
        user,
        setUser,
        loading,
        authenticated,
        login,
        logout,
        isVerified,
        refreshUser: checkAuthStatus,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
