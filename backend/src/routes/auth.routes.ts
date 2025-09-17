import express from 'express';
import { register, login } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import User from '../models/User'
import { AuthenticatedRequest } from "../types/auth-request";
import bcrypt from "bcrypt";

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/profile', authMiddleware, (req: AuthenticatedRequest, res) => {
  res.json({ user: req?.user }); //req.user is from authMiddleware
});


router.patch('/user/username', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const { newUsername } = req.body;

    if (!newUsername) {
      return res.status(400).json({ message: 'New username is required' });
    }

    //Find the user (you have `req.user` from authMiddleware)
    const user = await User.findById(req?.user?.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    //Checks for duplicate username
    const existingUsername = await User.findOne({username: newUsername});
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    user.username = newUsername;
    await user.save();

    res.status(200).json({ message: 'Username updated', user: { id: user._id, username: user.username}});
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});


router.patch('/user/password', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword) {
      return res.status(400).json({ message: 'New password is required' }); 
    }

    const user = await User.findById(req?.user?.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const saltRounds = 10;
    const hashedPass = await bcrypt.hash(newPassword, saltRounds);
    user.password = hashedPass;
    await user.save();

    res.status(200).json({ message: 'Password updated', user: { id: user._id, username: user.username}});
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

export default router;