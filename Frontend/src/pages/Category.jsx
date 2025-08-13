import React, { useEffect } from "react";
import { Row, Col, Card, Divider } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useAuth } from "../hooks/useAuth";
import { useCategories } from "../hooks/categories_units/useCategories";
import { useUnits } from "../hooks/categories_units/useUnits";
import PageHeader from "../components/common/PageHeader";
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
        <div className="min-h-screen p-6 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Enhanced Header */}
                <div className="mb-8">
                    <PageHeader
                        title="Categories & Units"
                        subtitle="Manage your inventory categories and units"
                        icon={<InboxOutlined />}
                    />
                </div>

                <div className="mb-8">
                    <StatsSection
                        categoryStats={categoryStats}
                        unitStats={unitStats}
                    />
                </div>

                {/* Main Content with Enhanced Layout */}
                <Row gutter={[24, 24]}>
                    <Col xs={24} xl={12}>
                        <div className="h-full">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-100 h-full">
                                <CategorySection
                                    user={user}
                                    isAdmin={isAdmin}
                                />
                            </div>
                        </div>
                    </Col>
                    <Col xs={24} xl={12}>
                        <div className="h-full">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-100 h-full">
                                <UnitSection user={user} isAdmin={isAdmin} />
                            </div>
                        </div>
                    </Col>
                </Row>

                {/* Optional Divider for Visual Separation */}
            </div>
        </div>
    );
};

export default CategoryUnit;
