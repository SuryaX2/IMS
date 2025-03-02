import React, { useState, useEffect } from "react";
import { Layout, Button, Drawer } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { navLinks } from "../data";

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
            className={`px-4 flex items-center justify-between h-16 fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
                scrolled
                    ? "bg-white shadow-md"
                    : "bg-transparent"
                }`}
            style={{borderBottom: "none"}}
        >
            <div className="container mx-auto px-4 flex items-center justify-between">
                <div className="flex items-center">
                    <div
                        className={`text-2xl font-bold cursor-pointer transition-colors ${
                            scrolled ? "text-blue-600" : "text-white"
                        }`}
                        onClick={() => handleNavigation("/")}
                    >
                        InventoryPro
                    </div>
                </div>

                <div className="hidden md:flex items-center">
                    <nav className="mr-8">
                        <ul className="flex space-x-8">
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
                                        className={`font-medium hover:text-blue-300 transition-colors ${
                                            scrolled
                                                ? "text-gray-700"
                                                : "text-white"
                                        }`}
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <div className="flex items-center space-x-4">
                        <Button
                            onClick={() => handleNavigation("/login")}
                            className={
                                scrolled
                                    ? ""
                                    : "text-white border-white hover:text-white hover:border-blue-300"
                            }
                            ghost={!scrolled}
                        >
                            Login
                        </Button>
                        <Button
                            type="primary"
                            onClick={() => handleNavigation("/signup")}
                            className={`${scrolled ? "bg-blue-600 hover:bg-blue-700" : "bg-white text-blue-600 hover:bg-gray-100"} border-none`}
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
                                className={
                                    scrolled ? "text-blue-600" : "text-white"
                                }
                            />
                        }
                        onClick={showDrawer}
                        className="border-none shadow-none"
                    />
                </div>
            </div>

            <Drawer
                title={
                    <span className="text-xl font-bold text-blue-600">
                        InventoryPro
                    </span>
                }
                placement="right"
                onClose={closeDrawer}
                open={visible}
                width={280}
            >
                <div className="mt-4 space-y-4">
                    {navLinks.map((link) => (
                        <div
                            key={link.name}
                            className="py-2 border-b border-gray-100"
                        >
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
                                        setTimeout(() => closeDrawer(), 100);
                                    }
                                }}
                                className="text-gray-800 hover:text-blue-600 transition-colors text-lg"
                            >
                                {link.name}
                            </a>
                        </div>
                    ))}
                    <Button
                        block
                        onClick={() => handleNavigation("/login")}
                        className="mt-6"
                    >
                        Login
                    </Button>
                    <Button
                        block
                        type="primary"
                        onClick={() => handleNavigation("/signup")}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        Sign Up
                    </Button>
                </div>
            </Drawer>
        </Header>
    );
};

export default Navbar;
