import { changeUsername, changePassword, getProfile } from '../controllers/user.controller';
import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

router.patch('/changeUsername', authMiddleware, changeUsername);
router.patch('/changePassword', authMiddleware, changePassword);
router.get('/profile', authMiddleware, getProfile);

export default router;