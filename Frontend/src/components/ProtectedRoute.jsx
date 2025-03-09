import React, { useContext, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { Spin } from "antd";

const ProtectedRoute = ({ children, requireVerified = false }) => {
    const { authenticated, loading, user } = useContext(AuthContext);
    const location = useLocation();

    // If still loading, show a spinner
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spin size="large" tip="Loading..." />
            </div>
        );
    }

    // If not authenticated, redirect to login
    if (!authenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If verification is required but user is not verified, redirect to verification page
    if (requireVerified && user && !user.isVerified) {
        return <Navigate to="/verify-email" replace />;
    }

    // If authenticated (and verified if required), render the children
    return children;
};

export default ProtectedRoute;
