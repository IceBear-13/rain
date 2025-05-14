import express from 'express';
import * as messageController from '../controller/messageController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', messageController.getAllMessages);
router.post('/', messageController.createMessage);
router.get('/:id', authMiddleware ,messageController.getMessageById);

export default router;
