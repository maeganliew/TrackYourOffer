"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = exports.uploadFile = exports.getJobTag = exports.deleteJobTag = exports.addJobTag = exports.deleteJob = exports.changeJobDate = exports.changeJobStatus = exports.changeJobName = exports.getJob = exports.getJobs = exports.addJob = exports.assertJobOwnership = void 0;
const Tag_1 = __importDefault(require("../models/Tag"));
const jobTag_1 = __importDefault(require("../models/jobTag"));
const Job_1 = __importDefault(require("../models/Job"));
const Constants_1 = require("../Constants");
const reminderQueue_1 = require("../queues/reminderQueue");
const assertJobOwnership = async (jobId, userId) => {
    if (!jobId)
        throw new Error('JobIdMissing');
    if (!userId)
        throw new Error('Unauthorized');
    const job = await Job_1.default.findById(jobId);
    if (!job)
        throw new Error('JobNotFound');
    if (job.userId.toString() !== userId)
        throw new Error('Forbidden');
    return job;
};
exports.assertJobOwnership = assertJobOwnership;
const addJob = async (req, res, next) => {
    try {
        const { name, status, appliedAt } = req.body;
        if (!name || !status) {
            return res.status(400).json({ message: 'Job name, status and application time are required' });
        }
        if (!Constants_1.allowedJobStatus.includes(status)) {
            return res.status(400).json({ message: `Status must be one of: ${Constants_1.allowedJobStatus.join(', ')}` });
        }
        let appliedAtDate = undefined;
        if (appliedAt) {
            appliedAtDate = new Date(appliedAt);
            if (isNaN(appliedAtDate.getTime())) {
                return res.status(400).json({ message: 'Invalid application date' });
            }
            if (appliedAtDate > new Date()) {
                return res.status(400).json({ message: 'Application date cannot be in the future' });
            }
        }
        const fileData = req.file
            ? {
                file: {
                    url: req.file.path,
                    type: req.file.mimetype.includes('pdf') ? 'pdf' : 'image',
                    filename: req.file.originalname,
                },
            }
            : {};
        const job = await Job_1.default.create({
            userId: req.user?.id,
            name,
            status,
            appliedAt: appliedAtDate,
            ...fileData,
        });
        res.status(201).json({ message: 'Job created successfully', job });
        await (0, reminderQueue_1.addReminderJob)(job.id, 3 * 24 * 60 * 60 * 1000);
    }
    catch (err) {
        next(err);
    }
};
exports.addJob = addJob;
// Support tagId as a query parameter to only return jobs that have that tag.
const getJobs = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const { search, sortBy = 'createdAt', order = 'desc', tagId } = req.query; // Added tagId
        const filter = { userId };
        if (typeof search === 'string' && search.trim() !== '') {
            filter.name = { $regex: search.trim(), $options: 'i' };
        }
        const sortField = typeof sortBy === 'string' ? sortBy : 'createdAt';
        const sortOrder = order === 'asc' ? 1 : -1;
        let jobs;
        if (tagId && typeof tagId === 'string') { // Filter jobs by tag
            const jobTagLinks = await jobTag_1.default.find({ tagId }).select('jobId').lean();
            const jobIds = jobTagLinks.map(jt => jt.jobId);
            filter._id = { $in: jobIds }; // Only include jobs linked to the tag
            jobs = await Job_1.default.find(filter).sort({ [sortField]: sortOrder });
        }
        else {
            jobs = await Job_1.default.find(filter).sort({ [sortField]: sortOrder });
        }
        // Step 2: Get all related JobTags
        const jobIds = jobs.map(job => job._id);
        const jobTags = await jobTag_1.default.find({ jobId: { $in: jobIds } })
            .populate('tagId', 'name colour')
            .lean();
        // Step 3: Group tags by jobId
        const tagsByJob = {};
        for (const jt of jobTags) {
            const jobId = jt.jobId.toString();
            const tag = jt.tagId;
            if (!tagsByJob[jobId])
                tagsByJob[jobId] = [];
            tagsByJob[jobId].push({
                _id: tag._id.toString(),
                name: tag.name,
                colour: tag.colour,
            });
        }
        // Step 4: Attach tags to jobs
        const jobsWithTags = jobs.map(job => ({
            id: job._id.toString(),
            name: job.name,
            status: job.status,
            appliedAt: job.appliedAt,
            createdAt: job.createdAt,
            updatedAt: job.updatedAt,
            tags: tagsByJob[job._id.toString()] || [],
            file: job.file ? {
                url: job.file.url,
                type: job.file.type,
                filename: job.file.filename
            } : undefined,
        }));
        res.status(200).json({ message: 'Jobs returned successfully', jobs: jobsWithTags });
    }
    catch (err) {
        next(err);
    }
};
exports.getJobs = getJobs;
const getJob = async (req, res, next) => {
    try {
        const { jobId } = req.params;
        const job = await Job_1.default.findOne({ userId: req.user?.id, _id: jobId });
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        // also fetch tags
        const jobTags = await jobTag_1.default.find({ jobId }).populate('tagId', 'name colour').lean();
        const tags = jobTags.map(jt => {
            const tag = jt.tagId;
            return {
                _id: tag._id.toString(),
                name: tag.name,
                colour: tag.colour,
            };
        });
        res.status(200).json({
            message: 'Job returned successfully',
            job: {
                id: job._id.toString(),
                name: job.name,
                status: job.status,
                appliedAt: job.appliedAt,
                createdAt: job.createdAt,
                updatedAt: job.updatedAt,
                tags, //include tags directly in response
                file: job.file ? {
                    url: job.file.url,
                    type: job.file.type,
                    filename: job.file.filename
                } : undefined,
            },
        });
    }
    catch (err) {
        next(err);
    }
};
exports.getJob = getJob;
const changeJobName = async (req, res, next) => {
    try {
        const { newJobName } = req.body;
        const job = await (0, exports.assertJobOwnership)(req.params.jobId, req.user?.id);
        job.name = newJobName;
        await job.save();
        res.status(200).json({ message: 'Job name updated', job });
        await (0, reminderQueue_1.rescheduleReminderJob)(job.id, 3 * 24 * 60 * 60 * 1000);
    }
    catch (err) {
        next(err);
    }
};
exports.changeJobName = changeJobName;
const changeJobStatus = async (req, res, next) => {
    try {
        const { newJobStatus } = req.body;
        const job = await (0, exports.assertJobOwnership)(req.params.jobId, req.user?.id);
        if (!Constants_1.allowedJobStatus.includes(newJobStatus)) {
            return res.status(400).json({ message: `Status must be one of: ${Constants_1.allowedJobStatus.join(', ')}` });
        }
        job.status = newJobStatus;
        await job.save();
        res.status(200).json({ message: 'Job status changed successfully', job });
        await (0, reminderQueue_1.rescheduleReminderJob)(job.id, 3 * 24 * 60 * 60 * 1000);
    }
    catch (err) {
        next(err);
    }
};
exports.changeJobStatus = changeJobStatus;
const changeJobDate = async (req, res, next) => {
    try {
        // string sent from frontend
        const newTimeRaw = req.body.newTime?.trim();
        if (!newTimeRaw) {
            return res.status(400).json({ message: 'New application date is required' });
        }
        //tries to parse into date time object
        const parsedTime = new Date(newTimeRaw);
        if (isNaN(parsedTime.getTime())) {
            return res.status(400).json({ message: 'Invalid application date' });
        }
        const today = new Date();
        const parsedDate = new Date(parsedTime.getFullYear(), parsedTime.getMonth(), parsedTime.getDate());
        const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        if (parsedDate > todayDate) {
            return res.status(400).json({ message: 'Application date cannot be in the future' });
        }
        const job = await (0, exports.assertJobOwnership)(req.params.jobId, req.user?.id);
        job.appliedAt = parsedTime;
        await job.save();
        res.status(200).json({ message: 'Applied time changed successfully', job });
        await (0, reminderQueue_1.rescheduleReminderJob)(job.id, 3 * 24 * 60 * 60 * 1000);
    }
    catch (err) {
        next(err);
    }
};
exports.changeJobDate = changeJobDate;
const deleteJob = async (req, res, next) => {
    try {
        const job = await (0, exports.assertJobOwnership)(req.params.jobId, req.user?.id);
        await Job_1.default.deleteOne({ _id: job._id });
        await jobTag_1.default.deleteMany({ jobId: job._id });
        res.status(200).json({ message: 'Job deleted successfully', job });
    }
    catch (err) {
        next(err);
    }
};
exports.deleteJob = deleteJob;
const addJobTag = async (req, res, next) => {
    try {
        const { tagId } = req.body;
        const { jobId } = req.params;
        const existingTag = await Tag_1.default.findOne({ _id: tagId });
        if (!existingTag) {
            return res.status(404).json({ message: 'Tag does not exist' });
        }
        const job = await (0, exports.assertJobOwnership)(req.params.jobId, req.user?.id);
        const existingJobTag = await jobTag_1.default.findOne({ jobId, tagId: existingTag._id });
        if (existingJobTag) {
            return res.status(400).json({ message: 'Tag already added to this job' });
        }
        // no need createdAt field, cuz schema set it to be Date.now
        const jobTag = await jobTag_1.default.create({ jobId, tagId: existingTag._id });
        res.status(200).json({ message: 'Job Tag added successfully', jobTag });
        await (0, reminderQueue_1.rescheduleReminderJob)(job.id, 3 * 24 * 60 * 60 * 1000);
    }
    catch (err) {
        next(err);
    }
};
exports.addJobTag = addJobTag;
const deleteJobTag = async (req, res, next) => {
    try {
        const { jobId, tagId } = req.params;
        const existingJobTag = await jobTag_1.default.findOne({ jobId, tagId });
        if (!existingJobTag) {
            return res.status(404).json({ message: 'Tag does not exist' });
        }
        const job = await (0, exports.assertJobOwnership)(req.params.jobId, req.user?.id);
        // no need createdAt field, cuz schema set it to be Date.now
        await jobTag_1.default.deleteOne({ _id: existingJobTag._id });
        res.status(200).json({ message: 'Job Tag deleted successfully', existingJobTag });
        await (0, reminderQueue_1.rescheduleReminderJob)(job.id, 3 * 24 * 60 * 60 * 1000);
    }
    catch (err) {
        next(err);
    }
};
exports.deleteJobTag = deleteJobTag;
const getJobTag = async (req, res, next) => {
    try {
        const job = await (0, exports.assertJobOwnership)(req.params.jobId, req.user?.id);
        // In JobTag schema, 'ref: 'Tag',' so mongoose knows how to populate
        const jobTags = await jobTag_1.default.find({ jobId: job._id }).populate('tagId', 'name colour');
        res.status(200).json({ message: 'Job Tag returned successfully', jobTags });
    }
    catch (err) {
        next(err);
    }
};
exports.getJobTag = getJobTag;
// export const getJobsByTag = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
//     try {
//         const {tagId} = req.params;
//         const userId = req.user?.id;
//         if (!tagId) {
//         return res.status(400).json({ message: 'tagId query parameter is required' });
//         }
//         const tag = await Tag.findOne({ _id: tagId, userId });
//         if (!tag) {
//             return res.status(404).json({ message: 'Tag not found or does not belong to user' });
//         }
//         const jobTagLinks = await JobTag.find({ tagId: tag._id });
//         const jobIds = jobTagLinks.map(link => link.jobId);
//         if (jobIds.length === 0) {
//             return res.status(200).json({ message: 'No jobs for this tag', jobs: [] });
//         }
//         const jobs = await Job.find({ _id: { $in: jobIds }, userId: userId });
//         res.status(200).json({ message: 'Jobs with specified tag returned successfully', jobs });
//     } catch (err) {
//         next(err);
//     }
// }
const uploadFile = async (req, res, next) => {
    try {
        const { jobId } = req.params;
        const userId = req.user?.id;
        const job = await Job_1.default.findOne({ _id: jobId, userId });
        if (!job) {
            return res.status(404).json({ message: 'Job not found or unauthorized' });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const uploadedFile = req.file;
        // Save file info to the job
        job.file = {
            url: uploadedFile.path, // This is the Cloudinary URL
            type: uploadedFile.mimetype.includes('pdf') ? 'pdf' : 'image',
            filename: uploadedFile.originalname,
        };
        await job.save();
        res.status(200).json({ message: 'File uploaded successfully', job });
        await (0, reminderQueue_1.rescheduleReminderJob)(job.id, 3 * 24 * 60 * 60 * 1000);
    }
    catch (err) {
        next(err);
    }
};
exports.uploadFile = uploadFile;
const deleteFile = async (req, res, next) => {
    try {
        const { jobId } = req.params;
        const userId = req.user?.id;
        const job = await Job_1.default.findOne({ _id: jobId, userId });
        if (!job) {
            return res.status(404).json({ message: 'Job not found or unauthorized' });
        }
        if (!job.file || !job.file.url) {
            return res.status(400).json({ message: 'No file to delete' });
        }
        // Optional: If you want to also delete the file from Cloudinary
        // You must store public_id in DB when uploading to Cloudinary
        // import cloudinary from '../utils/cloudinary';
        // await cloudinary.uploader.destroy(job.file.public_id, { resource_type: 'raw' });
        // Clear file info from job
        job.file = null;
        await job.save();
        res.status(200).json({ message: 'File removed successfully' });
    }
    catch (err) {
        next(err);
    }
};
exports.deleteFile = deleteFile;
//# sourceMappingURL=jobs.controller.js.map