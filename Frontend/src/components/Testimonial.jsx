import React from "react";
import { Carousel, Card, Avatar, Rate } from "antd";
import { UserOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { testimonials } from "../data";

const Testimonial = () => {
    const carouselRef = React.useRef();

    const nextSlide = () => {
        carouselRef.current.next();
    };

    const prevSlide = () => {
        carouselRef.current.prev();
    };

    return (
        <div
            className="py-16 md:py-24 bg-gradient-to-b from-white to-blue-50 relative overflow-hidden"
            id="testimonials"
        >
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-gray-50 to-transparent"></div>
            <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-blue-100 opacity-30"></div>
            <div className="absolute bottom-0 left-1/4 w-48 h-48 rounded-full bg-indigo-100 opacity-30"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <span className="text-blue-600 font-semibold mb-2 inline-block">
                        TESTIMONIALS
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                        What Our Customers Say
                    </h1>
                    <div className="w-24 h-1 bg-blue-600 mx-auto mt-6 rounded-full"></div>
                </div>

                <div className="relative">
                    <Carousel
                        autoplay
                        ref={carouselRef}
                        dots={false}
                        autoplaySpeed={2000}
                        className="pb-12"
                    >
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="px-4 py-6">
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
                                                {testimonial.name}
                                            </h2>
                                            <p className="text-blue-600 font-medium mb-3">
                                                {testimonial.company}
                                            </p>
                                            <Rate
                                                disabled
                                                defaultValue={
                                                    testimonial.rating
                                                }
                                                className="text-yellow-500"
                                            />
                                        </div>

                                        <div className="md:w-2/3">
                                            <div className="relative">
                                                <p className="text-lg md:text-xl text-gray-700 italic md:pl-6">
                                                    {testimonial.content}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        ))}
                    </Carousel>

                    {/* Custom navigation buttons */}
                    <button
                        onClick={prevSlide}
                        className="absolute top-1/2 left-0 md:-left-1 transform -translate-y-1/2 bg-white shadow-md text-blue-600 rounded-full h-10 w-10 flex items-center justify-center z-10 hover:bg-blue-50 transition-colors"
                        aria-label="Previous testimonial"
                    >
                        <LeftOutlined />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute top-1/2 right-0 md:-right-1 transform -translate-y-1/2 bg-white shadow-md text-blue-600 rounded-full h-10 w-10 flex items-center justify-center z-10 hover:bg-blue-50 transition-colors"
                        aria-label="Next testimonial"
                    >
                        <RightOutlined />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Testimonial;
