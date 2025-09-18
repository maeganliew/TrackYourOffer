import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import User from '../models/User'

const jwt = require("jsonwebtoken");

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {username, password} = req.body;

        // User schema has 'select false' for passwords
        const existingUser =  await User.findOne({username: username}).select("+password");;
        if (!existingUser) {
        return res.status(401).json({ message: "Invalid login credentials" });
        }

        //check hash here, verify pass
        const passMatch = await bcrypt.compare(password, existingUser.password);
        if (!passMatch) {
        return res.status(401).json({ message: "Invalid login credentials" });
        }

        const token = jwt.sign({id: existingUser._id.toString(),username: existingUser.username }, process.env.JWT_SECRET!, {expiresIn: "2h"});
        res.json({token});
    } catch (err) {
        next(err);
    }
}

export const register = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;

    const existingUser =  await User.findOne({username: username});
    if (existingUser) {
        const error = new Error("User already exists.");
        return next(error);
    }

    // Hash passwowrd
    const saltRounds = 10; // cost factor - how many times the hashing algo is applied. if higher means more computationally expensive
    const hashedPass = await bcrypt.hash(password, saltRounds);

    const user = await User.create({ username, password: hashedPass });
    res.status(201).json({ message: "User created", uid: user._id });
};