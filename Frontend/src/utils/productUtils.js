// Utility functions for product operations

/**
 * Formats price with currency symbol
 * @param {number} price - The price to format
 * @param {string} currency - Currency symbol (default: '$')
 * @returns {string} Formatted price string
 */
export const formatPrice = (price, currency = "$") => {
    if (typeof price !== "number") return `${currency}0.00`;
    return `${currency}${price.toFixed(2)}`;
};

/**
 * Calculates profit margin between selling and buying price
 * @param {number} sellingPrice - The selling price
 * @param {number} buyingPrice - The buying price
 * @returns {number} Profit margin
 */
export const calculateProfitMargin = (sellingPrice, buyingPrice) => {
    if (typeof sellingPrice !== "number" || typeof buyingPrice !== "number") {
        return 0;
    }
    return sellingPrice - buyingPrice;
};

/**
 * Calculates profit percentage
 * @param {number} sellingPrice - The selling price
 * @param {number} buyingPrice - The buying price
 * @returns {number} Profit percentage
 */
export const calculateProfitPercentage = (sellingPrice, buyingPrice) => {
    if (
        typeof sellingPrice !== "number" ||
        typeof buyingPrice !== "number" ||
        buyingPrice === 0
    ) {
        return 0;
    }
    return ((sellingPrice - buyingPrice) / buyingPrice) * 100;
};

/**
 * Determines stock status based on stock quantity
 * @param {number} stock - Current stock quantity
 * @param {number} lowStockThreshold - Threshold for low stock (default: 10)
 * @returns {Object} Stock status object with status and text
 */
export const getStockStatus = (stock, lowStockThreshold = 10) => {
    if (stock === 0) {
        return { status: "error", text: "Out of Stock", color: "red" };
    } else if (stock <= lowStockThreshold) {
        return { status: "warning", text: "Low Stock", color: "orange" };
    }
    return { status: "success", text: "In Stock", color: "green" };
};

/**
 * Validates product form data
 * @param {Object} productData - Product data to validate
 * @returns {Object} Validation result with isValid and errors
 */
export const validateProductData = (productData) => {
    const errors = {};
    let isValid = true;

    // Required fields validation
    if (!productData.product_name?.trim()) {
        errors.product_name = "Product name is required";
        isValid = false;
    }

    if (!productData.product_code?.trim()) {
        errors.product_code = "Product code is required";
        isValid = false;
    }

    if (!productData.category_id) {
        errors.category_id = "Category is required";
        isValid = false;
    }

    if (!productData.unit_id) {
        errors.unit_id = "Unit is required";
        isValid = false;
    }

    // Price validation
    if (!productData.buying_price || productData.buying_price <= 0) {
        errors.buying_price = "Buying price must be greater than 0";
        isValid = false;
    }

    if (!productData.selling_price || productData.selling_price <= 0) {
        errors.selling_price = "Selling price must be greater than 0";
        isValid = false;
    }

    // Check if selling price is greater than buying price
    if (
        productData.selling_price &&
        productData.buying_price &&
        productData.selling_price < productData.buying_price
    ) {
        errors.selling_price =
            "Selling price should be greater than buying price";
        isValid = false;
    }

    return { isValid, errors };
};

/**
 * Prepares form data for API submission
 * @param {Object} formValues - Form values from Ant Design form
 * @param {File} imageFile - Image file (optional)
 * @returns {FormData} Prepared form data for API
 */
export const prepareProductFormData = (formValues, imageFile = null) => {
    const formData = new FormData();

    // Add form fields
    Object.keys(formValues).forEach((key) => {
        if (
            key !== "product_image" &&
            formValues[key] !== undefined &&
            formValues[key] !== null
        ) {
            formData.append(key, formValues[key]);
        }
    });

    // Add image file if provided
    if (imageFile) {
        formData.append("product_image", imageFile);
    }

    return formData;
};

/**
 * Filters products based on search criteria
 * @param {Array} products - Array of products
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered products
 */
export const filterProducts = (products, filters) => {
    let filteredProducts = [...products];

    // Search filter
    if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredProducts = filteredProducts.filter(
            (product) =>
                product.product_name.toLowerCase().includes(searchTerm) ||
                product.product_code.toLowerCase().includes(searchTerm)
        );
    }

    // Category filter
    if (filters.category) {
        filteredProducts = filteredProducts.filter(
            (product) => product.category_id._id === filters.category
        );
    }

    // Stock filter
    if (filters.stockFilter) {
        filteredProducts = filteredProducts.filter((product) => {
            if (filters.stockFilter === "out") {
                return product.stock === 0;
            } else if (filters.stockFilter === "low") {
                return product.stock > 0 && product.stock <= 10;
            } else if (filters.stockFilter === "in") {
                return product.stock > 10;
            }
            return true;
        });
    }

    return filteredProducts;
};

/**
 * Sorts products based on specified criteria
 * @param {Array} products - Array of products
 * @param {string} sortBy - Sort criteria ('name', 'price', 'stock', 'category')
 * @param {string} sortOrder - Sort order ('asc' or 'desc')
 * @returns {Array} Sorted products
 */
export const sortProducts = (products, sortBy, sortOrder = "asc") => {
    const sortedProducts = [...products];

    sortedProducts.sort((a, b) => {
        let aValue, bValue;

        switch (sortBy) {
            case "name":
                aValue = a.product_name.toLowerCase();
                bValue = b.product_name.toLowerCase();
                break;
            case "price":
                aValue = a.selling_price;
                bValue = b.selling_price;
                break;
            case "stock":
                aValue = a.stock;
                bValue = b.stock;
                break;
            case "category":
                aValue = a.category_id.category_name.toLowerCase();
                bValue = b.category_id.category_name.toLowerCase();
                break;
            default:
                return 0;
        }

        if (typeof aValue === "string") {
            return sortOrder === "asc"
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        } else {
            return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
        }
    });

    return sortedProducts;
};

/**
 * Generates a unique product code
 * @param {string} categoryName - Category name
 * @param {number} sequence - Sequence number
 * @returns {string} Generated product code
 */
export const generateProductCode = (categoryName, sequence) => {
    const prefix = categoryName.substring(0, 2).toUpperCase();
    const paddedSequence = sequence.toString().padStart(3, "0");
    return `${prefix}${paddedSequence}`;
};

/**
 * Calculates total inventory value
 * @param {Array} products - Array of products
 * @returns {Object} Inventory statistics
 */
export const calculateInventoryStats = (products) => {
    const stats = {
        totalProducts: products.length,
        totalStockValue: 0,
        totalSellingValue: 0,
        outOfStockCount: 0,
        lowStockCount: 0,
        inStockCount: 0,
    };

    products.forEach((product) => {
        stats.totalStockValue += product.buying_price * product.stock;
        stats.totalSellingValue += product.selling_price * product.stock;

        if (product.stock === 0) {
            stats.outOfStockCount++;
        } else if (product.stock <= 10) {
            stats.lowStockCount++;
        } else {
            stats.inStockCount++;
        }
    });

    return stats;
};
