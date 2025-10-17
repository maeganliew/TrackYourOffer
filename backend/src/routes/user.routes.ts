import { changeEmail, changePassword, getProfile } from '../controllers/user.controller';
import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User profile and account management
 */

/**
 * @swagger
 * /user/changeEmail:
 *   patch:
 *     summary: Change the email of the authenticated user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: New email address
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newEmail
 *             properties:
 *               newEmail:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Email updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/UserPublic'
 *       400:
 *         description: Email already exists or not provided
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.patch('/changeEmail', authMiddleware, changeEmail);

/**
 * @swagger
 * /user/changePassword:
 *   patch:
 *     summary: Change the password of the authenticated user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: New password
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/UserPublic'
 *       400:
 *         description: New password not provided
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.patch('/changePassword', authMiddleware, changePassword);

/**
 * @swagger
 * /user/profile:
 *   get:
 *     summary: Get the profile of the authenticated user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/UserPublic'
 *       401:
 *         description: Unauthorized
 */
router.get('/profile', authMiddleware, getProfile);

export default router;