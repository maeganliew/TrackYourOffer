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
}, 
{
  timestamps: true, // adds createdAt and updatedAt
});

const Job = mongoose.model('Job', jobSchema);
export default Job;
