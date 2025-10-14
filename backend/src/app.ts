// src/app.ts
import express from 'express';
import authRoutes from './routes/auth.routes'
import userRoutes from './routes/user.routes'
import tagRoutes from './routes/tags.routes'
import jobRoutes from './routes/jobs.routes'
import dashboardRoutes from './routes/dashboard.routes'
import { rateLimiter } from './middleware/rateLimiter'
import dotenv from "dotenv";
import cors from 'cors';
//import reminderQueue from './queues/reminderQueue'; // importing just to execute the file

dotenv.config(); // so that can get env variables by process.env.XXX

const app = express();

app.set('trust proxy', 1);

app.use(cors({
  origin: 'https://application-tracker-o993lgab2-jia-weis-projects-d83d18eb.vercel.app',
  credentials: true,
}));

// -------------------
// Middleware
// -------------------
app.use(rateLimiter);

//Built in middleware function dont need next(), the functions you write yourself needs next()
// It reads JSON sent by the client and makes it available as a JavaScript object in req.body
app.use(express.json());

// HTML form data to JS object
app.use(express.urlencoded({ extended: true }));

// Logs every incoming request to the console.
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});




// -------------------
// Routes
// -------------------
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/tags', tagRoutes);
app.use('/jobs', jobRoutes);
app.use('/dashboard', dashboardRoutes);


// 404 handler, only runs if no routes matched
app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});

// Centralized error handler, only runs if `next(err)` was called
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || "Something went wrong!" });
});

export default app;