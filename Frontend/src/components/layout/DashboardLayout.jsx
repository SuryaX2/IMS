import React, { useState, useContext } from "react";
import { Layout, Menu, Avatar, Dropdown, Breadcrumb } from "antd";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
    UserOutlined,
    LogoutOutlined,
    SettingOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from "@ant-design/icons";
import AuthContext from "../../context/AuthContext";
import { menuItems } from "../../data";

const { Header, Sider, Content } = Layout;

const DashboardLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    // Extract the current page from the URL path
    const currentPath = location.pathname;
    const pathSegments = currentPath.split("/").filter(Boolean);
    const currentPage = pathSegments.length > 0 ? pathSegments[0] : "dashboard";

    // Generate breadcrumb items based on the current path
    const breadcrumbItems = [
        { title: <Link to="/dashboard">Dashboard</Link> },
        ...pathSegments.map((segment, index) => {
            const url = `/${pathSegments.slice(0, index + 1).join("/")}`;
            const title = segment.charAt(0).toUpperCase() + segment.slice(1);
            return {
                title:
                    index === pathSegments.length - 1 ? (
                        title
                    ) : (
                        <Link to={url}>{title}</Link>
                    ),
            };
        }),
    ];

    // Handle logout
    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    // Avatar dropdown menu
    const avatarMenu = [
        {
            key: "profile",
            label: <Link to="/profile">View Profile</Link>,
            icon: <UserOutlined />,
        },
        {
            key: "settings",
            label: <Link to="/settings">Settings</Link>,
            icon: <SettingOutlined />,
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
        <Layout style={{ minHeight: "100vh" }}>
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={setCollapsed}
                theme="dark"
                width={250}
            >
                <div
                    style={{
                        height: "64px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "16px 0",
                    }}
                >
                    <h1
                        style={{ color: "#1890ff", margin: 0 }}
                        className="md:text-xl font-bold"
                    >
                        {collapsed ? "IPRO" : "InventoryPro"}
                    </h1>
                </div>
                <Menu
                    theme="dark"
                    defaultSelectedKeys={[currentPage]}
                    mode="inline"
                    items={menuItems}
                />
            </Sider>
            <Layout>
                <Header
                    style={{
                        padding: "0 16px",
                        background: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        boxShadow: "0 1px 4px rgba(0,21,41,.08)",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center" }}>
                        {React.createElement(
                            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                            {
                                className: "trigger",
                                onClick: () => setCollapsed(!collapsed),
                                style: {
                                    fontSize: "18px",
                                    cursor: "pointer",
                                    transition: "color 0.3s",
                                },
                            }
                        )}
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <span style={{ marginRight: "12px" }}>
                            {user?.name || "User"}
                        </span>
                        <Dropdown
                            menu={{ items: avatarMenu }}
                            placement="bottomRight"
                            arrow
                        >
                            <Avatar
                                src={user?.avatar}
                                icon={<UserOutlined />}
                                size="large"
                                style={{ cursor: "pointer" }}
                            />
                        </Dropdown>
                    </div>
                </Header>
                <Content
                    style={{
                        margin: "16px",
                        padding: "24px",
                        background: "#fff",
                        minHeight: "280px",
                        borderRadius: "4px",
                    }}
                >
                    <Breadcrumb
                        items={breadcrumbItems}
                        style={{ marginBottom: "16px" }}
                    />
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default DashboardLayout;
