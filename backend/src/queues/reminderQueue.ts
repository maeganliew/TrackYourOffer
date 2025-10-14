import Bull, { Queue as BullQueue } from 'bull'; // <- import class + type
import { sendEmail } from '../utils/email';
import Job from '../models/Job';
import User from '../models/User';

let reminderQueue: BullQueue | null = null;

/**
 * Lazily initializes the reminder queue.
 * Ensures queue is only created when actually needed.
 */
export const getReminderQueue = (): BullQueue => {
  if (!reminderQueue) {
    reminderQueue = new Bull('reminders', process.env.REDIS_URL!);
    reminderQueue.process(handleReminderJob);
  }
  return reminderQueue;
};

export const handleReminderJob = async (job: { data: { jobId: string } }) => {
  const { jobId } = job.data;

  const jobData = await Job.findById(jobId);
  if (!jobData) return;

  const user = await User.findById(jobData.userId);
  if (!user) return;

  const now = new Date();
  const lastUpdated = new Date(jobData.updatedAt);
  const daysSinceUpdate = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24);

  console.log(`[Reminder Queue] Days since last update: ${daysSinceUpdate}`);

  if (daysSinceUpdate >= 3) {
    await sendEmail(
      user.email,
      'Reminder: Update your job status',
      `Your job "${jobData.name}" has not been updated in 3 days.`,
    );
  }
};

export const addReminderJob = async (jobId: string, delayMs: number) => {
  await getReminderQueue().add(
    { jobId },
    {
      delay: delayMs,
      removeOnComplete: true,
      removeOnFail: true,
    }
  );
};

export const rescheduleReminderJob = async (jobId: string, delayMs: number) => {
  const queue = getReminderQueue();
  const jobs = await queue.getDelayed();
  const existingJob = jobs.find(job => job.name === `reminder-${jobId}`);

  if (existingJob) {
    await existingJob.remove();
  }

  await addReminderJob(jobId, delayMs);
};

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
