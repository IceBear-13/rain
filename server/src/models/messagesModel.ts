import { User } from "./userModel";

export interface messages {
  m_id: string;
  sender: User;
  chat_id: string;
  content: string;
  created_at: string;
}
