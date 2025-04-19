import express from 'express';
import * as messageController from '../controller/messageController';

const router = express.Router();

router.get('/', messageController.getAllMessages);
router.post('/', messageController.createMessage);
router.get('/:id', messageController.getMessageById);

export default router;
