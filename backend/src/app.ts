// src/app.ts
import express from 'express';
import authRoutes from './routes/auth.routes'
import { rateLimiter } from './middleware/rateLimiter'
import dotenv from "dotenv";
dotenv.config(); // so that can get env variables by process.env.XXX

const app = express();



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


// 404 handler, only runs if no routes matched
app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});

// Centralized error handler, only runs if `next(err)` was called
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

export default app;