"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../../src/app"));
const User_1 = __importDefault(require("../../models/User"));
const setup_1 = require("../setup");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
beforeAll(async () => {
    await (0, setup_1.connectTestDB)();
});
afterAll(async () => {
    await (0, setup_1.disconnectTestDB)();
});
afterEach(async () => {
    await (0, setup_1.clearTestDB)();
});
describe('Auth Controller', () => {
    describe('Register', () => {
        it('should create a new user and return token', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post('/auth/register')
                .send({ email: 'test@example.com', password: 'password123' });
            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('token');
            expect(res.body).toHaveProperty('uid');
            expect(res.body.email).toBe('test@example.com');
            const user = await User_1.default.findOne({ email: 'test@example.com' });
            expect(user).not.toBeNull();
        });
        it('should not allow duplicate registration', async () => {
            await User_1.default.create({ email: 'test@example.com', password: 'hashed' });
            const res = await (0, supertest_1.default)(app_1.default)
                .post('/auth/register')
                .send({ email: 'test@example.com', password: 'password123' });
            expect(res.status).toBe(400);
            expect(res.body.message).toBe('User already exists.');
        });
    });
    describe('Login', () => {
        beforeEach(async () => {
            const hashedPass = await bcrypt_1.default.hash('password123', 10);
            await User_1.default.create({ email: 'login@example.com', password: hashedPass });
        });
        it('should login existing user and return token', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post('/auth/login')
                .send({ email: 'login@example.com', password: 'password123' });
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('token');
            expect(res.body.user.email).toBe('login@example.com');
            const decoded = jsonwebtoken_1.default.verify(res.body.token, process.env.JWT_SECRET);
            expect(decoded.email).toBe('login@example.com');
        });
        it('should reject login with wrong password', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post('/auth/login')
                .send({ email: 'login@example.com', password: 'wrongpass' });
            expect(res.status).toBe(401);
            expect(res.body.message).toBe('Invalid login credentials');
        });
        it('should reject login with non-existing email', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post('/auth/login')
                .send({ email: 'noone@example.com', password: 'password123' });
            expect(res.status).toBe(401);
            expect(res.body.message).toBe('Invalid login credentials');
        });
    });
});
//# sourceMappingURL=auth.controller.test.js.map