import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/auth-request";
import Tag from '../models/Tag';
import JobTag from '../models/jobTag';
import Job from '../models/Job';

export const addJobTag = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const {tagName} = req.body;
        const {jobId} = req.params;
        const existingTag = await Tag.findOne({ name: tagName });
        if (!existingTag) {
            return res.status(404).json({ message: 'Tag does not exist'});
        }

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        // Check that the current user owns this job
        if (job.userId.toString() !== req.user?.id) {
            return res.status(403).json({ message: 'Forbidden: You cannot modify this job' });
        }

        const existingJobTag = await JobTag.findOne({ jobId, tagId: existingTag._id });
        if (existingJobTag) {
            return res.status(400).json({ message: 'Tag already added to this job' });
        }
        // no need createdAt field, cuz schema set it to be Date.now
        const jobTag = await JobTag.create({jobId, tagId: existingTag._id})
        res.status(200).json({ message: 'Job Tag added successfully', jobTag});
    } catch (err) {
        next(err);
    }
}

export const deleteJobTag = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const {jobId, tagId} = req.params;
        const existingJobTag = await JobTag.findOne({ jobId, tagId });
        if (!existingJobTag) {
            return res.status(404).json({ message: 'Tag does not exist'});
        }

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        // Check that the current user owns this job
        if (job.userId.toString() !== req.user?.id) {
        return res.status(403).json({ message: 'Forbidden: You cannot modify this job' });
        }

        // no need createdAt field, cuz schema set it to be Date.now
        await JobTag.deleteOne({_id: existingJobTag._id})
        res.status(200).json({ message: 'Job Tag deleted successfully', existingJobTag});
    } catch (err) {
        next(err);
    }
}

export const getJobTag = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const {jobId} = req.params;
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // In JobTag schema, 'ref: 'Tag',' so mongoose knows how to populate
        const jobTags = await JobTag.find({jobId}).populate('tagId', 'name colour');
        res.status(200).json({ message: 'Job Tag returned successfully', jobTags}); 
    } catch (err) {
        next(err);
    }
}