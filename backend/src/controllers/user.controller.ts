import { Response, NextFunction } from "express";
import User from '../models/User'
import bcrypt from "bcrypt";
import { AuthenticatedRequest } from "../types/auth-request";


export const changeUsername =  async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { newUsername } = req.body;

    if (!newUsername) {
      return res.status(400).json({ message: 'New username is required' });
    }

    //Find the user (you have `req.user` from authMiddleware)
    const user = await User.findById(req?.user?.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    //Checks for duplicate username
    const existingUsername = await User.findOne({username: newUsername});
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    user.username = newUsername;
    await user.save();

    res.status(200).json({ message: 'Username updated', user: { id: user._id, username: user.username}});
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};


export const changePassword =  async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword) {
      return res.status(400).json({ message: 'New password is required' }); 
    }

    const user = await User.findById(req?.user?.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const saltRounds = 10;
    const hashedPass = await bcrypt.hash(newPassword, saltRounds);
    user.password = hashedPass;
    await user.save();
    res.status(200).json({ message: 'Password updated', user: { id: user._id, username: user.username}});
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
}

export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
    res.json({ user: req?.user }); //req.user is from authMiddleware
}
