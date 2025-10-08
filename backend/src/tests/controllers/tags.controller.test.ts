import request from 'supertest';
import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';
import { connectTestDB, disconnectTestDB, clearTestDB } from '../setup';
import { addUserTag, deleteUserTag, getUserTag, editUserTag } from '../../controllers/tags.controller';
import Tag from '../../models/Tag';
import { AuthenticatedRequest } from '../../types/auth-request';

const app = express();
app.use(bodyParser.json());

// mock authenticated userId, any value thats an ObjectId
let userId: mongoose.Types.ObjectId;
app.use((req: any, res, next) => {
  // mock something into req.user, controllers rely on it (normally set by Middleware, manually set one for testing)
  req.user = { id: userId.toHexString() }; // string id for controller
  next();
});

// Routes
app.post('/tags', addUserTag);
app.get('/tags', getUserTag);
app.patch('/tags/:tagId', editUserTag);
app.delete('/tags/:tagId', deleteUserTag);

beforeAll(async () => {
  await connectTestDB();
  userId = new mongoose.Types.ObjectId(); // generate a valid ObjectId for test user (Tag model expects ObjectId)
});

afterAll(async () => {
  await disconnectTestDB();
});

afterEach(async () => {
  await clearTestDB();
});

describe('Tag Controller', () => {
  describe('POST /tags', () => {
    it('should create a new tag', async () => {
      const res = await request(app)
        .post('/tags')
        .send({ name: 'Work', colour: '#FF0000' });

      expect(res.status).toBe(201);
      expect(res.body.tag.name).toBe('Work');
      expect(res.body.tag.colour).toBe('#FF0000');
      expect(res.body.tag.userId).toBe(userId.toHexString());
    });

    it('should not allow duplicate tags', async () => {
      await Tag.create({ name: 'Work', colour: '#FF0000', userId });

      const res = await request(app)
        .post('/tags')
        .send({ name: 'Work', colour: '#FF0000' });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/Duplicate tags/);
    });
  });

  describe('GET /tags', () => {
    it('should return all tags for a user', async () => {
      await Tag.create({ name: 'Work', colour: '#FF0000', userId });
      await Tag.create({ name: 'Personal', colour: '#00FF00', userId });

      const res = await request(app).get('/tags');

      expect(res.status).toBe(200);
      expect(res.body.tags.length).toBe(2);
      expect(res.body.tags[0].userId).toBe(userId.toHexString());
    });
  });

  describe('PATCH /tags/:tagId', () => {
    it('should edit a tag', async () => {
      const tag = await Tag.create({ name: 'Work', colour: '#FF0000', userId });

      const res = await request(app)
        .patch(`/tags/${tag._id}`)
        .send({ name: 'Updated', colour: '#0000FF' });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Updated');
      expect(res.body.colour).toBe('#0000FF');
    });
  });

  describe('DELETE /tags/:tagId', () => {
    it('should delete a tag', async () => {
      const tag = await Tag.create({ name: 'Work', colour: '#FF0000', userId });

      const res = await request(app).delete(`/tags/${tag._id}`);
      expect(res.status).toBe(200);
      expect(res.body.tag._id).toBe(tag._id.toHexString());
    });
  });
});
