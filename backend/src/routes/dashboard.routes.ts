import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { getDashboardNudges, getStats } from '../controllers/dashboard.controller';

const router = express.Router();

router.get('/stats', authMiddleware, getStats);
router.get('/activity', authMiddleware, getDashboardNudges);

export default router;