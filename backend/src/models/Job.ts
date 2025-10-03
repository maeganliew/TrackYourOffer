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
