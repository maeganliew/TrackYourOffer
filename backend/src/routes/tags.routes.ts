import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { addUserTag, deleteUserTag, editUserTag, getUserTag } from '../controllers/tags.controller';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tags
 *   description: User tag management
 */

/**
 * @swagger
 * /tags:
 *   post:
 *     summary: Create a new tag
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - colour
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tag name
 *               colour:
 *                 type: string
 *                 description: Predefined or custom color
 *                 example: "#6B7280"
 *     responses:
 *       201:
 *         description: Tag created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 tag:
 *                   $ref: '#/components/schemas/Tag'
 *       400:
 *         description: Validation error or duplicate tag
 */
router.post('/', authMiddleware, addUserTag);

/**
 * @swagger
 * /tags:
 *   get:
 *     summary: Get all user tags
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tags
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 tags:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Tag'
 */
router.get('/', authMiddleware, getUserTag);

/**
 * @swagger
 * /tags/{tagId}:
 *   patch:
 *     summary: Edit an existing tag
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the tag to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               colour:
 *                 type: string
 *                 description: Predefined or custom color
 *                 example: "#6B7280"
 *     responses:
 *       200:
 *         description: Updated tag object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 tag:
 *                   $ref: '#/components/schemas/Tag'
 *       404:
 *         description: Tag not found
 */
router.patch('/:tagId', authMiddleware, editUserTag);

/**
 * @swagger
 * /tags/{tagId}:
 *   delete:
 *     summary: Delete a tag
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the tag to delete
 *     responses:
 *       200:
 *         description: Tag deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 tag:
 *                   $ref: '#/components/schemas/Tag'
 *       404:
 *         description: Tag not found
 */
router.delete('/:tagId', authMiddleware, deleteUserTag);

export default router;
