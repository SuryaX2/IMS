import React, { useContext, useState } from "react";
import { Layout, Avatar, Dropdown, Space, Button } from "antd";
import {
    UserOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import toast from "react-hot-toast";

const { Header } = Layout;

const DashboardHeader = ({ collapsed, setCollapsed }) => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        const result = await logout();
        if (result !== false) {
            navigate("/login");
        }
    };

    const handleViewProfile = () => {
        navigate("/profile");
    };

    const items = [
        {
            key: "1",
            label: <button onClick={handleViewProfile}>View Profile</button>,
            icon: <UserOutlined />,
        },
        {
            key: "2",
            label: <button onClick={handleLogout}>Logout</button>,
            icon: <LogoutOutlined />,
        },
    ];

    return (
        <Header className="bg-white p-0 px-4 flex justify-between items-center shadow-sm">
            <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                className="text-lg"
            />

            <div className="flex items-center">
                <span className="mr-3 font-medium">
                    {user?.username || "User"}
                </span>
                <Dropdown menu={{ items }} placement="bottomRight" arrow>
                    <Space>
                        <Avatar
                            src={user?.avatar}
                            icon={!user?.avatar && <UserOutlined />}
                            className="cursor-pointer"
                        />
                    </Space>
                </Dropdown>
            </div>
        </Header>
    );
};

export default DashboardHeader;
