import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { addJob, getJobs, getJob, changeJobName, changeJobStatus, changeJobDate, deleteJob, addJobTag, deleteJobTag, getJobTag, getJobsByTag} from '../controllers/jobs.controller';

const router = express.Router();

// Get all jobs of certain tags 
// need to put before getJob, if not Express will treat by-tags as jobId
router.get('/by-tags', authMiddleware, getJobsByTag);


// Add jobs
router.post('/', authMiddleware, addJob);

// Get all jobs (with optional params stated)
router.get('/', authMiddleware, getJobs);

// Get single job
router.get('/:jobId', authMiddleware, getJob);

// Change job name
router.patch('/:jobId/name', authMiddleware, changeJobName);

// Change status
router.patch('/:jobId/status', authMiddleware, changeJobStatus);

// Change applied time
router.patch('/:jobId/applied_time', authMiddleware, changeJobDate);

// Delete job
router.delete('/:jobId', authMiddleware, deleteJob);



// Job - Add tag
router.post('/:jobId/tags', authMiddleware, addJobTag);

// Job - Delete tag
router.delete('/:jobId/tags/:tagId', authMiddleware, deleteJobTag);

// Job - Get tag
router.get('/:jobId/tags', authMiddleware, getJobTag);


export default router;