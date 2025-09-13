import mongoose from 'mongoose';

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
}, {
  timestamps: true,
});

const Tag = mongoose.model('Tag', tagSchema);
export default Tag;