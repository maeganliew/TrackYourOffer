import { changeEmail, changePassword, getProfile } from '../controllers/user.controller';
import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

router.patch('/changeEmail', authMiddleware, changeEmail);
router.patch('/changePassword', authMiddleware, changePassword);
router.get('/profile', authMiddleware, getProfile);

export default router;