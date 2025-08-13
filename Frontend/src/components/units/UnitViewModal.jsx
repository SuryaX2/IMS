import React from "react";
import { Modal, Button, Row, Col, Typography, Tag } from "antd";
import { AppstoreOutlined, EditOutlined } from "@ant-design/icons";
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

    return (
        <Modal
            title={
                <div className="flex items-center space-x-2">
                    <AppstoreOutlined className="text-green-500" />
                    <span>Unit Details</span>
                </div>
            }
            open={visible}
            onCancel={onClose}
            footer={null}
            width={600}
        >
            <div className="space-y-4 mt-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <div className="flex justify-between items-center mb-4">
                                <Title level={4} className="mb-0">
                                    {unit.unit_name}
                                </Title>
                                <Tag
                                    color={
                                        (unit.created_by?._id ||
                                            unit.created_by) === user?._id
                                            ? "green"
                                            : "blue"
                                    }
                                >
                                    {(unit.created_by?._id ||
                                        unit.created_by) === user?._id
                                        ? "Your Unit"
                                        : "Other User's Unit"}
                                </Tag>
                            </div>
                        </Col>
                        <Col span={12}>
                            <Text strong>Created By:</Text>
                            <br />
                            <Text>{createdByName}</Text>
                        </Col>
                        <Col span={12}>
                            <Text strong>Created At:</Text>
                            <br />
                            <Text>{formatDateTime(unit.createdAt)}</Text>
                        </Col>
                        <Col span={12}>
                            <Text strong>Updated By:</Text>
                            <br />
                            <Text>{updatedByName}</Text>
                        </Col>
                        <Col span={12}>
                            <Text strong>Last Updated:</Text>
                            <br />
                            <Text>{formatDateTime(unit.updatedAt)}</Text>
                        </Col>
                    </Row>
                </div>

                <div className="flex justify-end space-x-2">
                    {showEditButton && (
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => {
                                onClose();
                                onEdit(unit);
                            }}
                        >
                            Edit Unit
                        </Button>
                    )}
                    <Button onClick={onClose}>Close</Button>
                </div>
            </div>
        </Modal>
    );
};

export default UnitViewModal;
