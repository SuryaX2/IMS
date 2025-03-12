// components/layout/MobileMenu.jsx
import React from "react";
import { Menu } from "antd";
import { menuItems } from "../../data";

const MobileMenu = ({ collapsed, currentPage }) => {
    return (
        <div
            className="md:hidden overflow-hidden transition-all duration-300"
            style={{
                maxHeight: collapsed ? "0" : "70vh",
            }}
        >
            <div className="max-h-full overflow-y-auto pb-4">
                {" "}
                {/* Added scrollable container */}
                <Menu
                    theme="dark"
                    defaultSelectedKeys={[currentPage]}
                    mode="inline"
                    items={menuItems}
                    className="border-r-0"
                />
            </div>
        </div>
    );
};

export default MobileMenu;
