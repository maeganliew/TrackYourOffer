import request from 'supertest';
import express, { Express } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../../models/User';
import { changeEmail, changePassword, getProfile } from '../../controllers/user.controller';
import { connectTestDB, disconnectTestDB, clearTestDB } from '../setup';

const app: Express = express();
app.use(express.json());

// Mock authMiddleware
const authMiddleware = async (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'Invalid token' });
    req.user = { id: user._id, email: user.email };
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

app.patch('/user/email', authMiddleware, changeEmail);
app.patch('/user/password', authMiddleware, changePassword);
app.get('/user/profile', authMiddleware, getProfile);

describe('User Controller', () => {
  let user: any;
  let token: string;

  beforeAll(async () => {
    await connectTestDB();
    // create test user
    user = await User.create({ email: 'test@example.com', password: 'password123' });
    token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  afterEach(async () => {
    await clearTestDB();
    // recreate user after clearing
    // Recreating the user ensures each test starts with a clean DB and valid test data
    user = await User.create({ email: 'test@example.com', password: 'password123' });
    token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
  });

  describe('GET /user/profile', () => {
    it('should return the current user profile', async () => {
      const res = await request(app)
        .get('/user/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      
      expect(res.body.user.email).toBe('test@example.com');
    });

    it('should fail without token', async () => {
      const res = await request(app).get('/user/profile').expect(401);
      expect(res.body.message).toBe('No token');
    });
  });

  describe('PATCH /user/email', () => {
    it('should change the user email', async () => {
      const res = await request(app)
        .patch('/user/email')
        .set('Authorization', `Bearer ${token}`)
        .send({ newEmail: 'new@example.com' })
        .expect(200);
      
      expect(res.body.user.email).toBe('new@example.com');
      const updated = await User.findById(user._id);
      expect(updated!.email).toBe('new@example.com');
    });

    it('should return 400 if email is missing', async () => {
      const res = await request(app)
        .patch('/user/email')
        .set('Authorization', `Bearer ${token}`)
        .send({})
        .expect(400);
      expect(res.body.message).toBe('New username is required');
    });

    it('should return 400 if email already exists', async () => {
      await User.create({ email: 'existing@example.com', password: 'pass' });
      const res = await request(app)
        .patch('/user/email')
        .set('Authorization', `Bearer ${token}`)
        .send({ newEmail: 'existing@example.com' })
        .expect(400);
      expect(res.body.message).toBe('Username already exists');
    });
  });

  describe('PATCH /user/password', () => {
    it('should change the password', async () => {
      const res = await request(app)
        .patch('/user/password')
        .set('Authorization', `Bearer ${token}`)
        .send({ newPassword: 'newpassword123' })
        .expect(200);

      expect(res.body.message).toBe('Password updated');
      const updatedUser = await User.findById(user._id).select('+password');
      const match = await bcrypt.compare('newpassword123', updatedUser!.password);
      expect(match).toBe(true);
    });

    it('should return 400 if password is missing', async () => {
      const res = await request(app)
        .patch('/user/password')
        .set('Authorization', `Bearer ${token}`)
        .send({})
        .expect(400);
      expect(res.body.message).toBe('New password is required');
    });
  });
});
