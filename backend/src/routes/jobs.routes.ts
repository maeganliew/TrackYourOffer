import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { addJobTag, deleteJobTag, getJobTag} from '../controllers/jobs.controller';

const router = express.Router();

// Job - Add tag
router.post('/:jobId/tags', authMiddleware, addJobTag);

// Job - Delete tag
router.delete('/:jobId/tags/:tagId', authMiddleware, deleteJobTag);

// Job - Get tag
router.get('/:jobId/tags', authMiddleware, getJobTag);


export default router;