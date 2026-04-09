import { Product } from "../models/product.model.js";
import { Category } from "../models/category.model.js";
import { Unit } from "../models/unit.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import fs from "fs";

const parseCSV = (csvText) => {
    const lines = csvText
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")
        .split("\n")
        .filter((line) => line.trim().length > 0);

    if (lines.length < 2) return { headers: [], rows: [] };

    const parseRow = (line) => {
        const result = [];
        let current = "";
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === "," && !inQuotes) {
                result.push(current.trim());
                current = "";
            } else {
                current += char;
            }
        }
        result.push(current.trim());
        return result;
    };

    const headers = parseRow(lines[0]).map((h) =>
        h.toLowerCase().replace(/\s+/g, "_")
    );
    const rows = lines.slice(1).map((line) => {
        const values = parseRow(line);
        const obj = {};
        headers.forEach((header, i) => {
            obj[header] = values[i] !== undefined ? values[i] : "";
        });
        return obj;
    });

    return { headers, rows };
};

const REQUIRED_COLUMNS = [
    "product_name",
    "product_code",
    "category_name",
    "unit_name",
    "buying_price",
    "selling_price",
];

export const bulkUploadProducts = asyncHandler(async (req, res, next) => {
    if (!req.file) {
        return next(new ApiError(400, "CSV file is required"));
    }

    const mimeType = req.file.mimetype;
    const isCSV =
        mimeType === "text/csv" ||
        mimeType === "application/csv" ||
        mimeType === "application/vnd.ms-excel" ||
        req.file.originalname.endsWith(".csv");

    if (!isCSV) {
        return next(new ApiError(400, "Only CSV files are accepted"));
    }

    const csvText = req.file.buffer
        ? req.file.buffer.toString("utf-8")
        : fs.readFileSync(req.file.path, "utf-8");

    const { headers, rows } = parseCSV(csvText);

    if (rows.length === 0) {
        return next(new ApiError(400, "CSV file is empty or has no data rows"));
    }

    const missingColumns = REQUIRED_COLUMNS.filter(
        (col) => !headers.includes(col)
    );
    if (missingColumns.length > 0) {
        return next(
            new ApiError(
                400,
                `CSV is missing required columns: ${missingColumns.join(", ")}`
            )
        );
    }

    if (rows.length > 500) {
        return next(
            new ApiError(
                400,
                "Batch size limit exceeded. Maximum 500 rows per upload."
            )
        );
    }

    const userId = req.user._id;

    const [userCategories, adminCategories, allUnits] = await Promise.all([
        Category.getCategoriesByUser(userId),
        Category.getAdminCategories(),
        Unit.getUnitsByUser(userId),
    ]);

    const seen = new Set();
    const availableCategories = [];
    for (const cat of [...userCategories, ...adminCategories]) {
        const id = cat._id.toString();
        if (!seen.has(id)) {
            seen.add(id);
            availableCategories.push(cat);
        }
    }

    const categoryMap = new Map(
        availableCategories.map((c) => [c.category_name.toLowerCase(), c._id])
    );
    const unitMap = new Map(
        allUnits.map((u) => [u.unit_name.toLowerCase(), u._id])
    );

    const incomingCodes = rows
        .map((r) => r.product_code?.toUpperCase())
        .filter(Boolean);

    const existingProducts = await Product.find({
        product_code: { $in: incomingCodes },
        created_by: userId,
    })
        .select("product_code")
        .lean();

    const existingCodeSet = new Set(
        existingProducts.map((p) => p.product_code.toUpperCase())
    );

    const errors = [];
    const validProducts = [];
    const seenCodesInBatch = new Set();

    rows.forEach((row, index) => {
        const rowNum = index + 2;
        const rowErrors = [];

        const productName = row.product_name?.trim();
        const productCode = row.product_code?.trim()?.toUpperCase();
        const categoryName = row.category_name?.trim();
        const unitName = row.unit_name?.trim();
        const buyingPrice = parseFloat(row.buying_price);
        const sellingPrice = parseFloat(row.selling_price);

        if (!productName) rowErrors.push("product_name is required");
        if (!productCode) {
            rowErrors.push("product_code is required");
        } else if (productCode.length > 5) {
            rowErrors.push("product_code must be 5 characters or less");
        }

        const categoryId = categoryName
            ? categoryMap.get(categoryName.toLowerCase())
            : null;
        if (!categoryName) {
            rowErrors.push("category_name is required");
        } else if (!categoryId) {
            rowErrors.push(`Category "${categoryName}" not found`);
        }

        const unitId = unitName ? unitMap.get(unitName.toLowerCase()) : null;
        if (!unitName) {
            rowErrors.push("unit_name is required");
        } else if (!unitId) {
            rowErrors.push(`Unit "${unitName}" not found`);
        }

        if (!row.buying_price || isNaN(buyingPrice) || buyingPrice < 0) {
            rowErrors.push("buying_price must be a non-negative number");
        }
        if (!row.selling_price || isNaN(sellingPrice) || sellingPrice < 0) {
            rowErrors.push("selling_price must be a non-negative number");
        }
        if (
            !isNaN(buyingPrice) &&
            !isNaN(sellingPrice) &&
            sellingPrice < buyingPrice
        ) {
            rowErrors.push("selling_price must be >= buying_price");
        }

        if (productCode && seenCodesInBatch.has(productCode)) {
            rowErrors.push(
                `Duplicate product_code "${productCode}" within this file`
            );
        } else if (productCode) {
            seenCodesInBatch.add(productCode);
        }

        if (productCode && existingCodeSet.has(productCode)) {
            rowErrors.push(`Product with code "${productCode}" already exists`);
        }

        if (rowErrors.length > 0) {
            errors.push({
                row: rowNum,
                product_code: productCode || "N/A",
                errors: rowErrors,
            });
        } else {
            validProducts.push({
                product_name: productName,
                product_code: productCode,
                category_id: categoryId,
                unit_id: unitId,
                buying_price: buyingPrice,
                selling_price: sellingPrice,
                product_image: "default-product.png",
                stock: 0,
                created_by: userId,
            });
        }
    });

    if (validProducts.length === 0) {
        return res
            .status(422)
            .json(
                new ApiResponse(
                    422,
                    { inserted: 0, failed: errors.length, errors },
                    "No valid products to insert. All rows contain errors."
                )
            );
    }

    let insertedCount = 0;
    const dbErrors = [];

    try {
        const result = await Product.insertMany(validProducts, {
            ordered: false,
        });
        insertedCount = result.length;
    } catch (err) {
        if (err.name === "BulkWriteError" || err.writeErrors) {
            insertedCount = err.result?.nInserted || 0;
            (err.writeErrors || []).forEach((we) => {
                const doc = validProducts[we.index];
                dbErrors.push({
                    row: "DB",
                    product_code: doc?.product_code || "Unknown",
                    errors: [
                        "Duplicate product code (concurrent upload detected)",
                    ],
                });
            });
        } else {
            return next(new ApiError(500, err.message));
        }
    }

    const allErrors = [...errors, ...dbErrors];

    return res.status(207).json(
        new ApiResponse(
            207,
            {
                total: rows.length,
                inserted: insertedCount,
                failed: allErrors.length,
                errors: allErrors,
            },
            insertedCount > 0
                ? `${insertedCount} product(s) uploaded successfully. ${allErrors.length} row(s) failed.`
                : "Upload failed. No products were inserted."
        )
    );
});
