import { useState } from "react";
import dayjs from "dayjs";

const useDateRange = (defaultDays = 30) => {
    const [dateRange, setDateRange] = useState([
        dayjs().subtract(defaultDays, "day"),
        dayjs(),
    ]);

    const handleDateRangeChange = (dates) => {
        setDateRange(dates);
    };

    const getAPIParams = () => {
        if (!dateRange || !dateRange[0] || !dateRange[1]) return {};

        return {
            start_date: dateRange[0].format("YYYY-MM-DD"),
            end_date: dateRange[1].format("YYYY-MM-DD"),
        };
    };

    const resetToDefault = () => {
        setDateRange([dayjs().subtract(defaultDays, "day"), dayjs()]);
    };

    const setCustomRange = (startDate, endDate) => {
        setDateRange([dayjs(startDate), dayjs(endDate)]);
    };

    // Predefined ranges
    const presets = {
        today: () => setDateRange([dayjs(), dayjs()]),
        yesterday: () =>
            setDateRange([
                dayjs().subtract(1, "day"),
                dayjs().subtract(1, "day"),
            ]),
        thisWeek: () => setDateRange([dayjs().startOf("week"), dayjs()]),
        lastWeek: () =>
            setDateRange([
                dayjs().subtract(1, "week").startOf("week"),
                dayjs().subtract(1, "week").endOf("week"),
            ]),
        thisMonth: () => setDateRange([dayjs().startOf("month"), dayjs()]),
        lastMonth: () =>
            setDateRange([
                dayjs().subtract(1, "month").startOf("month"),
                dayjs().subtract(1, "month").endOf("month"),
            ]),
        last7Days: () => setDateRange([dayjs().subtract(7, "day"), dayjs()]),
        last30Days: () => setDateRange([dayjs().subtract(30, "day"), dayjs()]),
        last90Days: () => setDateRange([dayjs().subtract(90, "day"), dayjs()]),
    };

    return {
        dateRange,
        setDateRange,
        handleDateRangeChange,
        getAPIParams,
        resetToDefault,
        setCustomRange,
        presets,
    };
};

export default useDateRange;
