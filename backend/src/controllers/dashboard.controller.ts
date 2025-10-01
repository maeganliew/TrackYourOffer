import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/auth-request";
import Job from '../models/Job'
import JobTag from '../models/jobTag'
import mongoose from 'mongoose';

export const getStats = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        const totalJobs = await Job.countDocuments({ userId })
        const jobsByStatusRaw = await Job.aggregate([
            // when matching, mongo does sth like literal comparison, so need to convert yourself.
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);
        const jobsByStatus: Record<string, number> = {};
        jobsByStatusRaw.forEach(j => { jobsByStatus[j._id] = j.count; });


        const jobs = await Job.find({ userId }).select('_id').lean();
        const jobIds = jobs.map(job => job._id);

        const jobTags = await JobTag.find({ jobId: { $in: jobIds } })
            .populate('tagId', 'name colour')
            .lean();

        const jobsByTag: Record<string, { count: number, colour: string }> = {};

        jobTags.forEach(jt => {
            const tag = jt.tagId as any; // populated tag
            if (!tag || !tag.name) return;

            if (!jobsByTag[tag.name]) {
                jobsByTag[tag.name] = { count: 0, colour: tag.colour };
            }
            jobsByTag[tag.name]!.count += 1;
        });

        return res.status(200).json({ message: 'Dashboard stats returned successfully', dashboardstats: {
            totalJobs, jobsByStatus, jobsByTag
        }})
    } catch (err) {
        next(err);
    }
}