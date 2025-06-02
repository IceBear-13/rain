import express from 'express';
import * as chatController from '../controller/chatController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', authMiddleware, chatController.loadChatList);
router.get('/:id', authMiddleware, chatController.loadMessages);
router.post('/create', authMiddleware, chatController.createChatController);

export default router;
