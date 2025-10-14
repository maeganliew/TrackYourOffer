"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.changePassword = exports.changeEmail = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const changeEmail = async (req, res) => {
    try {
        const { newEmail } = req.body;
        if (!newEmail) {
            return res.status(400).json({ message: 'New username is required' });
        }
        //Find the user (you have `req.user` from authMiddleware)
        const user = await User_1.default.findById(req?.user?.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        //Checks for duplicate username
        const existingUsername = await User_1.default.findOne({ email: newEmail });
        if (existingUsername) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        user.email = newEmail;
        await user.save();
        res.status(200).json({ message: 'Username updated', user: { id: user._id, email: user.email } });
    }
    catch (err) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};
exports.changeEmail = changeEmail;
const changePassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        if (!newPassword) {
            return res.status(400).json({ message: 'New password is required' });
        }
        const user = await User_1.default.findById(req?.user?.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const saltRounds = 10;
        const hashedPass = await bcrypt_1.default.hash(newPassword, saltRounds);
        user.password = hashedPass;
        await user.save();
        res.status(200).json({ message: 'Password updated', user: { id: user._id, email: user.email } });
    }
    catch (err) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};
exports.changePassword = changePassword;
const getProfile = async (req, res) => {
    res.json({ user: req?.user }); //req.user is from authMiddleware
};
exports.getProfile = getProfile;
//# sourceMappingURL=user.controller.js.map