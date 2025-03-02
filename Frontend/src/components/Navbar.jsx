import React, { useContext, useState } from "react";
import { Layout, Avatar, Menu, Dropdown, Badge } from "antd";
import {
    UserOutlined,
    BellOutlined,
    LogoutOutlined,
    SettingOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const { Header } = Layout;

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const [notifications] = useState(5); // Example notification count

    const handleLogout = () => {
        logout();
    };

    const userMenu = (
        <Menu>
            <Menu.Item key="profile" icon={<UserOutlined />}>
                <Link to="/profile">View Profile</Link>
            </Menu.Item>
            <Menu.Item key="settings" icon={<SettingOutlined />}>
                <Link to="/settings">Settings</Link>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
                key="logout"
                icon={<LogoutOutlined />}
                onClick={handleLogout}
            >
                Logout
            </Menu.Item>
        </Menu>
    );

    return (
        <Header
            className="bg-white px-6 flex justify-end items-center shadow-sm z-10"
            style={{ padding: "0 24px" }}
        >
            <div className="flex items-center">
                <Badge count={notifications} className="mr-4">
                    <BellOutlined className="text-xl cursor-pointer hover:text-blue-500 transition-colors" />
                </Badge>

                <Dropdown
                    overlay={userMenu}
                    trigger={["click"]}
                    placement="bottomRight"
                >
                    <div className="flex items-center cursor-pointer">
                        <span className="mr-2 hidden sm:inline">
                            {user?.username}
                        </span>
                        <Avatar
                            src={user?.avatar}
                            icon={!user?.avatar && <UserOutlined />}
                            className="cursor-pointer"
                        />
                    </div>
                </Dropdown>
            </div>
        </Header>
    );
};

export default Navbar;
