"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supertest_1 = __importDefault(require("supertest"));
const rateLimiter_1 = require("../../middleware/rateLimiter");
describe("rateLimiter middleware", () => {
    let app;
    beforeEach(() => {
        app = (0, express_1.default)();
        //mount rateLimiter middleware on a fake route /test
        app.get("/test", rateLimiter_1.rateLimiter, (req, res) => {
            res.status(200).send("OK");
        });
    });
    it("allows requests under the limit", async () => {
        for (let i = 0; i < 100; i++) {
            const res = await (0, supertest_1.default)(app).get("/test");
            expect(res.status).toBe(200);
            expect(res.text).toBe("OK");
        }
    });
    it("blocks requests exceeding the limit", async () => {
        for (let i = 0; i < 100; i++) {
            await (0, supertest_1.default)(app).get("/test");
        }
        const res = await (0, supertest_1.default)(app).get("/test");
        expect(res.status).toBe(429);
        expect(res.text).toBe("Too many requests, please try again later.");
    });
});
//# sourceMappingURL=rateLimiter.test.js.map