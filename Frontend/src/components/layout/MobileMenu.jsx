// components/layout/MobileMenu.jsx
import React from "react";
import { Menu } from "antd";
import { menuItems } from "../../data";

const MobileMenu = ({ collapsed, currentPage }) => {
    return (
        <div
            className="md:hidden overflow-hidden transition-all duration-300"
            style={{
                maxHeight: collapsed ? "0" : "300px",
                background: "linear-gradient(to bottom, #1a237e, #283593)",
            }}
        >
            <Menu
                theme="dark"
                defaultSelectedKeys={[currentPage]}
                mode="inline"
                items={menuItems}
                className="border-r-0"
                style={{
                    background: "transparent",
                }}
            />
        </div>
    );
};

export default MobileMenu;
