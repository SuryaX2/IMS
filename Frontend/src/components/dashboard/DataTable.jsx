import React from "react";
import { Card, Table, Typography, Tooltip, Badge } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";

const { Link } = Typography;

const DataTable = ({
    title,
    columns,
    dataSource,
    viewAllLink,
    loading = false,
    pagination = false,
    icon = null,
}) => {
    return (
        <Card
            title={
                <div className="flex items-center">
                    {icon && <span className="mr-2 text-primary">{icon}</span>}
                    <span className="text-lg font-medium">{title}</span>
                    {dataSource?.length > 0 && (
                        <Badge
                            count={dataSource.length}
                            className="ml-2"
                            style={{
                                backgroundColor: "#e6f7ff",
                                color: "#1890ff",
                                fontWeight: "bold",
                                boxShadow: "none",
                            }}
                        />
                    )}
                </div>
            }
            extra={
                viewAllLink && (
                    <Tooltip title={`View all ${title.toLowerCase()}`}>
                        <Link
                            href={viewAllLink}
                            className="flex items-center text-primary hover:text-primary-dark transition-colors"
                        >
                            View All <ArrowRightOutlined className="ml-1" />
                        </Link>
                    </Tooltip>
                )
            }
            className="overflow-hidden rounded-lg border-0 shadow hover:shadow-md transition-all duration-300"
            bodyStyle={{ padding: 0 }}
            headStyle={{
                borderBottom: "1px solid #f0f0f0",
                padding: "16px 24px",
                backgroundColor: "#fafafa",
            }}
        >
            <Table
                columns={columns}
                dataSource={dataSource}
                rowKey="_id"
                pagination={
                    pagination
                        ? {
                              pageSize: 5,
                              size: "small",
                              showSizeChanger: false,
                              className: "px-6 py-4",
                          }
                        : false
                }
                size="middle"
                loading={loading}
                locale={{
                    emptyText: (
                        <div className="py-8 text-gray-400">
                            No {title.toLowerCase()} available
                        </div>
                    ),
                }}
                className="antd-custom-table"
                scroll={{ x: "max-content" }}
                rowClassName="hover:bg-blue-50 transition-colors"
            />
        </Card>
    );
};

export default DataTable;
