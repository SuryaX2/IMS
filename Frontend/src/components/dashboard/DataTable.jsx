import React from "react";
import { Card, Table, Button, Typography, Tooltip } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";

const { Link } = Typography;

const DataTable = ({ 
    title, 
    columns, 
    dataSource, 
    viewAllLink, 
    loading = false,
    pagination = false,
}) => {
    return (
        <Card 
            title={
                <span className="text-lg font-bold">{title}</span>
            } 
            extra={
                viewAllLink && (
                    <Tooltip title={`View all ${title.toLowerCase()}`}>
                        <Link href={viewAllLink} className="flex items-center">
                            View All <ArrowRightOutlined className="ml-1" />
                        </Link>
                    </Tooltip>
                )
            }
            className="shadow-sm hover:shadow-md transition-shadow"
            styles={{ padding: 0 }}
        >
            <Table
                columns={columns}
                dataSource={dataSource}
                rowKey="_id"
                pagination={pagination ? { pageSize: 5 } : false}
                size="middle"
                loading={loading}
                locale={{ 
                    emptyText: `No ${title.toLowerCase()} available` 
                }}
                className="antd-custom-table"
                scroll={{ x: 'max-content' }}
            />
        </Card>
    );
};

export default DataTable;