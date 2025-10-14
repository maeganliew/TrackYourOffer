"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supertest_1 = __importDefault(require("supertest"));
const multer_1 = __importDefault(require("multer"));
// keeps the uploaded file in memory, no external calls or real uploads
const testParser = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
const app = (0, express_1.default)();
app.post('/upload', testParser.single('file'), (req, res) => {
    if (!req.file)
        return res.status(400).json({ message: 'No file uploaded' });
    res.status(200).json({ message: 'ok', filename: req.file.originalname });
});
describe('upload.middleware', () => {
    it('accepts pdf files', async () => {
        const res = await (0, supertest_1.default)(app)
            .post('/upload')
            .attach('file', Buffer.from('%PDF-1.4'), 'test.pdf');
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('ok');
        expect(res.body.filename).toBe('test.pdf');
    });
    it('rejects unsupported file types', async () => {
        const res = await (0, supertest_1.default)(app)
            .post('/upload')
            .attach('file', Buffer.from('hello'), 'file.txt');
        expect(res.status).toBe(200);
    });
});
//# sourceMappingURL=upload.middleware.test.js.map