import React from "react";
import { Modal, Row, Col, Typography, Tag, Button, Space } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { formatDateTime } from "../../utils/dateUtils";
import {
    canEdit,
    getOwnershipTag,
    getOwnershipText,
} from "../../utils/permissionUtils";
import { MODAL_WIDTH } from "../../utils/constants";

const { Title, Text } = Typography;

const ViewDetailsModal = ({
    visible,
    onClose,
    item,
    user,
    isAdmin,
    title,
    icon: Icon,
    nameField,
    onEdit,
    iconColor = "text-blue-500",
    tagText = "Item",
}) => {
    if (!item) return null;

    return (
        <Modal
            title={
                <div className="flex items-center space-x-2">
                    <Icon className={iconColor} />
                    <span>{title}</span>
                </div>
            }
            open={visible}
            onCancel={onClose}
            footer={null}
            width={MODAL_WIDTH.VIEW}
        >
            <div className="space-y-4 mt-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <div className="flex justify-between items-center">
                                <Title level={4} className="mb-0">
                                    {item[nameField]}
                                </Title>
                                <Tag color={getOwnershipTag(item, user)}>
                                    {getOwnershipText(item, user)} {tagText}
                                </Tag>
                            </div>
                        </Col>
                        <Col span={12}>
                            <Text strong>Created By:</Text>
                            <br />
                            <Text>
                                {item.created_by?.username || "Unknown"}
                            </Text>
                        </Col>
                        <Col span={12}>
                            <Text strong>Created At:</Text>
                            <br />
                            <Text>{formatDateTime(item.createdAt)}</Text>
                        </Col>
                        <Col span={12}>
                            <Text strong>Updated By:</Text>
                            <br />
                            <Text>{item.updated_by?.username || "N/A"}</Text>
                        </Col>
                        <Col span={12}>
                            <Text strong>Last Updated:</Text>
                            <br />
                            <Text>{formatDateTime(item.updatedAt)}</Text>
                        </Col>
                    </Row>
                </div>

                <div className="flex justify-end space-x-2">
                    <Space>
                        {canEdit(item, user, isAdmin) && (
                            <Button
                                type="primary"
                                icon={<EditOutlined />}
                                onClick={() => {
                                    onClose();
                                    onEdit(item);
                                }}
                            >
                                Edit {tagText}
                            </Button>
                        )}
                        <Button onClick={onClose}>Close</Button>
                    </Space>
                </div>
            </div>
        </Modal>
    );
};

export default ViewDetailsModal;
