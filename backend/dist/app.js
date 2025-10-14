"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts
const express_1 = __importDefault(require("express"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const tags_routes_1 = __importDefault(require("./routes/tags.routes"));
const jobs_routes_1 = __importDefault(require("./routes/jobs.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
const rateLimiter_1 = require("./middleware/rateLimiter");
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
//import reminderQueue from './queues/reminderQueue'; // importing just to execute the file
dotenv_1.default.config(); // so that can get env variables by process.env.XXX
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    credentials: true,
}));
// -------------------
// Middleware
// -------------------
app.use(rateLimiter_1.rateLimiter);
//Built in middleware function dont need next(), the functions you write yourself needs next()
// It reads JSON sent by the client and makes it available as a JavaScript object in req.body
app.use(express_1.default.json());
// HTML form data to JS object
app.use(express_1.default.urlencoded({ extended: true }));
// Logs every incoming request to the console.
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
// -------------------
// Routes
// -------------------
app.use('/auth', auth_routes_1.default);
app.use('/user', user_routes_1.default);
app.use('/tags', tags_routes_1.default);
app.use('/jobs', jobs_routes_1.default);
app.use('/dashboard', dashboard_routes_1.default);
// 404 handler, only runs if no routes matched
app.use((req, res, next) => {
    res.status(404).json({ message: 'Not Found' });
});
// Centralized error handler, only runs if `next(err)` was called
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message || "Something went wrong!" });
});
exports.default = app;
//# sourceMappingURL=app.js.map