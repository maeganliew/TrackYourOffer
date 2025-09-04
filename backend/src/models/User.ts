import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const userSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      unique: true,
      immutable: true,
      default: uuidv4, // auto-generate if needed
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // hide when querying unless explicitly selected
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// Compile the model
const User = mongoose.model('User', userSchema);

export default User;