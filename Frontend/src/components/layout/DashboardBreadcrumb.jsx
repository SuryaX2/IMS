// components/layout/DashboardBreadcrumb.jsx
import React from "react";
import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";

const DashboardBreadcrumb = ({ pathSegments }) => {
    // Generate breadcrumb items based on the path segments
    const breadcrumbItems = [
        { title: <Link to="/dashboard">Dashboard</Link> },
        ...pathSegments.map((segment, index) => {
            const url = `/${pathSegments.slice(0, index + 1).join("/")}`;
            const title = segment.charAt(0).toUpperCase() + segment.slice(1);
            return {
                title:
                    index === pathSegments.length - 1 ? (
                        title
                    ) : (
                        <Link to={url}>{title}</Link>
                    ),
            };
        }),
    ];

    return (
        <Breadcrumb
            items={breadcrumbItems}
            className="mb-4 px-3 py-2 bg-white rounded-md text-sm border border-gray-100 shadow-sm"
        />
    );
};

export default DashboardBreadcrumb;
