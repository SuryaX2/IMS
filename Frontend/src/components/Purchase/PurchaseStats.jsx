import React from "react";
import { Row, Col, Card, Statistic } from "antd";
import {
    ClockCircleOutlined,
    CheckCircleOutlined,
    UndoOutlined,
} from "@ant-design/icons";

const PurchaseStats = ({ stats }) => {
    return (
        <Row gutter={16} className="mb-6">
            <Col span={6}>
                <Card>
                    <Statistic
                        title="Total Purchases"
                        value={stats.total}
                        valueStyle={{ color: "#1890ff" }}
                    />
                </Card>
            </Col>
            <Col span={6}>
                <Card>
                    <Statistic
                        title="Pending"
                        value={stats.pending}
                        valueStyle={{ color: "#faad14" }}
                        prefix={<ClockCircleOutlined />}
                    />
                </Card>
            </Col>
            <Col span={6}>
                <Card>
                    <Statistic
                        title="Completed"
                        value={stats.completed}
                        valueStyle={{ color: "#52c41a" }}
                        prefix={<CheckCircleOutlined />}
                    />
                </Card>
            </Col>
            <Col span={6}>
                <Card>
                    <Statistic
                        title="Returned"
                        value={stats.returned}
                        valueStyle={{ color: "#ff4d4f" }}
                        prefix={<UndoOutlined />}
                    />
                </Card>
            </Col>
        </Row>
    );
};

export default PurchaseStats;
