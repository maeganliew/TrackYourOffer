/**
 * @swagger
 * components:
 *   schemas:
 *     Tag:
 *       type: object
 *       required:
 *         - userId
 *         - name
 *         - colour
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID for the tag
 *         userId:
 *           type: string
 *           description: ID of the user who owns this tag
 *         name:
 *           type: string
 *           description: Tag name
 *         colour:
 *           type: string
 *           description: Hex or predefined colour for the tag
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         _id: 68cffe3d38d860e879e22334
 *         userId: 68cc2434987ff556119d4b13
 *         name: "waiting for interview"
 *         colour: "#6B7280"
 *         createdAt: "2025-09-21T13:31:41.545Z"
 *         updatedAt: "2025-09-21T13:31:41.545Z"
 */

import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema({
  userId: { // tie the tag to a user
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: { // free string, user-defined
    type: String,
    required: true,
    trim: true,
  },
  colour: {
    type: String,
    required: true,
    default: '#6B7280',
  }
}, {
  timestamps: true,
});

const Tag = mongoose.model('Tag', tagSchema);
export default Tag;