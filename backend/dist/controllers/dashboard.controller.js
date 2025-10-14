"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardNudges = exports.getStats = void 0;
const Job_1 = __importDefault(require("../models/Job"));
const jobTag_1 = __importDefault(require("../models/jobTag"));
const mongoose_1 = __importDefault(require("mongoose"));
const getStats = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const totalJobs = await Job_1.default.countDocuments({ userId });
        const jobsByStatusRaw = await Job_1.default.aggregate([
            // when matching, mongo does sth like literal comparison, so need to convert yourself.
            { $match: { userId: new mongoose_1.default.Types.ObjectId(userId) } },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);
        const jobsByStatus = {};
        jobsByStatusRaw.forEach(j => { jobsByStatus[j._id] = j.count; });
        const jobs = await Job_1.default.find({ userId }).select('_id').lean();
        const jobIds = jobs.map(job => job._id);
        const jobTags = await jobTag_1.default.find({ jobId: { $in: jobIds } })
            .populate('tagId', 'name colour')
            .lean();
        const jobsByTag = {};
        jobTags.forEach(jt => {
            const tag = jt.tagId; // populated tag
            if (!tag || !tag.name)
                return;
            if (!jobsByTag[tag.name]) {
                jobsByTag[tag.name] = { count: 0, colour: tag.colour };
            }
            jobsByTag[tag.name].count += 1;
        });
        return res.status(200).json({ message: 'Dashboard stats returned successfully', dashboardstats: {
                totalJobs, jobsByStatus, jobsByTag
            } });
    }
    catch (err) {
        next(err);
    }
};
exports.getStats = getStats;
const getDashboardNudges = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });
        const jobs = await Job_1.default.find({ userId }).lean();
        const jobIds = jobs.map(job => job._id);
        const jobTags = await jobTag_1.default.find({ jobId: { $in: jobIds } });
        const tagCountByJob = new Map();
        jobTags.forEach(jt => {
            const id = jt.jobId.toString();
            tagCountByJob.set(id, (tagCountByJob.get(id) || 0) + 1);
        });
        const today = new Date();
        const nudges = [];
        // WORKS
        const untaggedJobs = jobs.filter(job => !tagCountByJob.has(job._id.toString()));
        if (untaggedJobs.length > 0) {
            nudges.push(`You have ${untaggedJobs.length} jobs without any tags.`);
        }
        // WORKS
        const wishlistJobs = jobs.filter(job => job.status?.toLowerCase() === 'wishlist');
        if (wishlistJobs.length > 0) {
            nudges.push(`${wishlistJobs.length} of your jobs are still marked as 'Wishlist'. Time to apply?`);
        }
        // 3️⃣ Jobs updated in last 7 days (encouragement)
        const updatedLastWeek = jobs.filter(job => {
            const updated = new Date(job.updatedAt);
            return (today.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24) <= 7;
        });
        if (updatedLastWeek.length > 0) {
            nudges.push(`You updated ${updatedLastWeek.length} jobs last week — great job staying consistent!`);
        }
        // WORKS
        const staleJobs = jobs.filter(job => {
            const updated = new Date(job.updatedAt);
            return (today.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24) > 30;
        });
        if (staleJobs.length > 0) {
            nudges.push(`You haven't updated ${staleJobs.length} jobs in over 30 days.`);
        }
        res.status(200).json({ nudges });
    }
    catch (err) {
        next(err);
    }
};
exports.getDashboardNudges = getDashboardNudges;
//# sourceMappingURL=dashboard.controller.js.map