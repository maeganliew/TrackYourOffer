"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../../src/app")); // your Express app
const User_1 = __importDefault(require("../../models/User"));
const Job_1 = __importDefault(require("../../models/Job"));
const jobTag_1 = __importDefault(require("../../models/jobTag"));
const Tag_1 = __importDefault(require("../../models/Tag")); // Make sure you have this
const setup_1 = require("../setup");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
let token;
let userId;
beforeAll(async () => {
    await (0, setup_1.connectTestDB)();
    const user = await User_1.default.create({ email: 'test@example.com', password: 'hashed' });
    userId = user._id.toString();
    token = jsonwebtoken_1.default.sign({ id: userId, email: user.email }, process.env.JWT_SECRET, { expiresIn: '2h' });
});
afterAll(async () => {
    await (0, setup_1.disconnectTestDB)();
});
afterEach(async () => {
    await (0, setup_1.clearTestDB)();
});
describe('Dashboard Controllers', () => {
    describe('getStats', () => {
        it('should return correct stats for a user', async () => {
            // Jobs
            const job1 = await Job_1.default.create({ name: 'Job 1', status: 'Wishlist', userId });
            const job2 = await Job_1.default.create({ name: 'Job 2', status: 'Applied', userId });
            // Real Tags
            const frontendTag = await Tag_1.default.create({ name: 'Frontend', colour: '#ff0000', userId });
            const backendTag = await Tag_1.default.create({ name: 'Backend', colour: '#00ff00', userId });
            // JobTags
            await jobTag_1.default.create([
                { jobId: job1._id, tagId: frontendTag._id, userId },
                { jobId: job2._id, tagId: backendTag._id, userId },
                { jobId: job2._id, tagId: frontendTag._id, userId }, // job2 has two tags
            ]);
            const res = await (0, supertest_1.default)(app_1.default)
                .get('/dashboard/stats')
                .set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(200);
            expect(res.body.dashboardstats.totalJobs).toBe(2);
            expect(res.body.dashboardstats.jobsByStatus.Wishlist).toBe(1);
            expect(res.body.dashboardstats.jobsByStatus.Applied).toBe(1);
            expect(res.body.dashboardstats.jobsByTag.Frontend.count).toBe(2);
            expect(res.body.dashboardstats.jobsByTag.Frontend.colour).toBe('#ff0000');
            expect(res.body.dashboardstats.jobsByTag.Backend.count).toBe(1);
            expect(res.body.dashboardstats.jobsByTag.Backend.colour).toBe('#00ff00');
        });
    });
    describe('getDashboardNudges', () => {
        it('should return nudges correctly', async () => {
            const today = new Date();
            const threeDaysAgo = new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000);
            const fortyDaysAgo = new Date(today.getTime() - 40 * 24 * 60 * 60 * 1000);
            const job1 = await Job_1.default.create({ name: 'Job 1', status: 'Wishlist', userId, updatedAt: threeDaysAgo.toISOString(), createdAt: threeDaysAgo.toISOString() });
            const job2 = await Job_1.default.create({ name: 'Job 2', status: 'Applied', userId, updatedAt: threeDaysAgo.toISOString(), createdAt: threeDaysAgo.toISOString() });
            const job3 = await Job_1.default.create({ name: 'Job 3', status: 'Wishlist', userId, updatedAt: fortyDaysAgo.toISOString(), createdAt: fortyDaysAgo.toISOString() });
            // Tags
            const frontendTag = await Tag_1.default.create({ name: 'Frontend', colour: '#ff0000', userId });
            await jobTag_1.default.create({ jobId: job1._id, tagId: frontendTag._id });
            const res = await (0, supertest_1.default)(app_1.default)
                .get('/dashboard/activity')
                .set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(200);
            expect(res.body.nudges).toContain('You have 2 jobs without any tags.');
            expect(res.body.nudges).toContain("2 of your jobs are still marked as 'Wishlist'. Time to apply?");
            expect(res.body.nudges).toContain('You updated 2 jobs last week — great job staying consistent!');
            expect(res.body.nudges).toContain("You haven't updated 1 jobs in over 30 days.");
        });
        it('should return 401 if user not authenticated', async () => {
            const res = await (0, supertest_1.default)(app_1.default).get('/dashboard/activity'); // route must match your controller
            expect(res.status).toBe(401);
            expect(res.body.message).toBe('No token provided');
        });
    });
});
//# sourceMappingURL=dashboard.controllers.test.js.map