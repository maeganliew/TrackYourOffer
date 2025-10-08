// prevents real Redis connection. All methods (add, process, getDelayed, close) are faked
import reminderQueue, { addReminderJob, rescheduleReminderJob } from '../../queues/reminderQueue';

jest.mock('bull', () => {
  return jest.fn().mockImplementation(() => ({
    add: jest.fn(),
    process: jest.fn(),
    getDelayed: jest.fn().mockResolvedValue([]),
    close: jest.fn().mockResolvedValue(undefined),
  }));
});

jest.mock('../../utils/email', () => ({
  sendEmail: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../../models/Job');
jest.mock('../../models/User');

describe('Reminder Queue', () => {
  afterAll(async () => {
    await reminderQueue.close(); // closes the mocked queue
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should add a reminder job', async () => {
    const jobId = 'job123';
    const delay = 1000;
    await addReminderJob(jobId, delay);

    expect(reminderQueue.add).toHaveBeenCalledWith(
      { jobId },
      { delay, removeOnComplete: true, removeOnFail: true }
    );
  });

  it('should reschedule a reminder job when no existing delayed job', async () => {
    const jobId = 'job123';
    const delay = 2000;

    (reminderQueue.getDelayed as jest.Mock).mockResolvedValue([]);
    await rescheduleReminderJob(jobId, delay);

    expect(reminderQueue.add).toHaveBeenCalledWith(
      { jobId },
      { delay, removeOnComplete: true, removeOnFail: true }
    );
  });
});
