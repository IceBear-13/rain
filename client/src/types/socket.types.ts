export interface User {
  rain_id: string;
  username: string;
  email: string;
}

// Message related types
export interface Message {
  m_id: string;
  content: string;
  sender: User;
  chat_id: string;
  created_at: string;
  updated_at?: string;
  status?: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
}

export interface Attachment {
  id: string;
  type: 'image' | 'file' | 'audio' | 'video';
  url: string;
  name: string;
  size: number;
  mime_type: string;
}

// Chat related types
export interface Chat {
  c_id: string;
  name: string;
  participant_one: string;
  participant_two: string;
  created_at: string;
  last_message?: string;
}

// Socket Event Payloads
export interface JoinChatPayload {
  chatId: string;
  userId: string;
}

export interface LeaveChatPayload {
  chatId: string;
}

export interface SendMessagePayload {
  chatId: string;
  content: string;
  userId: string;
}

export interface TypingPayload {
  chatId: string;
  isTyping: boolean;
}

export interface UserStatusPayload {
  status: 'active' | 'inactive' | 'away';
  timestamp: number;
}

// Socket Response Types
export interface JoinChatResponse {
  success: boolean;
  messages?: Message[];
  error?: string;
}

export interface NewMessageEvent {
  chatId: string;
  message: Message;
  originalTempId?: string;
}

export interface UserTypingEvent {
  chatId: string;
  userId: string;
  isTyping: boolean;
}

export interface MessageFailedEvent {
  tempId: string;
  error: string;
}

// Socket Class Interface for type-safety
export interface SocketService {
  connect: () => void;
  authenticate: (token: string) => void;
  disconnect: () => void;
  isConnected: () => boolean;
  joinChat: (chatId: string) => Promise<Message[]>;
  leaveChat: (chatId: string) => void;
  sendMessage: (payload: SendMessagePayload) => string;
  setTyping: (chatId: string, isTyping: boolean) => void;
  onNewMessage: (callback: (event: NewMessageEvent) => void) => void;
  offNewMessage: (callback: (event: NewMessageEvent) => void) => void;
  onUserTyping: (callback: (event: UserTypingEvent) => void) => void;
  onMessageFailed: (callback: (event: MessageFailedEvent) => void) => void;
  onConnect: (callback: () => void) => void;
  onDisconnect: (callback: (reason: string) => void) => void;
}
