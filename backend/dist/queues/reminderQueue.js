"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rescheduleReminderJob = exports.addReminderJob = exports.handleReminderJob = exports.getReminderQueue = void 0;
const bull_1 = __importDefault(require("bull")); // <- import class + type
const email_1 = require("../utils/email");
const Job_1 = __importDefault(require("../models/Job"));
const User_1 = __importDefault(require("../models/User"));
let reminderQueue = null;
/**
 * Lazily initializes the reminder queue.
 * Ensures queue is only created when actually needed.
 */
const getReminderQueue = () => {
    if (!reminderQueue) {
        reminderQueue = new bull_1.default('reminders', {
            redis: { host: '127.0.0.1', port: 6379 },
        });
        reminderQueue.process(exports.handleReminderJob);
    }
    return reminderQueue;
};
exports.getReminderQueue = getReminderQueue;
const handleReminderJob = async (job) => {
    const { jobId } = job.data;
    const jobData = await Job_1.default.findById(jobId);
    if (!jobData)
        return;
    const user = await User_1.default.findById(jobData.userId);
    if (!user)
        return;
    const now = new Date();
    const lastUpdated = new Date(jobData.updatedAt);
    const daysSinceUpdate = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24);
    console.log(`[Reminder Queue] Days since last update: ${daysSinceUpdate}`);
    if (daysSinceUpdate >= 3) {
        await (0, email_1.sendEmail)(user.email, 'Reminder: Update your job status', `Your job "${jobData.name}" has not been updated in 3 days.`);
    }
};
exports.handleReminderJob = handleReminderJob;
const addReminderJob = async (jobId, delayMs) => {
    await (0, exports.getReminderQueue)().add({ jobId }, {
        delay: delayMs,
        removeOnComplete: true,
        removeOnFail: true,
    });
};
exports.addReminderJob = addReminderJob;
const rescheduleReminderJob = async (jobId, delayMs) => {
    const queue = (0, exports.getReminderQueue)();
    const jobs = await queue.getDelayed();
    const existingJob = jobs.find(job => job.name === `reminder-${jobId}`);
    if (existingJob) {
        await existingJob.remove();
    }
    await (0, exports.addReminderJob)(jobId, delayMs);
};
exports.rescheduleReminderJob = rescheduleReminderJob;
/* original code

const reminderQueue = new Queue('reminders', {
  redis: { host: '127.0.0.1', port: 6379 },
});

reminderQueue.process(handleReminderJob);

export default reminderQueue;

This instantiates the queue immediately when the module is imported.

every time some other module imports this file (even your tests importing app.ts),
Node connects to Redis and starts a live queue process.
*/
//# sourceMappingURL=reminderQueue.js.map