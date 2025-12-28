import React from "react";
import { Carousel } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import SectionTitle from "../common/SectionTitle";
import TestimonialCard from "../ui/TestimonialCard";
import GradientBackground from "../common/GradientBackground";

const Testimonials = ({ testimonials }) => {
    const carouselRef = React.useRef();

    const nextSlide = () => {
        carouselRef.current.next();
    };

    const prevSlide = () => {
        carouselRef.current.prev();
    };

    return (
        <GradientBackground
            id="testimonials"
            className="py-20 md:py-28"
            type="white-to-blue"
        >
            <div className="mb-16">
                <SectionTitle
                    overline="TESTIMONIALS"
                    title="What Our Customers Say"
                />
            </div>

            <div className="relative max-w-5xl mx-auto px-4 md:px-8">
                <Carousel
                    autoplay
                    ref={carouselRef}
                    dots={false}
                    autoplaySpeed={5000}
                    className="pb-8"
                >
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="px-2 md:px-6 py-4">
                            <TestimonialCard {...testimonial} />
                        </div>
                    ))}
                </Carousel>

                <button
                    onClick={prevSlide}
                    className="absolute top-1/2 -left-4 md:-left-12 transform -translate-y-1/2 bg-white/95 backdrop-blur-sm shadow-lg text-gray-700 rounded-full h-11 w-11 flex items-center justify-center z-10 hover:bg-blue-50 hover:text-blue-600 hover:shadow-xl transition-all duration-200"
                    aria-label="Previous testimonial"
                >
                    <LeftOutlined className="text-base" />
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute top-1/2 -right-4 md:-right-12 transform -translate-y-1/2 bg-white/95 backdrop-blur-sm shadow-lg text-gray-700 rounded-full h-11 w-11 flex items-center justify-center z-10 hover:bg-blue-50 hover:text-blue-600 hover:shadow-xl transition-all duration-200"
                    aria-label="Next testimonial"
                >
                    <RightOutlined className="text-base" />
                </button>
            </div>
        </GradientBackground>
    );
};

export default Testimonials;
