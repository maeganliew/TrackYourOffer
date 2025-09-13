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

// Optional: prevent duplicate [jobId + tagId] pairs
jobTagSchema.index({ jobId: 1, tagId: 1 }, { unique: true });

export const JobTag = model('JobTag', jobTagSchema);