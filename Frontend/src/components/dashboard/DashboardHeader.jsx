import React from "react";
import { Typography, Space, Button } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const DashboardHeader = ({ onRefresh }) => {
    const today = new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
                <h1 className="mb-1 text-4xl font-bold">Dashboard</h1>
                <p className="text-gray-500 text-base md:text-sm">
                    Welcome back! Here's what's happening with your inventory today.
                </p>
                <Text className="block text-sm text-gray-400 mt-1">{today}</Text>
            </div>
            {onRefresh && (
                <Button 
                    onClick={onRefresh}
                    icon={<ReloadOutlined />}
                    type="primary"
                    className="mt-4 md:mt-0"
                >
                    Refresh Data
                </Button>
            )}
        </div>
    );
};

export default DashboardHeader;