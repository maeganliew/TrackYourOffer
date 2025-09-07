import { Request, Response, NextFunction } from "express";
import app from "../app"
import bcrypt from "bcrypt";
import User from '../models/User'

const express = require("express");
const jwt = require("jsonwebtoken");

app.use(express.json());


export const login = async (req: Request, res: Response, next: NextFunction) => {
    let {username, password} = req.body;

    const existingUser =  await User.findOne({username: username});
    if (!existingUser) {
        const error = new Error("Please check your login details.");
        return next(error);
    }

    //check hash here, verify pass
    const passMatch = await bcrypt.compare(password, existingUser.password);
    if (!passMatch) {
        const error = new Error("Please check your login details.");
        return next(error);
    }

    const token = jwt.sign({uid: existingUser.id, username: existingUser.username}, process.env.JWT_SECRET!, {expiresIn: "2h"});
    res.json({token});
}

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Hash passwowrd
  const saltRounds = 10; // cost factor - how many times the hashing algo is applied. if higher means more computationally expensive
  const hashedPass = await bcrypt.hash(password, saltRounds);

  const user = await User.create({ email, password: hashedPass });
  res.status(201).json({ message: "User created", uid: user.uid });
};