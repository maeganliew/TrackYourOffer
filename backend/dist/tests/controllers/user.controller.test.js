"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../../models/User"));
const user_controller_1 = require("../../controllers/user.controller");
const setup_1 = require("../setup");
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Mock authMiddleware
const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token)
        return res.status(401).json({ message: 'No token' });
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await User_1.default.findById(decoded.id);
        if (!user)
            return res.status(401).json({ message: 'Invalid token' });
        req.user = { id: user._id, email: user.email };
        next();
    }
    catch {
        return res.status(401).json({ message: 'Invalid token' });
    }
};
app.patch('/user/email', authMiddleware, user_controller_1.changeEmail);
app.patch('/user/password', authMiddleware, user_controller_1.changePassword);
app.get('/user/profile', authMiddleware, user_controller_1.getProfile);
describe('User Controller', () => {
    let user;
    let token;
    beforeAll(async () => {
        await (0, setup_1.connectTestDB)();
        // create test user
        user = await User_1.default.create({ email: 'test@example.com', password: 'password123' });
        token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    });
    afterAll(async () => {
        await (0, setup_1.disconnectTestDB)();
    });
    afterEach(async () => {
        await (0, setup_1.clearTestDB)();
        // recreate user after clearing
        // Recreating the user ensures each test starts with a clean DB and valid test data
        user = await User_1.default.create({ email: 'test@example.com', password: 'password123' });
        token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    });
    describe('GET /user/profile', () => {
        it('should return the current user profile', async () => {
            const res = await (0, supertest_1.default)(app)
                .get('/user/profile')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);
            expect(res.body.user.email).toBe('test@example.com');
        });
        it('should fail without token', async () => {
            const res = await (0, supertest_1.default)(app).get('/user/profile').expect(401);
            expect(res.body.message).toBe('No token');
        });
    });
    describe('PATCH /user/email', () => {
        it('should change the user email', async () => {
            const res = await (0, supertest_1.default)(app)
                .patch('/user/email')
                .set('Authorization', `Bearer ${token}`)
                .send({ newEmail: 'new@example.com' })
                .expect(200);
            expect(res.body.user.email).toBe('new@example.com');
            const updated = await User_1.default.findById(user._id);
            expect(updated.email).toBe('new@example.com');
        });
        it('should return 400 if email is missing', async () => {
            const res = await (0, supertest_1.default)(app)
                .patch('/user/email')
                .set('Authorization', `Bearer ${token}`)
                .send({})
                .expect(400);
            expect(res.body.message).toBe('New username is required');
        });
        it('should return 400 if email already exists', async () => {
            await User_1.default.create({ email: 'existing@example.com', password: 'pass' });
            const res = await (0, supertest_1.default)(app)
                .patch('/user/email')
                .set('Authorization', `Bearer ${token}`)
                .send({ newEmail: 'existing@example.com' })
                .expect(400);
            expect(res.body.message).toBe('Username already exists');
        });
    });
    describe('PATCH /user/password', () => {
        it('should change the password', async () => {
            const res = await (0, supertest_1.default)(app)
                .patch('/user/password')
                .set('Authorization', `Bearer ${token}`)
                .send({ newPassword: 'newpassword123' })
                .expect(200);
            expect(res.body.message).toBe('Password updated');
            const updatedUser = await User_1.default.findById(user._id).select('+password');
            const match = await bcrypt_1.default.compare('newpassword123', updatedUser.password);
            expect(match).toBe(true);
        });
        it('should return 400 if password is missing', async () => {
            const res = await (0, supertest_1.default)(app)
                .patch('/user/password')
                .set('Authorization', `Bearer ${token}`)
                .send({})
                .expect(400);
            expect(res.body.message).toBe('New password is required');
        });
    });
});
//# sourceMappingURL=user.controller.test.js.map