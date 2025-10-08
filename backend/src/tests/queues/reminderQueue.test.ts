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

// prevents real Redis connection. All methods (add, process, getDelayed, close) are faked
// mock first, before importing (modules run immediately when imported)
import { addReminderJob, rescheduleReminderJob, getReminderQueue } from '../../queues/reminderQueue';

describe('Reminder Queue', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await getReminderQueue().close(); // access the mocked queue here
  });

  it('should add a reminder job', async () => {
    const jobId = 'job123';
    const delay = 1000;
    await addReminderJob(jobId, delay);

    expect(getReminderQueue().add).toHaveBeenCalledWith(
      { jobId },
      { delay, removeOnComplete: true, removeOnFail: true }
    );
  });

  it('should reschedule a reminder job when no existing delayed job', async () => {
    const jobId = 'job123';
    const delay = 2000;

    (getReminderQueue().getDelayed as jest.Mock).mockResolvedValue([]);
    await rescheduleReminderJob(jobId, delay);

    expect(getReminderQueue().add).toHaveBeenCalledWith(
      { jobId },
      { delay, removeOnComplete: true, removeOnFail: true }
    );
  });
});