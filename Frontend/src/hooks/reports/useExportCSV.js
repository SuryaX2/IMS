import { useCallback } from "react";
import dayjs from "dayjs";

const useExportCSV = () => {
    const exportToCSV = useCallback((data, headers, filename) => {
        if (!data || data.length === 0) {
            console.warn("No data to export");
            return;
        }

        // Create CSV content
        const csvContent = [
            headers.join(","),
            ...data.map((row) => {
                return headers
                    .map((header) => {
                        const value =
                            row[header] || row[header.toLowerCase()] || "";
                        // Handle values that might contain commas
                        return typeof value === "string" && value.includes(",")
                            ? `"${value}"`
                            : value;
                    })
                    .join(",");
            }),
        ].join("\n");

        // Create and trigger download
        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = `${filename}-${dayjs().format("YYYY-MM-DD")}.csv`;
        link.style.display = "none";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }, []);

    const exportCustomCSV = useCallback((data, customMapper, filename) => {
        if (!data || data.length === 0) {
            console.warn("No data to export");
            return;
        }

        const csvData = data.map(customMapper);
        const headers = Object.keys(csvData[0] || {});

        const csvContent = [
            headers.join(","),
            ...csvData.map((row) =>
                headers
                    .map((header) => {
                        const value = row[header] || "";
                        return typeof value === "string" && value.includes(",")
                            ? `"${value}"`
                            : value;
                    })
                    .join(",")
            ),
        ].join("\n");

        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = `${filename}-${dayjs().format("YYYY-MM-DD")}.csv`;
        link.style.display = "none";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }, []);

    return { exportToCSV, exportCustomCSV };
};

export default useExportCSV;
