import { Request } from "express";
import { chat } from "../models/chatModel";

export interface AuthRequest extends Request{
  user?: {
    id: string,
    email: string,
    username: string,
    chats: chat[]
  };
};

export interface ChatRequest extends Request{
  user?: {
    id: string,
    email: string,
    username: string,
    chats: chat[],
  },
  chat?: {
    id: string,
    name: string,
    participants_id: string[],
    created_at: Date,
  };
}
