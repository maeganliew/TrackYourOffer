import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/auth-request";
import Tag from '../models/Tag';
import JobTag from '../models/jobTag';
import Job from '../models/Job';
import { allowedJobStatus } from "../Constants";
import mongoose from "mongoose";

export const assertJobOwnership = async (jobId: string | undefined, userId: string | undefined) => {
  if (!jobId) throw new Error('JobIdMissing');
  if (!userId) throw new Error('Unauthorized');

  const job = await Job.findById(jobId);
  if (!job) throw new Error('JobNotFound');
  if (job.userId.toString() !== userId) throw new Error('Forbidden');

  return job;
};

export const addJob = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const name = req.body.name?.trim();
        const status = req.body.status?.trim();     
        const appliedAtRaw = req.body.appliedAt;
   
        if (!name || !status) {
            return res.status(400).json({ message: 'Job name, status and application time are required' });
        }

        if (!allowedJobStatus.includes(status)) {
            return res.status(400).json({ message: `Status must be one of: ${allowedJobStatus.join(', ')}` });
        }
        let appliedAt: Date | undefined = undefined;
        if (appliedAtRaw) {
            appliedAt = new Date(appliedAtRaw);
            if (isNaN(appliedAt.getTime())) {
                return res.status(400).json({ message: 'Invalid application date' });
            }
            if (appliedAt > new Date()) {
                return res.status(400).json({ message: 'Application date cannot be in the future' });
            }
        }
        const job = await Job.create({ userId: req.user?.id, name, status, appliedAt});
        res.status(201).json({ message: 'Job created successfully', job });
    } catch (err) {
        next(err);
    }
}

export const getJobs = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const existingJobs = await Job.find({ userId: req.user?.id });
        if (existingJobs[0]?.userId.toString() !== req.user?.id) {
            return res.status(403).json({ message: 'Forbidden: You cannot modify this job' });
        }
        res.status(200).json({ message: 'Jobs returned successfully', jobs: existingJobs});
    } catch (err) {
        next(err);
    }
}

export const getJob = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const job = await Job.find({ userId: req.user?.id });
        res.status(200).json({ message: 'Job returned successfully', job});
    } catch (err) {
        next(err);
    }
}

export const changeJobName = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const {newJobName} = req.body;
        const job = await assertJobOwnership(req.params.jobId, req.user?.id);
        job.name = newJobName;
        await job.save();
        res.status(200).json({ message: 'Job name updated', job });
    } catch (err) {
        next(err);
    }
}

export const changeJobStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const {newJobStatus} = req.body;
        const job = await assertJobOwnership(req.params.jobId, req.user?.id);
        if (!allowedJobStatus.includes(newJobStatus)) {
            return res.status(400).json({ message: `Status must be one of: ${allowedJobStatus.join(', ')}` });
        }
        job.status = newJobStatus;
        await job.save()
        res.status(200).json({ message: 'Job status changed successfully', job });
    } catch (err) {
        next(err);
    }
}

export const changeJobDate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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
        const job = await assertJobOwnership(req.params.jobId, req.user?.id);
        job.appliedAt = parsedTime;
        await job.save();
        res.status(200).json({ message: 'Applied time changed successfully', job });
    } catch (err) {
        next(err);
    }
}

export const deleteJob = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const job = await assertJobOwnership(req.params.jobId, req.user?.id);
        await Job.deleteOne({_id: job._id})
        res.status(200).json({ message: 'Job deleted successfully', job});

    } catch (err) {
        next(err);
    }
}

export const addJobTag = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const {tagName} = req.body;
        const {jobId} = req.params;
        const existingTag = await Tag.findOne({ name: tagName });
        if (!existingTag) {
            return res.status(404).json({ message: 'Tag does not exist'});
        }

        const job = await assertJobOwnership(req.params.jobId, req.user?.id);

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

        const job = await assertJobOwnership(req.params.jobId, req.user?.id);

        // no need createdAt field, cuz schema set it to be Date.now
        await JobTag.deleteOne({_id: existingJobTag._id})
        res.status(200).json({ message: 'Job Tag deleted successfully', existingJobTag});
    } catch (err) {
        next(err);
    }
}

export const getJobTag = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const job = await assertJobOwnership(req.params.jobId, req.user?.id);

        // In JobTag schema, 'ref: 'Tag',' so mongoose knows how to populate
        const jobTags = await JobTag.find({jobId: job._id}).populate('tagId', 'name colour');
        res.status(200).json({ message: 'Job Tag returned successfully', jobTags}); 
    } catch (err) {
        next(err);
    }
}

export const getJobsByTag = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const tagId = req.query.tagId?.toString();
        const userId = req.user?.id;

        if (!tagId) {
        return res.status(400).json({ message: 'tagId query parameter is required' });
        }
        const tag = await Tag.findOne({ _id: tagId, userId });
        if (!tag) {
            return res.status(404).json({ message: 'Tag not found or does not belong to user' });
        }

        const tagObjectId = new mongoose.Types.ObjectId(tagId);
        const jobTagLinks = await JobTag.find({ tagId });
        const jobIds = jobTagLinks.map(link => link.jobId);
        const jobs = await Job.find({ _id: { $in: jobIds }, userId });
        res.status(200).json({ message: 'Jobs with specified tag returned successfully', jobs });
    } catch (err) {
        next(err);
    }
}
