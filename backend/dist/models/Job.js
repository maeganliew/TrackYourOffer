"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Constants_1 = require("../Constants");
const jobSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true, // references user's uuid (not ObjectId)
    },
    name: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: Constants_1.allowedJobStatus,
        default: "Wishlist",
    },
    appliedAt: {
        type: Date,
    },
    file: {
        url: { type: String },
        type: { type: String }, // e.g. "image", "pdf"
        filename: { type: String },
        // Optional: include public_id for Cloudinary deletion later
        // public_id: { type: String },
    },
}, {
    timestamps: true, // adds createdAt and updatedAt
});
const Job = mongoose_1.default.model('Job', jobSchema);
exports.default = Job;
//# sourceMappingURL=Job.js.map