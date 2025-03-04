// Dashboard.jsx - Main dashboard component that conditionally renders based on user role
import React, { useContext } from "react";
import { Layout } from "antd";
import AuthContext from "../context/AuthContext";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import UserDashboard from "../components/dashboard/UserDashboard";
import AdminDashboard from "../components/dashboard/AdminDashboard";

const { Content } = Layout;

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const isAdmin = user?.role === "admin";

    return (
        <Layout className="min-h-screen">
            <DashboardSidebar isAdmin={isAdmin} />
            <Layout className="site-layout">
                <DashboardHeader />
                <Content className="m-4 p-6 bg-white rounded-lg shadow">
                    {isAdmin ? <AdminDashboard /> : <UserDashboard />}
                </Content>
            </Layout>
        </Layout>
    );
};

export default Dashboard;
