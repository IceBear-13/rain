import { chat } from "./chatModel";

export interface User {
  id: string;
  username: string;
  created_at: string;
  email: string;
  chats: chat[];
}
