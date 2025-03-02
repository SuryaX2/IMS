import React, { useContext } from "react";
import { Layout } from "antd";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import AuthContext from "../context/AuthContext";

const { Content } = Layout;

const DashboardLayout = ({ children }) => {
    const { user } = useContext(AuthContext);
    const isAdmin = user?.role === "admin";

    return (
        <Layout className="min-h-screen">
            <Sidebar isAdmin={isAdmin} />
            <Layout>
                <Navbar />
                <Content className="m-6 p-6 bg-white rounded-lg shadow-md">
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default DashboardLayout;
