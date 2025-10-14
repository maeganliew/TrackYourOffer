"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = __importDefault(require("../models/User"));
const jwt = require("jsonwebtoken");
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // User schema has 'select false' for passwords
        const existingUser = await User_1.default.findOne({ email: email }).select("+password");
        ;
        if (!existingUser) {
            return res.status(401).json({ message: "Invalid login credentials" });
        }
        //check hash here, verify pass
        const passMatch = await bcrypt_1.default.compare(password, existingUser.password);
        if (!passMatch) {
            return res.status(401).json({ message: "Invalid login credentials" });
        }
        // conversion from _id to id here
        const token = jwt.sign({ id: existingUser._id.toString(), email: existingUser.email }, process.env.JWT_SECRET, { expiresIn: "2h" });
        const { _id, email: userEmail } = existingUser;
        return res.json({
            token,
            user: { id: _id, email: userEmail }, // match your User type
        });
    }
    catch (err) {
        next(err);
    }
};
exports.login = login;
const register = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists." });
        }
        const saltRounds = 10;
        const hashedPass = await bcrypt_1.default.hash(password, saltRounds);
        const user = await User_1.default.create({ email, password: hashedPass });
        const token = jwt.sign({ id: user._id.toString(), email: user.email }, process.env.JWT_SECRET, { expiresIn: "2h" });
        return res.status(201).json({
            message: "User created",
            uid: user._id,
            token,
            email: user.email,
        });
    }
    catch (err) {
        console.error("Register error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.register = register;
//# sourceMappingURL=auth.controller.js.map