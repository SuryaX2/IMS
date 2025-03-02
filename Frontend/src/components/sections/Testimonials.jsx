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
            className="py-16 md:py-24"
            type="white-to-blue"
        >
            <SectionTitle
                overline="TESTIMONIALS"
                title="What Our Customers Say"
            />

            <div className="relative">
                <Carousel
                    autoplay
                    ref={carouselRef}
                    dots={false}
                    autoplaySpeed={5000}
                    className="pb-12"
                >
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="px-4 py-6">
                            <TestimonialCard {...testimonial} />
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
        </GradientBackground>
    );
};

export default Testimonials;
