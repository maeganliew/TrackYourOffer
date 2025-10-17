/**
 * @swagger
 * components:
 *   schemas:
 *     Job:
 *       type: object
 *       required:
 *         - userId
 *         - name
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID for the job
 *         userId:
 *           type: string
 *           description: ID of the user who owns this job
 *         name:
 *           type: string
 *           description: Job name or company name
 *         status:
 *           type: string
 *           enum: ["wishlist", "applied", "interviewing", "offer", "rejected"]
 *           default: "wishlist"
 *         appliedAt:
 *           type: string
 *           format: date-time
 *           description: When the job was applied to
 *         file:
 *           type: object
 *           properties:
 *             url:
 *               type: string
 *               description: File URL (e.g., Cloudinary)
 *             type:
 *               type: string
 *               description: File type (image/pdf)
 *             filename:
 *               type: string
 *               description: Original file name
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         _id: 68cff9212424bdd7cebf5399
 *         userId: 68cc2434987ff556119d4b13
 *         name: GO9gle
 *         status: wishlist
 *         appliedAt: 2025-09-21T13:09:53.896Z
 *         file:
 *           url: https://res.cloudinary.com/example/image.jpg
 *           type: image
 *           filename: resume.jpg
 *         createdAt: 2025-09-21T13:09:53.896Z
 *         updatedAt: 2025-09-21T13:09:53.896Z
 */

import mongoose from 'mongoose';
import { allowedJobStatus } from '../Constants';

const jobSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, // references user's uuid (not ObjectId)
  },
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: allowedJobStatus,
    default: "Wishlist",
  },
  appliedAt: {
    type: Date,
  },
  file: {
    url: { type: String },
    type: { type: String }, // e.g. "image", "pdf"
    filename: { type: String },
    // Optional: include public_id for Cloudinary deletion later
    // public_id: { type: String },
  },
}, 
{
  timestamps: true, // adds createdAt and updatedAt
});

const Job = mongoose.model('Job', jobSchema);
export default Job;
