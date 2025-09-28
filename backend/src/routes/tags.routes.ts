import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { addUserTag, deleteUserTag, editUserTag, getUserTag} from '../controllers/tags.controller';

const router = express.Router();

// User - Add tag 
router.post('/', authMiddleware, addUserTag);

// User - Delete tag
router.delete('/:tagId', authMiddleware, deleteUserTag);

// User - Get tag
router.get('/', authMiddleware, getUserTag);

// User - Edit tag
router.patch('/:tagId', authMiddleware, editUserTag);


export default router;
