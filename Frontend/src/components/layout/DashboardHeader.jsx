// components/layout/DashboardHeader.jsx
import React, { useContext } from "react";
import { Header } from "antd/lib/layout/layout";
import { Avatar, Dropdown } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
    UserOutlined,
    LogoutOutlined,
    SettingOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from "@ant-design/icons";
import AuthContext from "../../context/AuthContext";

const DashboardHeader = ({ collapsed, setCollapsed }) => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    // Handle logout
    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    // Handle logo click
    const handleLogoClick = () => {
        navigate("/dashboard");
    };

    // Avatar dropdown menu
    const avatarMenu = [
        {
            key: "profile",
            label: <Link to="/profile">View Profile</Link>,
            icon: <UserOutlined />,
        },
        {
            key: "divider",
            type: "divider",
        },
        {
            key: "logout",
            label: "Logout",
            icon: <LogoutOutlined />,
            onClick: handleLogout,
        },
    ];

    return (
        <Header
            className="px-6 flex items-center justify-between z-10 sticky top-0 h-16"
            style={{
                background: "white",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            }}
        >
            <div className="flex items-center gap-4">
                {/* Logo for mobile */}
                <div
                    className="cursor-pointer md:hidden"
                    onClick={handleLogoClick}
                >
                    <div className="flex items-center">
                        <img
                            src="/IconOnly_Transparent_NoBuffer.png"
                            alt="InventoryPro Logo"
                            className="h-full w-auto p-2"
                            style={{ maxHeight: "48px" }}
                        />
                    </div>
                </div>
                <div className="md:hidden">
                    <button
                        className="text-lg px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
                        onClick={() => setCollapsed(!collapsed)}
                    >
                        {collapsed ? (
                            <MenuUnfoldOutlined />
                        ) : (
                            <MenuFoldOutlined />
                        )}
                    </button>
                </div>

                <div className="hidden md:block">
                    <button
                        className="text-lg px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
                        onClick={() => setCollapsed(!collapsed)}
                    >
                        {collapsed ? (
                            <MenuUnfoldOutlined />
                        ) : (
                            <MenuFoldOutlined />
                        )}
                    </button>
                </div>
            </div>

            <div className="flex items-center">
                <UserProfileInfo user={user} />
                <UserAvatar user={user} avatarMenu={avatarMenu} />
            </div>
        </Header>
    );
};

const UserProfileInfo = ({ user }) => (
    <div className="hidden sm:flex flex-col items-end mr-3">
        <span className="text-sm font-bold text-gray-800">
            {user?.username || "User"}
        </span>
        <span className="text-xs text-gray-500">
            {user?.role || "Administrator"}
        </span>
    </div>
);

const UserAvatar = ({ user, avatarMenu }) => (
    <Dropdown menu={{ items: avatarMenu }} placement="bottomRight" arrow>
        <div className="cursor-pointer">
            <Avatar
                src={user?.avatar}
                style={{
                    background: "linear-gradient(to right, #1a237e, #283593)",
                    border: "2px solid white",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                }}
                icon={<UserOutlined />}
                size="large"
            />
        </div>
    </Dropdown>
);

export default DashboardHeader;
