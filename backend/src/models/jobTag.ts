/**
 * @swagger
 * components:
 *   schemas:
 *     JobTag:
 *       type: object
 *       required:
 *         - jobId
 *         - tagId
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID for the JobTag
 *         jobId:
 *           type: string
 *           description: ID of the job
 *         tagId:
 *           type: string
 *           description: ID of the tag linked to the job
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the JobTag was created
 *       example:
 *         _id: 68d00123abcd4567ef890123
 *         jobId: 68cff9212424bdd7cebf5399
 *         tagId: 68cffe3d38d860e879e22334
 *         createdAt: 2025-09-21T13:31:41.545Z
 */

import mongoose from 'mongoose';
import { Schema, model } from 'mongoose';

const jobTagSchema = new Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  tagId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  versionKey: false
});

// Creates compound unique index, indexes by jobId ascending, then tagId ascendint.
// No two documents can have the same combination of jobId and tagId
// jobTagSchema.index({ jobId: 1, tagId: 1 }, { unique: true });

const JobTag = model('JobTag', jobTagSchema);
export default JobTag;