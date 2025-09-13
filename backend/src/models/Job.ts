import mongoose from 'mongoose';

export enum JobStatus {
  Wishlist = 'wishlist',
  Applied = 'applied',
  Interviewing = 'interviewing',
  Offer = 'offer',
  Rejected = 'rejected',
}

const jobSchema = new mongoose.Schema({
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
