import React, { useState, useContext, useEffect } from "react";
import { Layout, Menu, Avatar, Dropdown, Badge, Spin, message } from "antd";
import {
    DashboardOutlined,
    ShoppingCartOutlined,
    ShoppingOutlined,
    UserOutlined,
    TeamOutlined,
    BarsOutlined,
    AppstoreOutlined,
    SettingOutlined,
    LogoutOutlined,
    ProfileOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    BellOutlined,
} from "@ant-design/icons";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { api } from "../../api/api";

const { Header, Sider, Content } = Layout;

const DashboardLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState([]);

    // Fetch low stock notifications
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await api.get("/reports/low-stock-alerts");
                if (response.data.success) {
                    setNotifications(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        fetchNotifications();
        // Setup a periodic refresh every 5 minutes
        const interval = setInterval(fetchNotifications, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = async () => {
        setLoading(true);
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            message.error("Logout failed, please try again");
        } finally {
            setLoading(false);
        }
    };

    const userMenuItems = [
        {
            key: "profile",
            icon: <ProfileOutlined />,
            label: "View Profile",
            onClick: () => navigate("/profile"),
        },
        {
            key: "settings",
            icon: <SettingOutlined />,
            label: "Settings",
            onClick: () => navigate("/settings"),
        },
        {
            type: "divider",
        },
        {
            key: "logout",
            icon: <LogoutOutlined />,
            label: "Logout",
            onClick: handleLogout,
        },
    ];

    const notificationItems = notifications.map((item, index) => ({
        key: index,
        label: (
            <div>
                <strong>{item.product_name}</strong> is low in stock (
                {item.stock} remaining)
            </div>
        ),
    }));

    const menuItems = [
        {
            key: "dashboard",
            icon: <DashboardOutlined />,
            label: <Link to="/dashboard">Dashboard</Link>,
        },
        {
            key: "products",
            icon: <AppstoreOutlined />,
            label: <Link to="/products">Products</Link>,
        },
        {
            key: "orders",
            icon: <ShoppingCartOutlined />,
            label: <Link to="/orders">Orders</Link>,
        },
        {
            key: "purchases",
            icon: <ShoppingOutlined />,
            label: <Link to="/purchases">Purchases</Link>,
        },
        {
            key: "customers",
            icon: <UserOutlined />,
            label: <Link to="/customers">Customers</Link>,
        },
        {
            key: "suppliers",
            icon: <TeamOutlined />,
            label: <Link to="/suppliers">Suppliers</Link>,
        },
        {
            key: "categories",
            icon: <BarsOutlined />,
            label: <Link to="/categories">Categories</Link>,
        },
        {
            key: "reports",
            icon: <BarsOutlined />,
            label: "Reports",
            children: [
                {
                    key: "stock-report",
                    label: <Link to="/reports/stock">Stock Report</Link>,
                },
                {
                    key: "sales-report",
                    label: <Link to="/reports/sales">Sales Report</Link>,
                },
                {
                    key: "purchase-report",
                    label: <Link to="/reports/purchases">Purchase Report</Link>,
                },
            ],
        },
    ];

    // Find the currently selected menu item based on location
    const selectedKey = location.pathname.split("/")[1] || "dashboard";

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                width={230}
                style={{
                    overflow: "auto",
                    height: "100vh",
                    position: "fixed",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    background: "#001529",
                }}
            >
                <div
                    className="logo"
                    style={{
                        height: "64px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "white",
                        fontSize: collapsed ? "14px" : "18px",
                        fontWeight: "bold",
                        margin: "10px 0",
                    }}
                >
                    {collapsed ? "IMS" : "Inventory System"}
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={[selectedKey]}
                    selectedKeys={[selectedKey]}
                    items={menuItems}
                />
            </Sider>
            <Layout
                style={{
                    marginLeft: collapsed ? 80 : 230,
                    transition: "all 0.2s",
                }}
            >
                <Header
                    style={{
                        padding: 0,
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
                                    padding: "0 24px",
                                    cursor: "pointer",
                                },
                            }
                        )}
                        <h2 style={{ margin: 0 }}>
                            {/* Transform route to title, e.g., /dashboard -> Dashboard */}
                            {location.pathname
                                .split("/")[1]
                                .charAt(0)
                                .toUpperCase() +
                                location.pathname.split("/")[1].slice(1) ||
                                "Dashboard"}
                        </h2>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            marginRight: 24,
                        }}
                    >
                        <Dropdown
                            menu={{ items: notificationItems }}
                            placement="bottomRight"
                            trigger={["click"]}
                        >
                            <Badge
                                count={notifications.length}
                                overflowCount={99}
                            >
                                <BellOutlined
                                    style={{
                                        fontSize: "18px",
                                        marginRight: 24,
                                        cursor: "pointer",
                                    }}
                                />
                            </Badge>
                        </Dropdown>

                        <Dropdown
                            menu={{ items: userMenuItems }}
                            placement="bottomRight"
                            trigger={["click"]}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    cursor: "pointer",
                                }}
                            >
                                <Avatar
                                    src={user?.avatar}
                                    icon={!user?.avatar && <UserOutlined />}
                                    style={{ marginRight: 8 }}
                                />
                                <span>{user?.name || "User"}</span>
                            </div>
                        </Dropdown>
                    </div>
                </Header>
                <Content
                    style={{
                        margin: "24px 16px",
                        padding: 24,
                        minHeight: 280,
                        background: "#fff",
                        borderRadius: 4,
                        overflow: "auto",
                    }}
                >
                    {loading ? <Spin size="large" /> : <Outlet />}
                </Content>
            </Layout>
        </Layout>
    );
};

export default DashboardLayout;
