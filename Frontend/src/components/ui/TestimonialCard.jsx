import React from "react";
import { Card, Avatar, Rate } from "antd";
import { UserOutlined } from "@ant-design/icons";

const TestimonialCard = ({ name, company, rating, content }) => {
    return (
        <Card className="max-w-4xl mx-auto shadow-sm hover:shadow-md transition-shadow duration-300 border-0 rounded-2xl overflow-hidden bg-white">
            <div className="flex flex-col md:flex-row gap-6 md:gap-10 p-2 md:p-4">
                <div className="md:w-1/3 flex flex-col items-center text-center pt-2">
                    <div className="relative mb-5">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 absolute -top-1 -left-1 opacity-60"></div>
                        <Avatar
                            size={88}
                            icon={<UserOutlined />}
                            className="relative border-4 border-white shadow-lg bg-gradient-to-br from-blue-500 to-blue-600"
                        />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1 tracking-tight">
                        {name}
                    </h3>
                    <p className="text-sm text-blue-600 font-medium mb-4">
                        {company}
                    </p>
                    <Rate
                        disabled
                        defaultValue={rating}
                        className="text-amber-400 text-base"
                    />
                </div>

                <div className="md:w-2/3 flex items-center">
                    <div className="relative">
                        <svg
                            className="absolute -top-3 -left-2 w-8 h-8 text-blue-100 opacity-50"
                            fill="currentColor"
                            viewBox="0 0 32 32"
                        >
                            <path d="M10 8c-3.3 0-6 2.7-6 6v10h8V14h-4c0-2.2 1.8-4 4-4V8zm14 0c-3.3 0-6 2.7-6 6v10h8V14h-4c0-2.2 1.8-4 4-4V8z" />
                        </svg>
                        <p className="text-base md:text-lg text-gray-600 leading-relaxed italic pl-6 pr-2">
                            {content}
                        </p>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default TestimonialCard;
