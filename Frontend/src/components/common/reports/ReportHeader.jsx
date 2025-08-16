import React from "react";
import { Card, Row, Col, DatePicker, Button } from "antd";
import { CalendarOutlined, DownloadOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;

const ReportHeader = ({
    dateRange,
    onDateChange,
    onExport,
    loading = false,
    hasData = false,
    showDateRange = true,
    showExport = true,
    title = "Select Date Range:",
    exportText = "Export CSV",
}) => {
    return (
        <Card>
            <Row gutter={[16, 16]} align="middle">
                {showDateRange && (
                    <>
                        <Col xs={24} sm={12} md={8}>
                            <div className="flex items-center gap-2">
                                <CalendarOutlined />
                                <span className="font-medium">{title}</span>
                            </div>
                        </Col>
                        <Col xs={24} sm={12} md={showExport ? 10 : 16}>
                            <RangePicker
                                value={dateRange}
                                onChange={onDateChange}
                                format="YYYY-MM-DD"
                                style={{ width: "100%" }}
                                allowClear={false}
                            />
                        </Col>
                    </>
                )}
                {showExport && (
                    <Col xs={24} sm={24} md={6}>
                        <Button
                            type="primary"
                            icon={<DownloadOutlined />}
                            onClick={onExport}
                            disabled={!hasData || loading}
                            loading={loading}
                            block
                        >
                            {exportText}
                        </Button>
                    </Col>
                )}
            </Row>
        </Card>
    );
};

export default ReportHeader;
