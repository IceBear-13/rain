
import Message, { IMessage } from '../models/messages';
import mongoose from 'mongoose';

export const getAllMessages = async (): Promise<IMessage[]> => {
  return await Message.find().sort({ createdAt: 1 }).populate('sender', 'username');
};

export const createMessage = async (
  senderId: string | mongoose.Types.ObjectId, 
  content: string
): Promise<IMessage> => {
  const message = new Message({
    sender: senderId,
    content
  });
  
  return await message.save();
};

export const getMessageById = async (messageId: string): Promise<IMessage | null> => {
  return await Message.findById(messageId).populate('sender', 'username');
};
