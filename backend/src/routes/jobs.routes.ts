import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { addJob, getJobs, getJob, changeJobName, changeJobStatus, changeJobDate, deleteJob, addJobTag, deleteJobTag, getJobTag, uploadFile, deleteFile } from '../controllers/jobs.controller';
import { parser } from '../middleware/upload.middleware';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

const router = express.Router();

// Get all jobs of certain tags 
// need to put before getJob, if not Express will treat by-tags as jobId
//router.get('/by-tags/:tagId', authMiddleware, getJobsByTag);


// Add jobs
// After using multer, req.body will contain your text fields (name, status, appliedAt) and req.file will contain the file info if a file was uploaded.
router.post('/', authMiddleware, upload.single('file'), addJob);

// Get all jobs (with optional params stated)
router.get('/', authMiddleware, getJobs);

// Get single job
router.get('/:jobId', authMiddleware, getJob);

// Change job name
router.patch('/:jobId/name', authMiddleware, changeJobName);

// Change status
router.patch('/:jobId/status', authMiddleware, changeJobStatus);

// Change applied time
router.patch('/:jobId/appliedAt', authMiddleware, changeJobDate);

// Delete job
router.delete('/:jobId', authMiddleware, deleteJob);

// Upload file for existing job
router.post('/:jobId/file', authMiddleware, parser.single('file'), uploadFile);

// Delete file
router.delete('/:jobId/file', authMiddleware, deleteFile);



// Job - Add tag
router.post('/:jobId/tags', authMiddleware, addJobTag);

// Job - Delete tag
router.delete('/:jobId/tags/:tagId', authMiddleware, deleteJobTag);

// Job - Get tag
router.get('/:jobId/tags', authMiddleware, getJobTag);



export default router;