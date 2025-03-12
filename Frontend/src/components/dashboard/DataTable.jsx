import React from "react";
import { Card, Table, Tag } from "antd";

const DataTable = ({ title, columns, dataSource, viewAllLink }) => {
    return (
        <Card title={title} extra={<a href={viewAllLink}>View All</a>}>
            <Table
                columns={columns}
                dataSource={dataSource}
                rowKey="_id"
                pagination={false}
                size="small"
                locale={{ emptyText: `No ${title.toLowerCase()} available` }}
            />
        </Card>
    );
};

export default DataTable;
