"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const router = express_1.default.Router();
router.get('/stats', auth_middleware_1.authMiddleware, dashboard_controller_1.getStats);
router.get('/activity', auth_middleware_1.authMiddleware, dashboard_controller_1.getDashboardNudges);
exports.default = router;
//# sourceMappingURL=dashboard.routes.js.map