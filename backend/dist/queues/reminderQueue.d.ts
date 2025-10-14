import { Queue as BullQueue } from 'bull';
/**
 * Lazily initializes the reminder queue.
 * Ensures queue is only created when actually needed.
 */
export declare const getReminderQueue: () => BullQueue;
export declare const handleReminderJob: (job: {
    data: {
        jobId: string;
    };
}) => Promise<void>;
export declare const addReminderJob: (jobId: string, delayMs: number) => Promise<void>;
export declare const rescheduleReminderJob: (jobId: string, delayMs: number) => Promise<void>;
//# sourceMappingURL=reminderQueue.d.ts.map