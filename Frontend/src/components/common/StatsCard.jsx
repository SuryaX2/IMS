import React from "react";
import { Card, Statistic, Col } from "antd";

const StatsCard = ({
    title,
    value,
    prefix,
    valueStyle,
    span = 6,
    gradient = "from-gray-50 to-gray-100/50",
    borderColor = "border-gray-200",
}) => {
    return (
        <Col xs={24} sm={12} lg={span}>
            <Card
                className={`h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border ${borderColor} bg-gradient-to-br ${gradient} backdrop-blur-sm`}
                styles={{
                    padding: "20px",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                }}
            >
                <div className="relative">
                    <Statistic
                        title={
                            <span className="text-gray-600 font-medium text-sm">
                                {title}
                            </span>
                        }
                        value={value}
                        prefix={
                            <span className="inline-block p-2 rounded-lg bg-white/60 backdrop-blur-sm mr-2">
                                {prefix}
                            </span>
                        }
                        valueStyle={{
                            ...valueStyle,
                            fontSize: "28px",
                            fontWeight: "700",
                            lineHeight: "1.2",
                        }}
                    />

                    {/* Decorative Element */}
                    <div className="absolute top-0 right-0 w-12 h-12 bg-white/30 rounded-full -translate-y-2 translate-x-2 opacity-50"></div>
                </div>
            </Card>
        </Col>
    );
};

export default StatsCard;
