"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const jobs_controller_1 = require("../controllers/jobs.controller");
const upload_middleware_1 = require("../middleware/upload.middleware");
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)({ dest: 'uploads/' });
const router = express_1.default.Router();
// Get all jobs of certain tags 
// need to put before getJob, if not Express will treat by-tags as jobId
//router.get('/by-tags/:tagId', authMiddleware, getJobsByTag);
// Add jobs
// After using multer, req.body will contain your text fields (name, status, appliedAt) and req.file will contain the file info if a file was uploaded.
router.post('/', auth_middleware_1.authMiddleware, upload.single('file'), jobs_controller_1.addJob);
// Get all jobs (with optional params stated)
router.get('/', auth_middleware_1.authMiddleware, jobs_controller_1.getJobs);
// Get single job
router.get('/:jobId', auth_middleware_1.authMiddleware, jobs_controller_1.getJob);
// Change job name
router.patch('/:jobId/name', auth_middleware_1.authMiddleware, jobs_controller_1.changeJobName);
// Change status
router.patch('/:jobId/status', auth_middleware_1.authMiddleware, jobs_controller_1.changeJobStatus);
// Change applied time
router.patch('/:jobId/appliedAt', auth_middleware_1.authMiddleware, jobs_controller_1.changeJobDate);
// Delete job
router.delete('/:jobId', auth_middleware_1.authMiddleware, jobs_controller_1.deleteJob);
// Upload file for existing job
router.post('/:jobId/file', auth_middleware_1.authMiddleware, upload_middleware_1.parser.single('file'), jobs_controller_1.uploadFile);
// Delete file
router.delete('/:jobId/file', auth_middleware_1.authMiddleware, jobs_controller_1.deleteFile);
// Job - Add tag
router.post('/:jobId/tags', auth_middleware_1.authMiddleware, jobs_controller_1.addJobTag);
// Job - Delete tag
router.delete('/:jobId/tags/:tagId', auth_middleware_1.authMiddleware, jobs_controller_1.deleteJobTag);
// Job - Get tag
router.get('/:jobId/tags', auth_middleware_1.authMiddleware, jobs_controller_1.getJobTag);
exports.default = router;
//# sourceMappingURL=jobs.routes.js.map