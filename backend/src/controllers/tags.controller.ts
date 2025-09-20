import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/auth-request";
import Tag from '../models/Tag';


export const addUserTag = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const {name, colour} = req.body;
        if (!name || !colour) {
            return res.status(400).json({ message: 'Tag name and colour are required' });
        }

        const existingTag = await Tag.findOne({name, userId: req.user?.id});
        if (existingTag) {
            return res.status(400).json({ message: 'Duplicate tags are not allowed'});
        }

        const tag = await Tag.create({ userId: req.user?.id, name, colour});
        res.status(201).json({ message: 'Tag created successfully', tag });
    } catch (err) {
        next(err);
    }
}

export const deleteUserTag = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const {tagId} = req.params;
        if (!tagId) {
            return res.status(400).json({ message: 'Tag Id is required' });
        }

        const existingTag = await Tag.findOne({_id: tagId, userId: req.user?.id});
        if (!existingTag) {
            return res.status(404).json({ message: 'Tag does not exist'});
        }

        await Tag.deleteOne({ _id: existingTag._id });
        res.status(200).json({ message: 'Tag deleted successfully', tag: existingTag });
    } catch (err) {
        next(err);
    }
}

export const getUserTag = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const existingTags = await Tag.find({ userId: req.user?.id });
        res.status(200).json({ message: 'Tags returned successfully', tags: existingTags});
    } catch (err) {
        next(err);
    }
}
