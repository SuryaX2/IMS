import React, { useState } from "react";
import { Layout, Menu } from "antd";
import {
    DashboardOutlined,
    ShoppingOutlined,
    ShoppingCartOutlined,
    PlusCircleOutlined,
    UserOutlined,
    TeamOutlined,
    BarChartOutlined,
    LineChartOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const { Sider } = Layout;

const DashboardSidebar = ({ isAdmin }) => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Common sidebar items for both admin and user
    const commonItems = [
        {
            key: "/home",
            icon: <DashboardOutlined />,
            label: "Dashboard",
        },
        {
            key: "/products",
            icon: <ShoppingOutlined />,
            label: "Products",
        },
        {
            key: "/sales",
            icon: <ShoppingCartOutlined />,
            label: "Sales",
        },
        {
            key: "/purchases",
            icon: <ShoppingCartOutlined />,
            label: "Purchases",
        },
    ];

    // Admin-specific sidebar items
    const adminItems = [
        {
            key: "/add-product",
            icon: <PlusCircleOutlined />,
            label: "Add Product",
        },
        {
            key: "/users",
            icon: <TeamOutlined />,
            label: "User Management",
        },
        {
            key: "/reports",
            icon: <BarChartOutlined />,
            label: "Reports",
        },
        {
            key: "/analytics",
            icon: <LineChartOutlined />,
            label: "Analytics",
        },
    ];

    const items = isAdmin
        ? [...commonItems, ...adminItems]
        : [
              ...commonItems,
              {
                  key: "/add-product",
                  icon: <PlusCircleOutlined />,
                  label: "Add Product",
              },
          ];

    return (
        <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            theme="light"
            className="shadow-md"
        >
            <div className="p-4 h-16 flex items-center justify-center font-bold text-lg text-blue-600">
                {collapsed ? "IMS" : "Inventory System"}
            </div>
            <Menu
                theme="light"
                mode="inline"
                defaultSelectedKeys={[location.pathname]}
                items={items}
                onClick={({ key }) => navigate(key)}
            />
        </Sider>
    );
};

export default DashboardSidebar;
