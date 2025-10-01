import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { getStats } from '../controllers/dashboard.controller';

const router = express.Router();

router.get('/stats', authMiddleware, getStats);

export default router;