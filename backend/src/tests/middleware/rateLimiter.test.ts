import express from "express";
import request from "supertest";
import { rateLimiter } from "../../middleware/rateLimiter";

describe("rateLimiter middleware", () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();
    //mount rateLimiter middleware on a fake route /test
    app.get("/test", rateLimiter, (req, res) => {
      res.status(200).send("OK");
    });
  });

  it("allows requests under the limit", async () => {
    for (let i = 0; i < 100; i++) {
      const res = await request(app).get("/test");
      expect(res.status).toBe(200);
      expect(res.text).toBe("OK");
    }
  });

  it("blocks requests exceeding the limit", async () => {
    for (let i = 0; i < 100; i++) {
      await request(app).get("/test");
    }

    const res = await request(app).get("/test");
    expect(res.status).toBe(429);
    expect(res.text).toBe("Too many requests, please try again later.");
  });
});
