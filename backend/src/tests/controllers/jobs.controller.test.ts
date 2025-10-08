// prevets real queue from starting. else Jest wont exit cleanly
jest.mock('../../queues/reminderQueue', () => ({
  addReminderJob: jest.fn(),
  rescheduleReminderJob: jest.fn(),
}));

import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import request from 'supertest';
import { connectTestDB, disconnectTestDB, clearTestDB } from '../setup';
import {addJob, getJobs, getJob, changeJobName, changeJobStatus, changeJobDate, deleteJob, uploadFile, deleteFile} from '../../controllers/jobs.controller';
import Job from '../../models/Job';
import multer from 'multer';

// memory storage for testing
const storage = multer.memoryStorage();
const upload = multer({ storage });


const app = express();
app.use(bodyParser.json());
    
let userId: mongoose.Types.ObjectId;
app.use((req: any, res, next) => {
    req.user = { id: userId.toHexString() };
    next();
});

app.post('/jobs', upload.single('file'), addJob);
app.get('/jobs', getJobs);
app.get('/jobs/:jobId', getJob);
app.patch('/jobs/:jobId/name', changeJobName);
app.patch('/jobs/:jobId/status', changeJobStatus);
app.patch('/jobs/:jobId/appliedAt', changeJobDate);
app.delete('/jobs/:jobId', deleteJob);
app.post('/jobs/:jobId/file', uploadFile);
app.delete('/jobs/:jobId/file', deleteFile);

describe('Job Controller', () => {

  beforeAll(async () => {
    await connectTestDB();
    userId = new mongoose.Types.ObjectId();
  });

  afterEach(async () => {
    await clearTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  describe('POST /jobs', () => {
    it('should create a new job without a file', async () => {
      const res = await request(app)
        .post('/jobs')
        .send({ name: 'Test Job', status: 'Wishlist', appliedAt: new Date().toISOString() });
      
      expect(res.status).toBe(201);
      expect(res.body.job.name).toBe('Test Job');
      expect(res.body.job.file).toBeUndefined();
    });

    it('should create a new job with a file', async () => {
      const res = await request(app)
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
      await Job.create({ name: 'Work', status: 'Wishlist', userId });
      await Job.create({ name: 'Personal', status: 'Applied', userId });

      const res = await request(app).get('/jobs');

      expect(res.status).toBe(200);
      expect(res.body.jobs.length).toBe(2);
      expect(res.body.jobs[0].name).toBeDefined();
    });
  });

  describe('PATCH /jobs/:jobId/name', () => {
    it('should update a job name', async () => {
      const job = await Job.create({ name: 'Old Name', status: 'Wishlist', userId });
      
      const res = await request(app)
        .patch(`/jobs/${job._id}/name`)
        .send({ newJobName: 'New Name' });

      expect(res.status).toBe(200);
      expect(res.body.job.name).toBe('New Name');
    });
  });

  describe('PATCH /jobs/:jobId/status', () => {
    it('should update a job status', async () => {
      const job = await Job.create({ name: 'Status Test', status: 'Wishlist', userId });

      const res = await request(app)
        .patch(`/jobs/${job._id}/status`)
        .send({ newJobStatus: 'Applied' });

      expect(res.status).toBe(200);
      expect(res.body.job.status).toBe('Applied');
    });
  });

  describe('PATCH /jobs/:jobId/appliedAt', () => {
    it('should update the applied date', async () => {
      const job = await Job.create({ name: 'Date Test', status: 'Wishlist', userId });
      const newDate = new Date().toISOString();

      const res = await request(app)
        .patch(`/jobs/${job._id}/appliedAt`)
        .send({ newTime: newDate });

      expect(res.status).toBe(200);
      expect(new Date(res.body.job.appliedAt).toISOString()).toBe(newDate);
    });
  });

  describe('DELETE /jobs/:jobId', () => {
    it('should delete a job', async () => {
      const job = await Job.create({ name: 'Delete Test', status: 'Wishlist', userId });

      const res = await request(app).delete(`/jobs/${job._id}`);

      expect(res.status).toBe(200);
      expect(res.body.job._id).toBe(job._id.toString());
    });
  });
});
