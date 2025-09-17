import express from 'express';
import { register, login } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import User from '../models/User'
import { AuthenticatedRequest } from "../types/auth-request";

const router = express.Router();

router.post('/register', register);
router.post('/login', login);


// Protected route
router.get('/profile', authMiddleware, (req: AuthenticatedRequest, res) => {
  res.json({ user: req?.user }); //req.user is from authMiddleware
});


// Change username, add protection later on
router.patch('/user/username', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const { newUsername } = req.body;

    if (!newUsername) {
      return res.status(400).json({ message: 'New username is required' });
    }

    // 2. Find the user (assuming you have `req.user` from authMiddleware)
    // Note: req.user should contain user's ID
    const user = await User.findById(req?.user?.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.username = newUsername;
    await user.save();

    // 4. Return the updated user
    res.status(200).json({ message: 'Username updated', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

export default router;