import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { addJob, getJobs, getJob, changeJobName, changeJobStatus, changeJobDate, deleteJob, addJobTag, deleteJobTag, getJobTag, uploadFile, deleteFile } from '../controllers/jobs.controller';
import { parser } from '../middleware/upload.middleware';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: Job management endpoints
 */

/**
 * @swagger
 * /jobs:
 *   post:
 *     summary: Create a new job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - status
 *             properties:
 *               name:
 *                 type: string
 *               status:
 *                 type: string
 *                 description: Job status (must be one of allowedJobStatus)
 *               appliedAt:
 *                 type: string
 *                 format: date-time
 *                 description: Date applied
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Job created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 job:
 *                   $ref: '#/components/schemas/Job'
 *       400:
 *         description: Validation error
 */
// After using multer, req.body will contain your text fields (name, status, appliedAt) and req.file will contain the file info if a file was uploaded.
router.post('/', authMiddleware, upload.single('file'), addJob);

/**
 * @swagger
 * /jobs:
 *   get:
 *     summary: Get all jobs (optional search, sort, or tag filter)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by job name
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, appliedAt, name, status]
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *       - in: query
 *         name: tagId
 *         schema:
 *           type: string
 *         description: Filter jobs by tag
 *     responses:
 *       200:
 *         description: Jobs returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/JobTags'
 */
router.get('/', authMiddleware, getJobs);

/**
 * @swagger
 * /jobs/{jobId}:
 *   get:
 *     summary: Get a single job by ID
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 job:
 *                   $ref: '#/components/schemas/JobTags'
 *       404:
 *         description: Job not found
 */
router.get('/:jobId', authMiddleware, getJob);

/**
 * @swagger
 * /jobs/{jobId}/name:
 *   patch:
 *     summary: Change job name
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newJobName
 *             properties:
 *               newJobName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Job name updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 job:
 *                   $ref: '#/components/schemas/Job'
 *       404:
 *         description: Job not found
 */
router.patch('/:jobId/name', authMiddleware, changeJobName);

/**
 * @swagger
 * /jobs/{jobId}/status:
 *   patch:
 *     summary: Change job status
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newJobStatus
 *             properties:
 *               newJobStatus:
 *                 type: string
 *                 description: Job status (must be one of allowedJobStatus)
 *     responses:
 *       200:
 *         description: Job status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 job:
 *                   $ref: '#/components/schemas/Job'
 *       400:
 *         description: Invalid status
 *       404:
 *         description: Job not found
 */
router.patch('/:jobId/status', authMiddleware, changeJobStatus);

/**
 * @swagger
 * /jobs/{jobId}/appliedAt:
 *   patch:
 *     summary: Change applied date of a job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newTime
 *             properties:
 *               newTime:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Applied time updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 job:
 *                   $ref: '#/components/schemas/Job'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Job not found
 */
router.patch('/:jobId/appliedAt', authMiddleware, changeJobDate);

/**
 * @swagger
 * /jobs/{jobId}:
 *   delete:
 *     summary: Delete a job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 job:
 *                   $ref: '#/components/schemas/Job'
 *       404:
 *         description: Job not found
 */
router.delete('/:jobId', authMiddleware, deleteJob);

/**
 * @swagger
 * /jobs/{jobId}/file:
 *   post:
 *     summary: Upload a file for a job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 job:
 *                   $ref: '#/components/schemas/Job'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Job not found
 */ 
router.post('/:jobId/file', authMiddleware, parser.single('file'), uploadFile);

/**   
 * @swagger
 * /jobs/{jobId}/file:
 *   delete:
 *     summary: Delete a file from a job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: File removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Job not found
 */
router.delete('/:jobId/file', authMiddleware, deleteFile);

/**
 * @swagger
 * /jobs/{jobId}/tags:
 *   post:
 *     summary: Add a tag to a job
 *     tags: [JobTags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the job
 *     requestBody:
 *       description: Tag to add
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tagId
 *             properties:
 *               tagId:
 *                 type: string
 *                 description: ID of the tag to add
 *     responses:
 *       200:
 *         description: Job tag added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 jobTag:
 *                   type: object
 *                   properties:
 *                     jobId:
 *                       type: string
 *                     tagId:
 *                       $ref: '#/components/schemas/Tag'
 *       400:
 *         description: Tag already added to this job
 *       404:
 *         description: Tag or job not found
 */
router.post('/:jobId/tags', authMiddleware, addJobTag);

/**
 * @swagger
 * /jobs/{jobId}/tags/{tagId}:
 *   delete:
 *     summary: Remove a tag from a job
 *     tags: [JobTags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the job
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the tag to remove
 *     responses:
 *       200:
 *         description: Job tag removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 existingJobTag:
 *                   type: object
 *                   properties:
 *                     jobId:
 *                       type: string
 *                     tagId:
 *                       $ref: '#/components/schemas/Tag'
 *       404:
 *         description: Tag or job not found
 */
router.delete('/:jobId/tags/:tagId', authMiddleware, deleteJobTag);

/**
 * @swagger
 * /jobs/{jobId}/tags:
 *   get:
 *     summary: Get all tags for a job
 *     tags: [JobTags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the job
 *     responses:
 *       200:
 *         description: List of tags for the job
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 jobTags:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       jobId:
 *                         type: string
 *                       tagId:
 *                         $ref: '#/components/schemas/Tag'
 *       404:
 *         description: Job not found
 */
router.get('/:jobId/tags', authMiddleware, getJobTag);

export default router;