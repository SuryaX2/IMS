import multer from "multer";
import path from "path";

const memoryStorage = multer.memoryStorage();

const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp");
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    },
});

const storage =
    process.env.NODE_ENV === "production" ? memoryStorage : diskStorage;

export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed!"), false);
        }
    },
});

export const csvUpload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: function (req, file, cb) {
        const isCSV =
            file.mimetype === "text/csv" ||
            file.mimetype === "application/csv" ||
            file.mimetype === "application/vnd.ms-excel" ||
            file.originalname.toLowerCase().endsWith(".csv");

        if (isCSV) {
            cb(null, true);
        } else {
            cb(new Error("Only CSV files are allowed for bulk upload"), false);
        }
    },
});
