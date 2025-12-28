import React, { useState, useEffect } from "react";
import { Layout, Button, Drawer } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { navLinks } from "../../data";

const { Header } = Layout;

const Navbar = () => {
    const [visible, setVisible] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const showDrawer = () => {
        setVisible(true);
    };

    const closeDrawer = () => {
        setVisible(false);
    };

    const handleNavigation = (path) => {
        navigate(path);
        closeDrawer();
    };

    return (
        <Header
            className={`px-0 flex items-center justify-between h-16 fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
                scrolled
                    ? "bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100"
                    : "bg-transparent"
            }`}
            style={{ borderBottom: "none" }}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                <div className="flex items-center">
                    <div
                        className={`text-2xl font-semibold cursor-pointer transition-colors duration-200 tracking-tight ${
                            scrolled ? "text-blue-600" : "text-white"
                        }`}
                        onClick={() => handleNavigation("/")}
                    >
                        InventoryPro
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-8">
                    <nav>
                        <ul className="flex items-center gap-8">
                            {navLinks.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            const anchor =
                                                document.getElementById(
                                                    link.path
                                                );
                                            e.preventDefault();
                                            anchor.scrollIntoView({
                                                behavior: "smooth",
                                                block: "center",
                                            });
                                        }}
                                        className={`text-sm font-medium transition-all duration-200 relative group ${
                                            scrolled
                                                ? "text-gray-600 hover:text-gray-900"
                                                : "text-white/90 hover:text-white"
                                        }`}
                                    >
                                        {link.name}
                                        <span
                                            className={`absolute left-0 -bottom-1 w-0 h-0.5 transition-all duration-200 group-hover:w-full ${
                                                scrolled
                                                    ? "bg-gray-900"
                                                    : "bg-white"
                                            }`}
                                        ></span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <div className="flex items-center gap-3">
                        <Button
                            onClick={() => handleNavigation("/login")}
                            className={`h-9 px-5 text-sm font-medium border rounded-xl transition-all duration-200 ${
                                scrolled
                                    ? "border-gray-200 text-gray-700 hover:border-gray-300 hover:text-gray-900 bg-transparent"
                                    : "border-white/30 text-white hover:border-white hover:bg-white/10 bg-transparent"
                            }`}
                        >
                            Login
                        </Button>
                        <Button
                            onClick={() => handleNavigation("/signup")}
                            className={`h-9 px-5 text-sm font-medium rounded-xl border-0 transition-all duration-200 shadow-sm hover:shadow ${
                                scrolled
                                    ? "bg-blue-600 text-white hover:bg-blue-700"
                                    : "bg-white text-blue-600 hover:bg-gray-50"
                            }`}
                        >
                            Sign Up
                        </Button>
                    </div>
                </div>

                <div className="md:hidden">
                    <Button
                        type="text"
                        icon={
                            <MenuOutlined
                                className={`text-xl ${
                                    scrolled ? "text-gray-900" : "text-white"
                                }`}
                            />
                        }
                        onClick={showDrawer}
                        className="border-0 shadow-none hover:bg-transparent"
                    />
                </div>
            </div>

            <Drawer
                title={
                    <span className="text-lg font-semibold text-gray-900 tracking-tight">
                        InventoryPro
                    </span>
                }
                placement="right"
                onClose={closeDrawer}
                open={visible}
                width={280}
                styles={{
                    header: {
                        borderBottom: "1px solid #f0f0f0",
                        padding: "20px 24px",
                    },
                    body: {
                        padding: "24px",
                    },
                }}
            >
                <div className="flex flex-col h-full">
                    <nav className="flex-1">
                        {navLinks.map((link) => (
                            <div key={link.name} className="mb-1">
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const anchor = document.getElementById(
                                            link.path
                                        );
                                        if (anchor) {
                                            anchor.scrollIntoView({
                                                behavior: "smooth",
                                                block: "start",
                                            });
                                            setTimeout(
                                                () => closeDrawer(),
                                                100
                                            );
                                        }
                                    }}
                                    className="block py-3 px-4 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200 text-sm font-medium"
                                >
                                    {link.name}
                                </a>
                            </div>
                        ))}
                    </nav>
                    <div className="flex flex-col gap-3 pt-6 border-t border-gray-100">
                        <Button
                            block
                            onClick={() => handleNavigation("/login")}
                            className="h-10 text-sm font-medium border-gray-200 text-gray-700 hover:border-gray-300 hover:text-gray-900 rounded-xl"
                        >
                            Login
                        </Button>
                        <Button
                            block
                            onClick={() => handleNavigation("/signup")}
                            className="h-10 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white border-0 rounded-xl shadow-sm"
                        >
                            Sign Up
                        </Button>
                    </div>
                </div>
            </Drawer>
        </Header>
    );
};

export default Navbar;
