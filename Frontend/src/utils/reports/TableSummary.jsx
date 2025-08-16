import { Table } from "antd";
import { calculateSummary, getSummaryClass } from "./tableUtils";
import { renderSummaryCell } from "../../components/common/reports/TableComponents";

export const TableSummary = ({ pageData, summaryFields }) => {
    const totals = calculateSummary(pageData, summaryFields);
    if (!totals) return null;

    return (
        <Table.Summary.Row className="bg-gray-50">
            <Table.Summary.Cell>
                <strong>Page Total</strong>
            </Table.Summary.Cell>
            {summaryFields.map((field) => (
                <Table.Summary.Cell key={field}>
                    {renderSummaryCell(field, totals[field], getSummaryClass(field))}
                </Table.Summary.Cell>
            ))}
        </Table.Summary.Row>
    );
};
