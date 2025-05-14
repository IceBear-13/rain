// import { Request, Response } from 'express';
// import * as messageService from '../services/messageService';
// import { AuthRequest } from '../types/requestInterface';

// export const getAllMessages = async (req: AuthRequest, res: Response): Promise<void> => {
//   try {
//     const messages = await messageService.getAllMessages();
//     res.json(messages);
//   } catch (error) {
//     res.status(500).json({ error: error });
//   }
// };

// export const createMessage = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { senderId, content } = req.body;
    
//     if (!senderId || !content) {
//       res.status(400).json({ error: 'Sender ID and content are required' });
//       return;
//     }
    
//     const newMessage = await messageService.createMessage(senderId, content);
//     res.status(201).json(newMessage);
//   } catch (error) {
//     res.status(500).json({ error: error });
//   }
// };

// export const getMessageById = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const message = await messageService.getMessageById(req.params.id);
    
//     if (!message) {
//       res.status(404).json({ error: 'Message not found' });
//       return;
//     }
    
//     res.json(message);
//   } catch (error) {
//     res.status(500).json({ error: error });
//   }
// };
