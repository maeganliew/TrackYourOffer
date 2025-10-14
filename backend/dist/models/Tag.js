"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
//import { tagColours } from '../Constants';
const tagSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    colour: {
        type: String,
        required: true,
        default: '#6B7280',
    }
}, {
    timestamps: true,
});
const Tag = mongoose_1.default.model('Tag', tagSchema);
exports.default = Tag;
//# sourceMappingURL=Tag.js.map