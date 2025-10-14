"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_middleware_1 = require("../../middleware/auth.middleware");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
jest.mock('jsonwebtoken');
describe('authMiddleware', () => {
    let req;
    let res;
    let next;
    beforeEach(() => {
        req = { headers: {} };
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        next = jest.fn();
        jest.clearAllMocks();
    });
    it('should return 401 if no Authorization header', () => {
        (0, auth_middleware_1.authMiddleware)(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "No token provided" });
        expect(next).not.toHaveBeenCalled();
    });
    it('should return 401 if token missing after Bearer', () => {
        req.headers = { authorization: 'Bearer ' };
        (0, auth_middleware_1.authMiddleware)(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Token missing" });
        expect(next).not.toHaveBeenCalled();
    });
    it('should return 401 if token is invalid', () => {
        req.headers = { authorization: 'Bearer invalidtoken' };
        jsonwebtoken_1.default.verify.mockImplementation(() => { throw new Error('invalid'); });
        (0, auth_middleware_1.authMiddleware)(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Invalid token" });
        expect(next).not.toHaveBeenCalled();
    });
    it('should call next and attach user if token is valid', () => {
        const mockPayload = { id: 'user123', email: 'test@example.com' };
        req.headers = { authorization: 'Bearer validtoken' };
        jsonwebtoken_1.default.verify.mockReturnValue(mockPayload);
        (0, auth_middleware_1.authMiddleware)(req, res, next);
        expect(req.user).toEqual(mockPayload);
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });
});
//# sourceMappingURL=auth.middleware.test.js.map