import { useState, useEffect, useMemo } from "react";

const useTableFilters = (data, filterConfig = []) => {
    const [searchText, setSearchText] = useState("");
    const [filters, setFilters] = useState({});

    // Initialize filters with default values
    useEffect(() => {
        const initialFilters = {};
        filterConfig.forEach((config) => {
            initialFilters[config.key] = config.defaultValue || "all";
        });
        setFilters(initialFilters);
    }, [filterConfig]);

    // Apply filters
    const filteredData = useMemo(() => {
        let filtered = data;

        // Apply search filter
        if (searchText) {
            filtered = filtered.filter((item) =>
                filterConfig
                    .filter((config) => config.searchable)
                    .some((config) =>
                        item[config.dataIndex]
                            ?.toString()
                            .toLowerCase()
                            .includes(searchText.toLowerCase())
                    )
            );
        }

        // Apply other filters
        Object.keys(filters).forEach((filterKey) => {
            const filterValue = filters[filterKey];
            if (filterValue && filterValue !== "all") {
                const config = filterConfig.find((c) => c.key === filterKey);
                if (config) {
                    if (config.filterFunction) {
                        filtered = filtered.filter((item) =>
                            config.filterFunction(item, filterValue)
                        );
                    } else {
                        filtered = filtered.filter(
                            (item) => item[config.dataIndex] === filterValue
                        );
                    }
                }
            }
        });

        return filtered;
    }, [data, searchText, filters, filterConfig]);

    const handleSearchChange = (value) => {
        setSearchText(value);
    };

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const resetFilters = () => {
        setSearchText("");
        const resetFilters = {};
        filterConfig.forEach((config) => {
            resetFilters[config.key] = config.defaultValue || "all";
        });
        setFilters(resetFilters);
    };

    const getActiveFiltersCount = () => {
        let count = 0;
        if (searchText) count++;
        Object.values(filters).forEach((value) => {
            if (value && value !== "all") count++;
        });
        return count;
    };

    // Generate filter options for select components
    const generateFilterOptions = (key) => {
        const config = filterConfig.find((c) => c.key === key);
        if (!config) return [];

        if (config.options) return config.options;

        // Auto-generate options from data
        const uniqueValues = [
            ...new Set(data.map((item) => item[config.dataIndex])),
        ];
        return uniqueValues
            .filter((value) => value != null)
            .map((value) => ({
                label: value,
                value: value,
            }));
    };

    return {
        filteredData,
        searchText,
        filters,
        handleSearchChange,
        handleFilterChange,
        resetFilters,
        getActiveFiltersCount,
        generateFilterOptions,
    };
};

export default useTableFilters;
