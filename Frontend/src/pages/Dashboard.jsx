import React, { useContext } from "react";
import DashboardLayout from "../components/DashboardLayout";
import UserDashboard from "../components/UserDashboard";
import AdminDashboard from "../components/AdminDashboard";
import AuthContext from "../context/AuthContext";

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const isAdmin = user?.role === "admin";

    return (
        <DashboardLayout>
            {isAdmin ? <AdminDashboard /> : <UserDashboard />}
        </DashboardLayout>
    );
};

export default Dashboard;
