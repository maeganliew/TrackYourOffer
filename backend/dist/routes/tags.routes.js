"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const tags_controller_1 = require("../controllers/tags.controller");
const router = express_1.default.Router();
// User - Add tag 
router.post('/', auth_middleware_1.authMiddleware, tags_controller_1.addUserTag);
// User - Delete tag
router.delete('/:tagId', auth_middleware_1.authMiddleware, tags_controller_1.deleteUserTag);
// User - Get tag
router.get('/', auth_middleware_1.authMiddleware, tags_controller_1.getUserTag);
// User - Edit tag
router.patch('/:tagId', auth_middleware_1.authMiddleware, tags_controller_1.editUserTag);
exports.default = router;
//# sourceMappingURL=tags.routes.js.map