"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_controller_1 = require("../controllers/user.controller");
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.patch('/changeEmail', auth_middleware_1.authMiddleware, user_controller_1.changeEmail);
router.patch('/changePassword', auth_middleware_1.authMiddleware, user_controller_1.changePassword);
router.get('/profile', auth_middleware_1.authMiddleware, user_controller_1.getProfile);
exports.default = router;
//# sourceMappingURL=user.routes.js.map