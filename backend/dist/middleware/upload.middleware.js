"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parser = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
// Allowed formats
const ALLOWED_FORMATS = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.default,
    params: (req, file) => {
        if (!ALLOWED_FORMATS.includes(file.mimetype)) {
            throw new Error("Unsupported file type");
        }
        if (file.mimetype === "application/pdf") {
            return {
                folder: "jobs/pdfs",
                resource_type: "raw",
            };
        }
        else {
            return {
                folder: "jobs/images",
                resource_type: "image",
            };
        }
    },
});
exports.parser = (0, multer_1.default)({ storage });
//# sourceMappingURL=upload.middleware.js.map