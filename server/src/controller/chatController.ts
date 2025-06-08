import { AuthRequest, ChatRequest } from "../types/requestInterface";
import { Response } from "express";
import { loadChat, loadChatMessages, loadChats } from "../services/chatService";
import { createChat } from "../services/chatService";
import { io } from "../app";

export const loadChatDetails = async (req: ChatRequest, res: Response): Promise<void> => {
  const chatId = req.params.id;
  const userId = req.user?.id;

  if (!chatId || !userId) {
    res.status(400).json({ error: "Chat ID and User ID are required" });
    return;
  } 

  try {
    const chat = await loadChat(chatId, userId);
    
    if (!chat) {
      res.status(404).json({ error: "Chat not found" });
      return;
    }

    res.status(200).json({ chat });
  } catch (error) {
    console.error("Error loading chat details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const loadMessages = async (req: ChatRequest, res: Response): Promise<void> => {
  const chatId = req.params.id;
  const userId = req.user?.id;

  if (!chatId || !userId) {
    res.status(400).json({ error: "Chat ID and User ID are required" });
    return;
  }

  try {
    console.log("Loading messages for chat:", chatId, "and user:", userId);
    const messages = await loadChatMessages(chatId, userId);
    res.status(200).json({ messages });
  } catch (error) {
    console.error("Error loading messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const loadChatList = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ error: "User ID is required" });
    return;
  }

  try {
    const chatList = await loadChats(userId);

    if (!chatList || chatList.length === 0) {
      res.status(200).json({ chatList: [] });
      return;
    }

    res.status(200).json({ chatList });
  } catch (error) {
    console.error("Error loading chat list:", error);
    res.status(500).json({ error: error });
  }
};

export const createChatController = async (req: AuthRequest, res: Response): Promise<void> => {

  const userId = req.user?.id;

  try {
    const { name, participant_one, participant_two } = req.body;

    const payload = {
      chat_name: name,
      userId_one: participant_one,
      userId_two: participant_two,
    }

    io.emit("createChat", payload);
    


    res.status(201).json({ chat: payload });
  } catch (error) {
    console.error("Error creating chat:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
