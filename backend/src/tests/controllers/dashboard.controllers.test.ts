import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../../src/app'; // your Express app
import User from '../../models/User';
import Job from '../../models/Job';
import JobTag from '../../models/jobTag';
import Tag from '../../models/Tag'; // Make sure you have this
import { connectTestDB, disconnectTestDB, clearTestDB } from '../setup';
import jwt from 'jsonwebtoken';

let token: string;
let userId: string;

beforeAll(async () => {
  await connectTestDB();

  const user = await User.create({ email: 'test@example.com', password: 'hashed' });
  userId = user._id.toString();
  token = jwt.sign({ id: userId, email: user.email }, process.env.JWT_SECRET!, { expiresIn: '2h' });
});

afterAll(async () => {
  await disconnectTestDB();
});

afterEach(async () => {
  await clearTestDB();
});

describe('Dashboard Controllers', () => {
  describe('getStats', () => {
    it('should return correct stats for a user', async () => {
      // Jobs
      const job1 = await Job.create({ name: 'Job 1', status: 'Wishlist', userId });
      const job2 = await Job.create({ name: 'Job 2', status: 'Applied', userId });

      // Real Tags
      const frontendTag = await Tag.create({ name: 'Frontend', colour: '#ff0000', userId });
      const backendTag = await Tag.create({ name: 'Backend', colour: '#00ff00', userId });

      // JobTags
      await JobTag.create([
        { jobId: job1._id, tagId: frontendTag._id, userId },
        { jobId: job2._id, tagId: backendTag._id, userId },
        { jobId: job2._id, tagId: frontendTag._id, userId }, // job2 has two tags
      ]);

      const res = await request(app)
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

        const job1 = await Job.create({ name: 'Job 1', status: 'Wishlist', userId, updatedAt: threeDaysAgo.toISOString(), createdAt: threeDaysAgo.toISOString() });
        const job2 = await Job.create({ name: 'Job 2', status: 'Applied', userId, updatedAt: threeDaysAgo.toISOString(), createdAt: threeDaysAgo.toISOString() });
        const job3 = await Job.create({ name: 'Job 3', status: 'Wishlist', userId, updatedAt: fortyDaysAgo.toISOString(), createdAt: fortyDaysAgo.toISOString() });
      
      // Tags
      const frontendTag = await Tag.create({ name: 'Frontend', colour: '#ff0000', userId });
      await JobTag.create({ jobId: job1._id, tagId: frontendTag._id });

      const res = await request(app)
        .get('/dashboard/activity')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.nudges).toContain('You have 2 jobs without any tags.');
      expect(res.body.nudges).toContain("2 of your jobs are still marked as 'Wishlist'. Time to apply?");
      expect(res.body.nudges).toContain('You updated 2 jobs last week — great job staying consistent!');
      expect(res.body.nudges).toContain("You haven't updated 1 jobs in over 30 days.");
    });

    it('should return 401 if user not authenticated', async () => {
      const res = await request(app).get('/dashboard/activity'); // route must match your controller
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('No token provided');
    });
  });
});
