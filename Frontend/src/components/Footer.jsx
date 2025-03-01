import React from "react";
import { Layout, Row, Col, Space, Divider } from "antd";
import {
    GithubOutlined,
    TwitterOutlined,
    LinkedinFilled,
    InstagramFilled,
    MailOutlined,
    TeamOutlined,
    PhoneOutlined,
    GlobalOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Footer: AntFooter } = Layout;

const Footer = () => {
    return (
        <AntFooter className="bg-gradient-to-r from-blue-900 to-blue-800 text-white pt-16 pb-8">
            <div className="container mx-auto px-4">
                <Row gutter={[48, 32]}>
                    <Col xs={24} sm={12} md={6}>
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold text-white mb-4">
                                InventoryPro
                            </h1>
                            <p className="text-gray-300 mb-6">
                                Smart inventory management for modern
                                businesses. Streamline operations and boost
                                efficiency.
                            </p>
                            <Space size="large" className="text-xl">
                                <a
                                    href="https://github.com/SuryaX2"
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="GitHub"
                                >
                                    <GithubOutlined className="text-gray-300 hover:text-white transition-colors" />
                                </a>
                                <a
                                    href="https://x.com/SuryaSekharSha2"
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="Twitter"
                                >
                                    <TwitterOutlined className="text-gray-300 hover:text-white transition-colors" />
                                </a>
                                <a
                                    href="https://www.instagram.com/suryasekhar.sharma.1"
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="Instagram"
                                >
                                    <InstagramFilled className="text-gray-300 hover:text-white transition-colors" />
                                </a>
                                <a
                                    href="https://www.linkedin.com/in/suryax2"
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="LinkedIn"
                                >
                                    <LinkedinFilled className="text-gray-300 hover:text-white transition-colors" />
                                </a>
                            </Space>
                        </div>
                    </Col>

                    <Col xs={24} sm={12} md={6}>
                        <h2 className="text-xl font-bold text-white mb-6">
                            Product
                        </h2>
                        <ul className="space-y-3 p-0 list-none">
                            <li>
                                <Link
                                    to="/features"
                                    className="text-gray-300 hover:text-white transition-colors flex items-center"
                                >
                                    Features
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/pricing"
                                    className="text-gray-300 hover:text-white transition-colors flex items-center"
                                >
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/integrations"
                                    className="text-gray-300 hover:text-white transition-colors flex items-center"
                                >
                                    Integrations
                                </Link>
                            </li>
                        </ul>
                    </Col>

                    <Col xs={24} sm={12} md={6}>
                        <h2 className="text-xl font-bold text-white mb-6">
                            Support
                        </h2>
                        <ul className="space-y-3 p-0 list-none">
                            <li>
                                <Link
                                    to="/help"
                                    className="text-gray-300 hover:text-white transition-colors flex items-center"
                                >
                                    Help Center
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/community"
                                    className="text-gray-300 hover:text-white transition-colors flex items-center"
                                >
                                    <TeamOutlined className="mr-2" />
                                    Community
                                </Link>
                            </li>
                            <li>
                                <a
                                    href="mailto:sekharsurya111@gmail.com"
                                    className="text-gray-300 hover:text-white transition-colors flex items-center"
                                >
                                    <MailOutlined className="mr-2" />
                                    Contact Us
                                </a>
                            </li>
                        </ul>
                    </Col>

                    <Col xs={24} sm={12} md={6}>
                        <h2 className="text-xl font-bold text-white mb-6">
                            Company
                        </h2>
                        <ul className="space-y-3 p-0 list-none">
                            <li>
                                <Link
                                    to="/about"
                                    className="text-gray-300 hover:text-white transition-colors flex items-center"
                                >
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/blog"
                                    className="text-gray-300 hover:text-white transition-colors flex items-center"
                                >
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/careers"
                                    className="text-gray-300 hover:text-white transition-colors flex items-center"
                                >
                                    Careers
                                </Link>
                            </li>
                        </ul>
                    </Col>
                </Row>

                <Divider className="bg-blue-700 my-8 opacity-50" />

                <div className="flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-300 mb-4 md:mb-0">
                        © {new Date().getFullYear()} InventoryPro. All rights
                        reserved.
                    </p>
                    <div className="flex space-x-6">
                        <Link
                            to="/privacy"
                            className="text-gray-300 hover:text-white transition-colors"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            to="/terms"
                            className="text-gray-300 hover:text-white transition-colors"
                        >
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </AntFooter>
    );
};

export default Footer;
