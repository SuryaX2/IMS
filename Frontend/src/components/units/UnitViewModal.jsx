import React from "react";
import { Modal, Button, Typography, Tag, Divider } from "antd";
import { EditOutlined, CloseOutlined } from "@ant-design/icons";
import { formatDateTime } from "../../utils/category_units/dateUtils";
import {
    canEdit,
    getOwnershipText,
} from "../../utils/category_units/permissionUtils";

const { Title, Text } = Typography;

const UnitViewModal = ({ visible, onClose, unit, user, isAdmin, onEdit }) => {
    if (!unit) return null;

    const showEditButton = canEdit(unit, user, isAdmin);
    const createdByName = getOwnershipText(unit, user);
    const updatedByName = unit.updated_by?.username || createdByName;
    const isOwner = (unit.created_by?._id || unit.created_by) === user?._id;

    return (
        <Modal
            title={null}
            open={visible}
            onCancel={onClose}
            footer={null}
            width={600}
            className="unit-view-modal"
            style={{
                maxWidth: "calc(100vw - 32px)",
            }}
            styles={{
                body: { padding: 0 },
                header: { display: "none" },
            }}
        >
            <div className="bg-white">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                                <span className="text-white font-semibold text-lg">
                                    {unit.unit_name?.charAt(0)?.toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <Title level={4} className="mb-1 text-gray-900">
                                    {unit.unit_name}
                                </Title>
                                <Tag
                                    color={isOwner ? "success" : "processing"}
                                    className="border-0 rounded-full px-3 py-1 text-xs font-medium"
                                    style={{
                                        backgroundColor: isOwner
                                            ? "#f0fdf4"
                                            : "#fef3f2",
                                        color: isOwner ? "#166534" : "#b91c1c",
                                    }}
                                >
                                    {isOwner
                                        ? "Your Unit"
                                        : "Other User's Unit"}
                                </Tag>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Created Information */}
                        <div className="space-y-4">
                            <div>
                                <Text className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                                    Created Information
                                </Text>
                                <div className="mt-2 space-y-3">
                                    <div>
                                        <Text className="text-sm text-gray-600">
                                            Created By
                                        </Text>
                                        <div className="mt-1">
                                            <Text className="text-base font-medium text-gray-900">
                                                {createdByName}
                                            </Text>
                                        </div>
                                    </div>
                                    <div>
                                        <Text className="text-sm text-gray-600">
                                            Created At
                                        </Text>
                                        <div className="mt-1">
                                            <Text className="text-base text-gray-700">
                                                {formatDateTime(unit.createdAt)}
                                            </Text>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Updated Information */}
                        <div className="space-y-4">
                            <div>
                                <Text className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                                    Last Updated
                                </Text>
                                <div className="mt-2 space-y-3">
                                    <div>
                                        <Text className="text-sm text-gray-600">
                                            Updated By
                                        </Text>
                                        <div className="mt-1">
                                            <Text className="text-base font-medium text-gray-900">
                                                {updatedByName}
                                            </Text>
                                        </div>
                                    </div>
                                    <div>
                                        <Text className="text-sm text-gray-600">
                                            Updated At
                                        </Text>
                                        <div className="mt-1">
                                            <Text className="text-base text-gray-700">
                                                {formatDateTime(unit.updatedAt)}
                                            </Text>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Divider className="my-0" />

                {/* Footer Actions */}
                <div className="px-6 py-4 bg-gray-50 rounded-b-lg">
                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
                        <Button
                            onClick={onClose}
                            className="h-10 px-6 border-gray-200 text-gray-600 hover:text-gray-700 hover:border-gray-300"
                            style={{ borderRadius: "8px" }}
                        >
                            Close
                        </Button>
                        {showEditButton && (
                            <Button
                                type="primary"
                                icon={<EditOutlined />}
                                onClick={() => {
                                    onClose();
                                    onEdit(unit);
                                }}
                                className="h-10 px-6 bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700"
                                style={{
                                    borderRadius: "8px",
                                    fontWeight: 500,
                                }}
                            >
                                Edit Unit
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .unit-view-modal .ant-modal-content {
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow:
                        0 20px 25px -5px rgb(0 0 0 / 0.1),
                        0 8px 10px -6px rgb(0 0 0 / 0.1);
                }

                @media (max-width: 768px) {
                    .unit-view-modal {
                        margin: 16px;
                    }
                    .unit-view-modal .ant-modal-content {
                        border-radius: 12px;
                    }
                }
            `}</style>
        </Modal>
    );
};

export default UnitViewModal;
