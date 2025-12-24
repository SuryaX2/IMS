import React from "react";
import { Typography, Button } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

const { Text } = Typography;

const DashboardHeader = ({ onRefresh }) => {
    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <header className="bg-white border-b border-gray-200 px-6 py-5">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="mb-1 text-4xl font-bold">Dashboard</h1>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
                        <Text className="text-sm text-gray-600">
                            Welcome back! Here's what's happening with your
                            inventory today.
                        </Text>
                        <Text className="text-xs text-gray-400 sm:border-l sm:border-gray-300 sm:pl-3">
                            {today}
                        </Text>
                    </div>
                </div>
                {onRefresh && (
                    <Button
                        onClick={onRefresh}
                        icon={<ReloadOutlined />}
                        type="primary"
                        size="middle"
                        className="shrink-0"
                    >
                        <span className="hidden sm:inline">Refresh</span>
                    </Button>
                )}
            </div>
        </header>
    );
};

export default DashboardHeader;
