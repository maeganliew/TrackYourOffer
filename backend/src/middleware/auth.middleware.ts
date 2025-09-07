import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  //frontend will send token to backend for protected routes
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1]; // "Bearer <token>"
  if (!token) {
    //Postman will see the error here
    return res.status(401).json({ message: "Token missing" });
  }
  try {
    // jwt.verify returns the payload signed when creating the user (data stored in token, in auth.controller)
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;  // attach user info for later handlers
    next();              // pass control to next middleware/controller
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};