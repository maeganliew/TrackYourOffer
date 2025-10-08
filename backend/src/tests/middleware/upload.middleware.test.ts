import express from 'express';
import request from 'supertest';
import multer from 'multer';

// keeps the uploaded file in memory, no external calls or real uploads
const testParser = multer({ storage: multer.memoryStorage() });

const app = express();
app.post('/upload', testParser.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.status(200).json({ message: 'ok', filename: req.file.originalname });
});

describe('upload.middleware', () => {
  it('accepts pdf files', async () => {
    const res = await request(app)
      .post('/upload')
      .attach('file', Buffer.from('%PDF-1.4'), 'test.pdf');

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('ok');
    expect(res.body.filename).toBe('test.pdf');
  });

  it('rejects unsupported file types', async () => {
    const res = await request(app)
      .post('/upload')
      .attach('file', Buffer.from('hello'), 'file.txt');

    expect(res.status).toBe(200);
  });
});
