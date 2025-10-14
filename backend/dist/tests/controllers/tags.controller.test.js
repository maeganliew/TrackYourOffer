"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const setup_1 = require("../setup");
const tags_controller_1 = require("../../controllers/tags.controller");
const Tag_1 = __importDefault(require("../../models/Tag"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
// mock authenticated userId, any value thats an ObjectId
let userId;
app.use((req, res, next) => {
    // mock something into req.user, controllers rely on it (normally set by Middleware, manually set one for testing)
    req.user = { id: userId.toHexString() }; // string id for controller
    next();
});
// Routes
app.post('/tags', tags_controller_1.addUserTag);
app.get('/tags', tags_controller_1.getUserTag);
app.patch('/tags/:tagId', tags_controller_1.editUserTag);
app.delete('/tags/:tagId', tags_controller_1.deleteUserTag);
beforeAll(async () => {
    await (0, setup_1.connectTestDB)();
    userId = new mongoose_1.default.Types.ObjectId(); // generate a valid ObjectId for test user (Tag model expects ObjectId)
});
afterAll(async () => {
    await (0, setup_1.disconnectTestDB)();
});
afterEach(async () => {
    await (0, setup_1.clearTestDB)();
});
describe('Tag Controller', () => {
    describe('POST /tags', () => {
        it('should create a new tag', async () => {
            const res = await (0, supertest_1.default)(app)
                .post('/tags')
                .send({ name: 'Work', colour: '#FF0000' });
            expect(res.status).toBe(201);
            expect(res.body.tag.name).toBe('Work');
            expect(res.body.tag.colour).toBe('#FF0000');
            expect(res.body.tag.userId).toBe(userId.toHexString());
        });
        it('should not allow duplicate tags', async () => {
            await Tag_1.default.create({ name: 'Work', colour: '#FF0000', userId });
            const res = await (0, supertest_1.default)(app)
                .post('/tags')
                .send({ name: 'Work', colour: '#FF0000' });
            expect(res.status).toBe(400);
            expect(res.body.message).toMatch(/Duplicate tags/);
        });
    });
    describe('GET /tags', () => {
        it('should return all tags for a user', async () => {
            await Tag_1.default.create({ name: 'Work', colour: '#FF0000', userId });
            await Tag_1.default.create({ name: 'Personal', colour: '#00FF00', userId });
            const res = await (0, supertest_1.default)(app).get('/tags');
            expect(res.status).toBe(200);
            expect(res.body.tags.length).toBe(2);
            expect(res.body.tags[0].userId).toBe(userId.toHexString());
        });
    });
    describe('PATCH /tags/:tagId', () => {
        it('should edit a tag', async () => {
            const tag = await Tag_1.default.create({ name: 'Work', colour: '#FF0000', userId });
            const res = await (0, supertest_1.default)(app)
                .patch(`/tags/${tag._id}`)
                .send({ name: 'Updated', colour: '#0000FF' });
            expect(res.status).toBe(200);
            expect(res.body.name).toBe('Updated');
            expect(res.body.colour).toBe('#0000FF');
        });
    });
    describe('DELETE /tags/:tagId', () => {
        it('should delete a tag', async () => {
            const tag = await Tag_1.default.create({ name: 'Work', colour: '#FF0000', userId });
            const res = await (0, supertest_1.default)(app).delete(`/tags/${tag._id}`);
            expect(res.status).toBe(200);
            expect(res.body.tag._id).toBe(tag._id.toHexString());
        });
    });
});
//# sourceMappingURL=tags.controller.test.js.map