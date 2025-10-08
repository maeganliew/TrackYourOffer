// queues/reminderQueue.ts
import Queue from 'bull';
import { sendEmail } from '../utils/email';
import Job from '../models/Job';
import User from '../models/User';

const reminderQueue = new Queue('reminders', {
  redis: { host: '127.0.0.1', port: 6379 },
});

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

// Whenever a job is added to this queue, call handleReminderJob to process it.
reminderQueue.process(handleReminderJob);

export const addReminderJob = async (jobId: string, delayMs: number) => {
  await reminderQueue.add(
    { jobId },
    {
      delay: delayMs,
      removeOnComplete: true,
      removeOnFail: true,
    }
  );
};

export const rescheduleReminderJob = async (jobId: string, delayMs: number) => {
  const jobs = await reminderQueue.getDelayed();
  const existingJob = jobs.find(job => job.name === `reminder-${jobId}`);

  if (existingJob) {
    await existingJob.remove();
  }

  await addReminderJob(jobId, delayMs);
};

export default reminderQueue;
