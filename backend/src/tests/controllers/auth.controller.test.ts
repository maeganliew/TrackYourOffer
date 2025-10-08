import request from 'supertest';
import app from '../../../src/app';
import User from '../../models/User';
import { connectTestDB, disconnectTestDB, clearTestDB } from '../setup';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

beforeAll(async () => {
  await connectTestDB();
});

afterAll(async () => {
  await disconnectTestDB();
});

afterEach(async () => {
  await clearTestDB();
});

describe('Auth Controller', () => {

  describe('Register', () => {
    it('should create a new user and return token', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('uid');
      expect(res.body.email).toBe('test@example.com');

      const user = await User.findOne({ email: 'test@example.com' });
      expect(user).not.toBeNull();
    });

    it('should not allow duplicate registration', async () => {
      await User.create({ email: 'test@example.com', password: 'hashed' });

      const res = await request(app)
        .post('/auth/register')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('User already exists.');
    });
  });

  describe('Login', () => {
    beforeEach(async () => {
      const hashedPass = await bcrypt.hash('password123', 10);
      await User.create({ email: 'login@example.com', password: hashedPass });
    });

    it('should login existing user and return token', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'login@example.com', password: 'password123' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe('login@example.com');

      const decoded: any = jwt.verify(res.body.token, process.env.JWT_SECRET!);
      expect(decoded.email).toBe('login@example.com');
    });

    it('should reject login with wrong password', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'login@example.com', password: 'wrongpass' });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Invalid login credentials');
    });

    it('should reject login with non-existing email', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'noone@example.com', password: 'password123' });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Invalid login credentials');
    });
  });
});