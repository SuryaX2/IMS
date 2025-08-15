import React from "react";
import { Table, Empty } from "antd";

const ReportTable = ({
    columns,
    dataSource = [],
    rowKey = "_id",
    title,
    loading = false,
    summary,
    pagination = {
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        defaultPageSize: 10,
        pageSizeOptions: ["10", "25", "50"],
    },
    scroll = { x: 600 },
    size = "middle",
    className = "custom-table",
    emptyDescription = "No data available for the selected period",
}) => {
    const renderSummary = (pageData) => {
        if (!summary) return null;

        const summaryData = summary.calculate
            ? summary.calculate(pageData)
            : summary.data;

        return (
            <Table.Summary.Row className="bg-gray-50">
                {summary.cells.map((cell, index) => (
                    <Table.Summary.Cell key={index} colSpan={cell.colSpan}>
                        {cell.render ? cell.render(summaryData) : cell.content}
                    </Table.Summary.Cell>
                ))}
            </Table.Summary.Row>
        );
    };

    if (dataSource.length === 0 && !loading) {
        return <Empty description={emptyDescription} />;
    }

    return (
        <Table
            columns={columns}
            dataSource={dataSource}
            rowKey={rowKey}
            loading={loading}
            pagination={pagination}
            scroll={scroll}
            size={size}
            className={className}
            summary={summary ? renderSummary : undefined}
            title={title ? () => title : undefined}
        />
    );
};

export default ReportTable;
