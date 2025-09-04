import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export enum JobStatus {
  Wishlist = 'wishlist',
  Applied = 'applied',
  Interviewing = 'interviewing',
  Offer = 'offer',
  Rejected = 'rejected',
}

const jobSchema = new mongoose.Schema({
  uuid: {
    type: String,
    default: uuidv4,
    unique: true,
    immutable: true,
  },
  // 'enforcing' foreign keys
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, // references user's uuid (not ObjectId)
  },
  jobName: {
    type: String,
    required: true,
  },
  jobStatus: {
    type: String,
    enum: Object.values(JobStatus),
    default: JobStatus.Wishlist,
  },
  appliedAt: {
    type: Date,
  },
}, 
{
  timestamps: true, // adds createdAt and updatedAt
});

const Job = mongoose.model('Job', jobSchema);
export default Job;
