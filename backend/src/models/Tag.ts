import mongoose from 'mongoose';
import { tagColours } from '../Constants';

const tagSchema = new mongoose.Schema({
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
  colour: {
    type: String,
    required: true,
    enum: tagColours,
    default: 'grey',
  }
}, {
  timestamps: true,
});

const Tag = mongoose.model('Tag', tagSchema);
export default Tag;