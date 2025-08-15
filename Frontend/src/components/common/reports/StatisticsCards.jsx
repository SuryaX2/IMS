import React from "react";
import { Card, Row, Col, Statistic } from "antd";

const StatisticsCards = ({ statistics }) => {
    return (
        <Row gutter={[16, 16]}>
            {statistics.map((stat, index) => (
                <Col
                    key={index}
                    xs={24}
                    sm={12}
                    lg={stat.span || Math.floor(24 / statistics.length)}
                >
                    <Card>
                        <Statistic
                            title={stat.title}
                            value={stat.value}
                            prefix={stat.prefix}
                            suffix={stat.suffix}
                            precision={stat.precision}
                            valueStyle={stat.valueStyle}
                        />
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

export default StatisticsCards;
