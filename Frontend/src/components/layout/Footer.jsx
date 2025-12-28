import React from "react";
import { Layout, Row, Col, Space, Divider } from "antd";
import {
    GithubOutlined,
    TwitterOutlined,
    LinkedinFilled,
    InstagramFilled,
    MailOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Footer: AntFooter } = Layout;

const Footer = () => {
    return (
        <AntFooter className="bg-blue-900 text-slate-400 pt-16 pb-6 ">
            <div className="container mx-auto px-6 max-w-6xl">
                <Row gutter={[64, 32]} justify="space-between" align="middle">
                    <Col xs={24} md={12} lg={14}>
                        <div>
                            <h1 className="text-2xl font-bold text-white mb-3 tracking-tight">
                                InventoryPro
                            </h1>
                            <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-md">
                                Smart inventory management for modern
                                businesses. Streamline operations and boost
                                efficiency.
                            </p>
                            <Space size="large" className="text-3xl">
                                <a
                                    href="https://github.com/SuryaX2"
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="GitHub"
                                    className="inline-flex items-center justify-center w-9 h-9 rounded-md transition-colors duration-200 hover:bg-slate-800/50"
                                >
                                    <GithubOutlined className="text-slate-400 hover:text-white" />
                                </a>
                                <a
                                    href="https://x.com/SuryaSekharSha2"
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="Twitter"
                                    className="inline-flex items-center justify-center w-9 h-9 rounded-md transition-colors duration-200 hover:bg-slate-800/50"
                                >
                                    <TwitterOutlined className="text-slate-400 hover:text-white" />
                                </a>
                                <a
                                    href="https://www.instagram.com/surya.sekhar.sharma"
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="Instagram"
                                    className="inline-flex items-center justify-center w-9 h-9 rounded-md transition-colors duration-200 hover:bg-slate-800/50"
                                >
                                    <InstagramFilled className="text-slate-400 hover:text-white" />
                                </a>
                                <a
                                    href="https://www.linkedin.com/in/suryax2"
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="LinkedIn"
                                    className="inline-flex items-center justify-center w-9 h-9 rounded-md transition-colors duration-200 hover:bg-slate-800/50"
                                >
                                    <LinkedinFilled className="text-slate-400 hover:text-white" />
                                </a>
                            </Space>
                        </div>
                    </Col>

                    <Col xs={24} md={12} lg={8}>
                        <div className="flex flex-col items-start md:items-end">
                            <h2 className="text-xs font-semibold text-white uppercase tracking-wider mb-5">
                                Get in Touch
                            </h2>
                            <a
                                href="mailto:sekharsurya111@gmail.com"
                                className="text-slate-400 text-sm hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                            >
                                <MailOutlined className="text-base group-hover:scale-110 transition-transform duration-200" />
                                sekharsurya111@gmail.com
                            </a>
                        </div>
                    </Col>
                </Row>

                <Divider className="bg-blue-100 my-10 opacity-40" />

                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 text-sm">
                        © {new Date().getFullYear()} InventoryPro. All rights
                        reserved.
                    </p>
                    <div className="flex gap-8">
                        <Link
                            to="/privacy"
                            className="text-slate-500 text-sm hover:text-white transition-colors duration-200"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            to="/terms"
                            className="text-slate-500 text-sm hover:text-white transition-colors duration-200"
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
