export const FILTER_OPTIONS = {
    ALL: "all",
    MINE: "mine",
    OTHERS: "others",
};

export const PAGINATION_CONFIG = {
    pageSize: 10,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
};

export const TABLE_SCROLL_CONFIG = {
    x: 600,
};

export const FORM_RULES = {
    CATEGORY_NAME: [
        { required: true, message: "Please enter category name" },
        { min: 2, message: "Category name must be at least 2 characters" },
        { max: 50, message: "Category name cannot exceed 50 characters" },
    ],
    UNIT_NAME: [
        { required: true, message: "Please enter unit name" },
        { min: 1, message: "Unit name must be at least 1 character" },
        { max: 20, message: "Unit name cannot exceed 20 characters" },
    ],
};

export const MODAL_WIDTH = {
    FORM: 500,
    VIEW: 600,
};
