import React, { useEffect } from "react";
import { Row, Col } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useAuth } from "../hooks/useAuth";
import { useCategories } from "../hooks/categories_units/useCategories";
import { useUnits } from "../hooks/categories_units/useUnits";
import StatsSection from "../components/common/StatsSection";
import CategorySection from "../components/categories/CategorySection";
import UnitSection from "../components/units/UnitSection";

const CategoryUnit = () => {
    const { user, isAdmin } = useAuth();
    const { stats: categoryStats, loadCategories } = useCategories();
    const { stats: unitStats, loadUnits } = useUnits();

    useEffect(() => {
        loadCategories();
        loadUnits();
    }, [loadCategories, loadUnits]);

    return (
        <div className="p-6 bg-white min-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div className="mb-4 sm:mb-0">
                    <div className="flex-1 min-w-0">
                        <h1 className="truncate mb-1 text-4xl font-bold flex items-center gap-2">
                            Categories & Units
                            <InboxOutlined className="text-blue-600 inline-block ml-2" />
                        </h1>
                    </div>
                    <p className="text-gray-600 text-sm sm:text-base">
                        Manage your Categories and Units
                    </p>
                </div>
            </div>

            {/* Stats Section */}
            <StatsSection categoryStats={categoryStats} unitStats={unitStats} />

            {/* Main Content */}
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                    <CategorySection user={user} isAdmin={isAdmin} />
                </Col>
                <Col xs={24} lg={12}>
                    <UnitSection user={user} isAdmin={isAdmin} />
                </Col>
            </Row>
        </div>
    );
};

export default CategoryUnit;
