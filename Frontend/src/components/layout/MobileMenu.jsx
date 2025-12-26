// components/layout/MobileMenu.jsx
import React from "react";
import { Menu } from "antd";
import { menuItems } from "../../data";

const MobileMenu = ({ collapsed, currentPage }) => {
    return (
        <div
            className="md:hidden fixed top-16 left-0 right-0 transition-all duration-300 ease-in-out"
            style={{
                maxHeight: !collapsed ? "calc(100vh - 4rem)" : "0",
                opacity: !collapsed ? 1 : 0,
                pointerEvents: !collapsed ? "auto" : "none",
                zIndex: 999,
            }}
        >
            <div className="h-full bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 shadow-2xl border-b border-indigo-900/20">
                <div className="px-4 py-3 h-full flex flex-col">
                    <div className="flex-1 bg-gray-800/40 backdrop-blur-md rounded-xl overflow-hidden border border-gray-700/40 shadow-inner">
                        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-600/80 scrollbar-track-gray-800/20 hover:scrollbar-thumb-indigo-500">
                            <Menu
                                theme="dark"
                                selectedKeys={[currentPage]}
                                mode="inline"
                                items={menuItems}
                                className="border-r-0"
                                style={{
                                    background: "transparent",
                                    padding: "0.5rem",
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileMenu;
