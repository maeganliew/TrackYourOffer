import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const tagSchema = new mongoose.Schema({
  uuid: {
    type: String,
    default: uuidv4,
    unique: true,
    immutable: true,
  },
  userId: {             // tie the tag to a user
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {                // free string, user-defined
    type: String,
    required: true,
    trim: true,
  },
}, {
  timestamps: true,
});

const Tag = mongoose.model('Tag', tagSchema);
export default Tag;