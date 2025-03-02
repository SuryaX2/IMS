import React, { useState, useContext } from "react";
import { Layout, Menu,Avatar } from "antd";
import {
    DashboardOutlined,
    ShoppingCartOutlined,
    ShoppingOutlined,
    UserOutlined,
    FileAddOutlined,
    BarChartOutlined,
    TeamOutlined,
    SettingOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const { Sider } = Layout;

const Sidebar = ({ isAdmin }) => {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();
    const { user } = useContext(AuthContext);

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    const commonMenuItems = [
        {
            key: "dashboard",
            icon: <DashboardOutlined />,
            label: <Link to="/dashboard">Dashboard</Link>,
        },
        {
            key: "products",
            icon: <ShoppingOutlined />,
            label: <Link to="/products">Products</Link>,
        },
        {
            key: "sales",
            icon: <ShoppingCartOutlined />,
            label: <Link to="/sales">Sales</Link>,
        },
        {
            key: "purchases",
            icon: <FileAddOutlined />,
            label: <Link to="/purchases">Purchases</Link>,
        },
    ];

    const adminMenuItems = [
        {
            key: "users",
            icon: <TeamOutlined />,
            label: <Link to="/users">Users</Link>,
        },
        {
            key: "reports",
            icon: <BarChartOutlined />,
            label: <Link to="/reports">Reports</Link>,
        },
        {
            key: "settings",
            icon: <SettingOutlined />,
            label: <Link to="/settings">Settings</Link>,
        },
    ];

    const menuItems = isAdmin
        ? [...commonMenuItems, ...adminMenuItems]
        : commonMenuItems;

    const selectedKey = location.pathname.split("/")[1] || "dashboard";

    return (
        <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={setCollapsed}
            width={240}
            className="shadow-md"
            style={{
                background: "#fff",
                overflow: "auto",
                height: "100vh",
                position: "sticky",
                top: 0,
                left: 0,
            }}
            trigger={null}
        >
            <div className="flex justify-center items-center h-16 border-b border-gray-200">
                {!collapsed ? (
                    <h2 className="text-lg font-bold text-blue-600">
                        InventoryPro
                    </h2>
                ) : (
                    <h2 className="text-lg font-bold text-blue-600">IP</h2>
                )}
            </div>

            <div className="p-3 flex justify-end">
                {collapsed ? (
                    <MenuUnfoldOutlined
                        className="text-lg cursor-pointer"
                        onClick={toggleCollapsed}
                    />
                ) : (
                    <MenuFoldOutlined
                        className="text-lg cursor-pointer"
                        onClick={toggleCollapsed}
                    />
                )}
            </div>

            <Menu
                mode="inline"
                selectedKeys={[selectedKey]}
                items={menuItems}
                className="border-r-0"
            />

            <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
                <div className="flex items-center">
                    <Avatar
                        src={user?.avatar}
                        icon={!user?.avatar && <UserOutlined />}
                    />
                    {!collapsed && (
                        <div className="ml-2 overflow-hidden">
                            <p className="m-0 font-medium truncate">
                                {user?.username}
                            </p>
                            <p className="m-0 text-xs text-gray-500 truncate">
                                {isAdmin ? "Administrator" : "User"}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </Sider>
    );
};

export default Sidebar;
