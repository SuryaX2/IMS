import React from "react";
import { Card, DatePicker, Row, Col, Button } from "antd";
import { CalendarOutlined, DownloadOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;

const DateRangeFilter = ({
    dateRange,
    onDateChange,
    onExport,
    exportDisabled = false,
    exportFileName = "report",
    allowClear = false,
}) => {
    return (
        <Card>
            <Row gutter={[16, 16]} align="middle">
                <Col xs={24} sm={12} md={8}>
                    <div className="flex items-center gap-2">
                        <CalendarOutlined />
                        <span className="font-medium">Select Date Range:</span>
                    </div>
                </Col>
                <Col xs={24} sm={12} md={10}>
                    <RangePicker
                        value={dateRange}
                        onChange={onDateChange}
                        format="YYYY-MM-DD"
                        style={{ width: "100%" }}
                        allowClear={allowClear}
                    />
                </Col>
                <Col xs={24} sm={24} md={6}>
                    <Button
                        type="primary"
                        icon={<DownloadOutlined />}
                        onClick={onExport}
                        disabled={exportDisabled}
                        block
                    >
                        Export CSV
                    </Button>
                </Col>
            </Row>
        </Card>
    );
};

export default DateRangeFilter;
