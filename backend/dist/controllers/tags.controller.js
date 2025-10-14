"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editUserTag = exports.getUserTag = exports.deleteUserTag = exports.addUserTag = void 0;
const Tag_1 = __importDefault(require("../models/Tag"));
const addUserTag = async (req, res, next) => {
    try {
        const name = req.body.name?.trim();
        const colour = req.body.colour?.trim();
        if (!name || !colour) {
            return res.status(400).json({ message: 'Tag name and colour are required' });
        }
        const existingTag = await Tag_1.default.findOne({ name, userId: req.user?.id });
        if (existingTag) {
            return res.status(400).json({ message: 'Duplicate tags are not allowed' });
        }
        const tag = await Tag_1.default.create({ userId: req.user?.id, name, colour });
        res.status(201).json({ message: 'Tag created successfully', tag });
    }
    catch (err) {
        next(err);
    }
};
exports.addUserTag = addUserTag;
const deleteUserTag = async (req, res, next) => {
    try {
        const { tagId } = req.params;
        if (!tagId) {
            return res.status(400).json({ message: 'Tag Id is required' });
        }
        const existingTag = await Tag_1.default.findOne({ _id: tagId, userId: req.user?.id });
        if (!existingTag) {
            return res.status(404).json({ message: 'Tag does not exist' });
        }
        await Tag_1.default.deleteOne({ _id: existingTag._id });
        res.status(200).json({ message: 'Tag deleted successfully', tag: existingTag });
    }
    catch (err) {
        next(err);
    }
};
exports.deleteUserTag = deleteUserTag;
const getUserTag = async (req, res, next) => {
    try {
        const existingTags = await Tag_1.default.find({ userId: req.user?.id });
        res.status(200).json({ message: 'Tags returned successfully', tags: existingTags });
    }
    catch (err) {
        next(err);
    }
};
exports.getUserTag = getUserTag;
const editUserTag = async (req, res) => {
    try {
        const tagId = req.params.tagId;
        const { name, colour } = req.body;
        // Find the tag
        const tag = await Tag_1.default.findOne({ _id: tagId, userId: req.user?.id });
        if (!tag)
            return res.status(404).json({ message: 'Tag not found' });
        // Update fields
        tag.name = name ?? tag.name;
        tag.colour = colour ?? tag.colour;
        await tag.save();
        res.status(200).json(tag); // return updated tag
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to update tag' });
    }
};
exports.editUserTag = editUserTag;
//# sourceMappingURL=tags.controller.js.map