"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// prevets real queue from starting. else Jest wont exit cleanly
jest.mock('../../queues/reminderQueue', () => ({
    addReminderJob: jest.fn(),
    rescheduleReminderJob: jest.fn(),
}));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const supertest_1 = __importDefault(require("supertest"));
const setup_1 = require("../setup");
const jobs_controller_1 = require("../../controllers/jobs.controller");
const Job_1 = __importDefault(require("../../models/Job"));
const multer_1 = __importDefault(require("multer"));
// memory storage for testing
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
let userId;
app.use((req, res, next) => {
    req.user = { id: userId.toHexString() };
    next();
});
app.post('/jobs', upload.single('file'), jobs_controller_1.addJob);
app.get('/jobs', jobs_controller_1.getJobs);
app.get('/jobs/:jobId', jobs_controller_1.getJob);
app.patch('/jobs/:jobId/name', jobs_controller_1.changeJobName);
app.patch('/jobs/:jobId/status', jobs_controller_1.changeJobStatus);
app.patch('/jobs/:jobId/appliedAt', jobs_controller_1.changeJobDate);
app.delete('/jobs/:jobId', jobs_controller_1.deleteJob);
app.post('/jobs/:jobId/file', jobs_controller_1.uploadFile);
app.delete('/jobs/:jobId/file', jobs_controller_1.deleteFile);
describe('Job Controller', () => {
    beforeAll(async () => {
        await (0, setup_1.connectTestDB)();
        userId = new mongoose_1.default.Types.ObjectId();
    });
    afterEach(async () => {
        await (0, setup_1.clearTestDB)();
    });
    afterAll(async () => {
        await (0, setup_1.disconnectTestDB)();
    });
    describe('POST /jobs', () => {
        it('should create a new job without a file', async () => {
            const res = await (0, supertest_1.default)(app)
                .post('/jobs')
                .send({ name: 'Test Job', status: 'Wishlist', appliedAt: new Date().toISOString() });
            expect(res.status).toBe(201);
            expect(res.body.job.name).toBe('Test Job');
            expect(res.body.job.file).toBeUndefined();
        });
        it('should create a new job with a file', async () => {
            const res = await (0, supertest_1.default)(app)
                .post('/jobs')
                .field('name', 'Job with file')
                .field('status', 'Applied')
                .attach('file', Buffer.from('fake file content'), { filename: 'resume.pdf', contentType: 'application/pdf' });
            expect(res.status).toBe(201);
            expect(res.body.job.name).toBe('Job with file');
            expect(res.body.job.file).toBeDefined();
            expect(res.body.job.file.filename).toBe('resume.pdf');
        });
    });
    describe('GET /jobs', () => {
        it('should return all jobs for a user', async () => {
            await Job_1.default.create({ name: 'Work', status: 'Wishlist', userId });
            await Job_1.default.create({ name: 'Personal', status: 'Applied', userId });
            const res = await (0, supertest_1.default)(app).get('/jobs');
            expect(res.status).toBe(200);
            expect(res.body.jobs.length).toBe(2);
            expect(res.body.jobs[0].name).toBeDefined();
        });
    });
    describe('PATCH /jobs/:jobId/name', () => {
        it('should update a job name', async () => {
            const job = await Job_1.default.create({ name: 'Old Name', status: 'Wishlist', userId });
            const res = await (0, supertest_1.default)(app)
                .patch(`/jobs/${job._id}/name`)
                .send({ newJobName: 'New Name' });
            expect(res.status).toBe(200);
            expect(res.body.job.name).toBe('New Name');
        });
    });
    describe('PATCH /jobs/:jobId/status', () => {
        it('should update a job status', async () => {
            const job = await Job_1.default.create({ name: 'Status Test', status: 'Wishlist', userId });
            const res = await (0, supertest_1.default)(app)
                .patch(`/jobs/${job._id}/status`)
                .send({ newJobStatus: 'Applied' });
            expect(res.status).toBe(200);
            expect(res.body.job.status).toBe('Applied');
        });
    });
    describe('PATCH /jobs/:jobId/appliedAt', () => {
        it('should update the applied date', async () => {
            const job = await Job_1.default.create({ name: 'Date Test', status: 'Wishlist', userId });
            const newDate = new Date().toISOString();
            const res = await (0, supertest_1.default)(app)
                .patch(`/jobs/${job._id}/appliedAt`)
                .send({ newTime: newDate });
            expect(res.status).toBe(200);
            expect(new Date(res.body.job.appliedAt).toISOString()).toBe(newDate);
        });
    });
    describe('DELETE /jobs/:jobId', () => {
        it('should delete a job', async () => {
            const job = await Job_1.default.create({ name: 'Delete Test', status: 'Wishlist', userId });
            const res = await (0, supertest_1.default)(app).delete(`/jobs/${job._id}`);
            expect(res.status).toBe(200);
            expect(res.body.job._id).toBe(job._id.toString());
        });
    });
});
//# sourceMappingURL=jobs.controller.test.js.map