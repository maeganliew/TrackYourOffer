"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        select: false, // hide when querying unless explicitly selected, so when selecting wouldnt return password
    },
}, {
    timestamps: true, // adds createdAt and updatedAt automatically
});
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
//# sourceMappingURL=User.js.map