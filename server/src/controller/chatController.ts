import { AuthRequest, ChatRequest } from "../types/requestInterface";
import { Response, NextFunction } from "express";
import dotenv from "dotenv";
import { loadChat, loadChatMessages, loadChats } from "../services/chatService";
import { chat } from "../models/chatModel";
import { messages } from "../models/messagesModel";


dotenv.config();


export const loadChatDetails = async (req: ChatRequest, res: Response, next: NextFunction) => {
  const chatId = req.params.id;
  const userId = req.user?.id;

  if(!chatId){
    res.status(400).json({ error: "Chat ID is required" });
  }
  
  if (!userId) {
    res.status(401).json({ error: "User ID is required" });
  }

  if (!chatId || !userId) {
    return res.status(400).json({ error: "Chat ID and User ID are required" });
  } 

  try {
    const chat = await loadChat(chatId, userId);

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    res.status(200).json({chat});

    next();
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}



export const loadMessages = async (req: ChatRequest, res: Response, next: NextFunction) => {
  const chatId = req.params.id;
  const userId = req.user?.id;

  if(!chatId){
    res.status(400).json({ error: "Chat ID is required" });
    return;
  }

  if (!userId) {
    res.status(401).json({ error: "User ID is required" });
    return;
  }

  try{

    const messages = await loadChatMessages(chatId, userId);

    res.status(200).json({ messages });

    next();
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

export const loadChatList = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ error: "User ID is required" });
    return;
  }

  try {
    const chatList = await loadChats(userId);

    if (!chatList) {
      return res.status(404).json({ error: "No chats found" });
    }

    if (req.user) {
      req.user.chats = chatList;
    }
    res.status(200).json({ chatList });

    next();
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}
