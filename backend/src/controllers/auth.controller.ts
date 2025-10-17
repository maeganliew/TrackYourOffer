import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import User from '../models/User'

const jwt = require("jsonwebtoken");

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {email, password} = req.body;

        // User schema has 'select false' for passwords
        const existingUser =  await User.findOne({email: email}).select("+password");;
        if (!existingUser) {
          return res.status(401).json({ message: "Invalid login credentials" });
        }

        //check hash here, verify pass
        const passMatch = await bcrypt.compare(password, existingUser.password);
        if (!passMatch) {
          return res.status(401).json({ message: "Invalid login credentials" });
        }

        // conversion from _id to id here
        const token = jwt.sign({id: existingUser._id.toString(),email: existingUser.email }, process.env.JWT_SECRET!, {expiresIn: "2h"});
        const { _id, email: userEmail } = existingUser;
        return res.json({
        token,
        user: { id: _id, email: userEmail }, // match your User type
        });
    } catch (err) {
        next(err);
    }
}

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const saltRounds = 10;
    const hashedPass = await bcrypt.hash(password, saltRounds);

    const user = await User.create({ email, password: hashedPass });

    const token = jwt.sign(
      { id: user._id.toString(), email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "2h" }
    );

    return res.status(201).json({
      message: "User created",
      id: user._id,
      token,
      email: user.email,
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
