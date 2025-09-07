import express from 'express';
import { register, login } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Protected route
router.get('/profile', authMiddleware, (req, res) => {
  res.json({ user: req.user }); //req.user is from authMiddleware
});

export default router;