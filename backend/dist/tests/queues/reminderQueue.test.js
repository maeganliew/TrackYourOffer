"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const reminderQueue_1 = require("../../queues/reminderQueue");
describe('Reminder Queue', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    afterAll(async () => {
        await (0, reminderQueue_1.getReminderQueue)().close(); // access the mocked queue here
    });
    it('should add a reminder job', async () => {
        const jobId = 'job123';
        const delay = 1000;
        await (0, reminderQueue_1.addReminderJob)(jobId, delay);
        expect((0, reminderQueue_1.getReminderQueue)().add).toHaveBeenCalledWith({ jobId }, { delay, removeOnComplete: true, removeOnFail: true });
    });
    it('should reschedule a reminder job when no existing delayed job', async () => {
        const jobId = 'job123';
        const delay = 2000;
        (0, reminderQueue_1.getReminderQueue)().getDelayed.mockResolvedValue([]);
        await (0, reminderQueue_1.rescheduleReminderJob)(jobId, delay);
        expect((0, reminderQueue_1.getReminderQueue)().add).toHaveBeenCalledWith({ jobId }, { delay, removeOnComplete: true, removeOnFail: true });
    });
});
//# sourceMappingURL=reminderQueue.test.js.map