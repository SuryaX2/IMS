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
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-4 px-2 sm:px-0">
            <div className="flex-1 min-w-0">
                <h1 className="flex items-center gap-2 mb-1 text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
                    <span className="truncate">{title}</span>
                    {icon && (
                        <span className="text-blue-600 flex-shrink-0 text-xl sm:text-2xl lg:text-3xl">
                            {icon}
                        </span>
                    )}
                </h1>
                {subtitle && (
                    <p className="mt-1 text-gray-500 text-sm sm:text-base leading-relaxed pr-2 sm:pr-0">
                        {subtitle}
                    </p>
                )}
            </div>

            {(actionButton || (onActionClick && actionText)) && (
                <div className="flex-shrink-0 w-full sm:w-auto">
                    {actionButton || (
                        <Button
                            type="primary"
                            icon={actionIcon}
                            onClick={onActionClick}
                            size="large"
                            className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto min-w-[120px]"
                            block={window.innerWidth < 640}
                        >
                            <span className="truncate">{actionText}</span>
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};

export default PageHeader;
