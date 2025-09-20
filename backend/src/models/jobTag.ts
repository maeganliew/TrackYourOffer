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