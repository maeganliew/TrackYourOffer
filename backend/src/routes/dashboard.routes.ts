import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { getDashboardNudges, getStats } from '../controllers/dashboard.controller';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard stats and nudges
 */

/**
 * @swagger
 * /dashboard/stats:
 *   get:
 *     summary: Get overall job statistics for the user
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 dashboardstats:
 *                   type: object
 *                   properties:
 *                     totalJobs:
 *                       type: integer
 *                       example: 12
 *                     jobsByStatus:
 *                       type: object
 *                       additionalProperties:
 *                         type: integer
 *                       example: { "wishlist": 5, "applied": 7 }
 *                     jobsByTag:
 *                       type: object
 *                       additionalProperties:
 *                         type: object
 *                         properties:
 *                           count:
 *                             type: integer
 *                             example: 3
 *                           colour:
 *                             type: string
 *                             example: "pink"
 *       401:
 *         description: Unauthorized (no token)
 *       500:
 *         description: Internal server error
 */
router.get('/stats', authMiddleware, getStats);

/**
 * @swagger
 * /dashboard/activity:
 *   get:
 *     summary: Get dashboard nudges for the user
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard nudges returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nudges:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: [
 *                     "You have 2 jobs without any tags.",
 *                     "1 of your jobs are still marked as 'Wishlist'. Time to apply?",
 *                     "You updated 3 jobs last week — great job staying consistent!",
 *                     "You haven't updated 1 jobs in over 30 days."
 *                   ]
 *       401:
 *         description: Unauthorized (no token)
 *       500:
 *         description: Internal server error
 */
router.get('/activity', authMiddleware, getDashboardNudges);

export default router;