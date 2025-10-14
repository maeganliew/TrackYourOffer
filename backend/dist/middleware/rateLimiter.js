"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// Configure rate limiter
exports.rateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 5 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 5 requests per windowMs
    message: "Too many requests, please try again later.",
});
//# sourceMappingURL=rateLimiter.js.map