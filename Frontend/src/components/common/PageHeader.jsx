import React from "react";
import { Button } from "antd";

const PageHeader = ({
    title,
    subtitle,
    icon,
    actionButton = null,
    onActionClick,
    actionIcon,
    actionText,
}) => {
    return (
        <div className="flex justify-between items-center mb-4">
            <div>
                <h1 className="flex items-center gap-2 truncate mb-1 text-4xl font-bold">
                    {title}
                    {icon && <span className="text-blue-600">{icon}</span>}
                </h1>
                {subtitle && (
                    <p className="mt-1 text-gray-500 text-base md:text-sm hidden sm:block">
                        {subtitle}
                    </p>
                )}
            </div>
            {(actionButton || (onActionClick && actionText)) &&
                (actionButton || (
                    <Button
                        type="primary"
                        icon={actionIcon}
                        onClick={onActionClick}
                        size="large"
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {actionText}
                    </Button>
                ))}
        </div>
    );
};

export default PageHeader;
