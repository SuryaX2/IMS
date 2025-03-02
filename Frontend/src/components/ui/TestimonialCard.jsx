import React from "react";
import { Card, Avatar, Rate } from "antd";
import { UserOutlined } from "@ant-design/icons";

const TestimonialCard = ({ name, company, rating, content }) => {
    return (
        <Card className="max-w-4xl mx-auto shadow-lg border-0 rounded-xl overflow-hidden">
            <div className="flex flex-col md:flex-row gap-8 md:items-center">
                <div className="md:w-1/3 flex flex-col items-center">
                    <div className="relative mb-4">
                        <div className="w-20 h-20 rounded-full bg-blue-100 absolute -top-2 -left-2"></div>
                        <Avatar
                            size={80}
                            icon={<UserOutlined />}
                            className="relative border-4 border-white shadow-md bg-gradient-to-r from-blue-500 to-blue-600"
                        />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">
                        {name}
                    </h2>
                    <p className="text-blue-600 font-medium mb-3">{company}</p>
                    <Rate
                        disabled
                        defaultValue={rating}
                        className="text-yellow-500"
                    />
                </div>

                <div className="md:w-2/3">
                    <div className="relative">
                        <p className="text-lg md:text-xl text-gray-700 italic md:pl-6">
                            {content}
                        </p>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default TestimonialCard;
