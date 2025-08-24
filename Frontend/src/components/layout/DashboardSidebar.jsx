// components/layout/DashboardSidebar.jsx
import React, { useContext } from "react";
import { Layout, Menu, Avatar } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { menuItems } from "../../data";

const { Sider } = Layout;

const DashboardSidebar = ({ collapsed, setCollapsed, currentPage }) => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogoClick = () => {
        navigate("/dashboard");
    };

    return (
        <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={setCollapsed}
            trigger={null}
            theme="dark"
            width={260}
            className="hidden md:block"
            style={{
                overflowY: "auto",
                height: "100vh",
                position: "sticky",
                top: 0,
                left: 0,
                zIndex: 1000,
            }}
        >
            <SidebarLogo collapsed={collapsed} onClick={handleLogoClick} />
            <div className="mt-4 mb-8 mx-4 h-px bg-indigo-700 opacity-50"></div>

            <Menu
                theme="dark"
                defaultSelectedKeys={[currentPage]}
                mode="inline"
                items={menuItems.map((item) => ({
                    ...item,
                }))}
                className="border-r-0"
                style={{
                    background: "transparent",
                }}
            />

            {!collapsed && <SidebarUserProfile user={user} logout={logout} />}
        </Sider>
    );
};

const SidebarLogo = ({ collapsed, onClick }) => (
    <div
        className="flex items-center justify-center h-16 my-6 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={onClick}
    >
        {collapsed ? (
            <img
                src="/IconOnly_Transparent_NoBuffer.png"
                alt="InventoryPro Logo"
                className="h-12 w-auto p-1 "
                style={{ maxHeight: "48px" }}
            />
        ) : (
            <div className="flex items-center">
                <img
                    src="/FullLogo_Transparent_NoBuffer.png"
                    alt="InventoryPro Logo"
                    className="h-full w-auto p-1 "
                    style={{ maxHeight: "100px" }}
                />
            </div>
        )}
    </div>
);

const SidebarUserProfile = ({ user, logout }) => (
    <div className="absolute bottom-3 left-4 right-4 rounded-lg p-4">
        <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3">
                {user.avatar && (
                    <Avatar
                        src={user?.avatar}
                        style={{
                            background:
                                "linear-gradient(to right, #1a237e, #283593)",
                            border: "2px solid white",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                        }}
                        icon={<UserOutlined />}
                        size="large"
                    />
                )}
            </div>
            <div>
                <p className="text-white font-medium m-0">
                    {user?.username || "User"}
                </p>
                <p className="text-xs text-indigo-200 m-0">
                    {user?.role || "Administrator"}
                </p>
            </div>
        </div>
        <button
            onClick={logout}
            className="w-full bg-white hover:bg-gray-100 text-indigo-800 font-medium py-1.5 px-3 rounded-md text-sm transition-colors flex items-center justify-center"
        >
            <LogoutOutlined className="mr-1" /> Logout
        </button>
    </div>
);

export default DashboardSidebar;
