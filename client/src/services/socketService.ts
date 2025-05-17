import io, { Socket } from 'socket.io-client';
import {
  SocketService,
  JoinChatPayload,
  LeaveChatPayload,
  SendMessagePayload,
  TypingPayload,
  JoinChatResponse,
  NewMessageEvent,
  UserTypingEvent,
  MessageFailedEvent,
  Message
} from '../types/socket.types';

class SocketServiceImpl implements SocketService {
  private socket: typeof Socket | null = null;
  private readonly url: string;
  
  constructor(url: string) {
    this.url = url;
  }
  
  connect(token: string): void {
    if (this.socket) {
      this.socket.disconnect();
    }
    
    this.socket = io(this.url, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      auth: { token }
    });
    
    this.socket.connect();
  }
  
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
  
  isConnected(): boolean {
    return !!this.socket?.connected;
  }
  
  joinChat(chatId: string): Promise<Message[]> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Socket not connected'));
        return;
      }
      
      const payload: JoinChatPayload = { chatId };
      
      this.socket.emit('joinChat', payload, (response: JoinChatResponse) => {
        if (response.success) {
          resolve(response.messages || []);
        } else {
          reject(new Error(response.error || 'Failed to join chat'));
        }
      });
    });
  }
  
  leaveChat(chatId: string): void {
    if (!this.socket) return;
    
    const payload: LeaveChatPayload = { chatId };
    this.socket.emit('leaveChat', payload);
  }
  
  sendMessage(payload: SendMessagePayload): string {
    if (!this.socket) {
      throw new Error('Socket not connected');
    }
    
    // Generate temp ID if not provided
    const tempId = payload.tempId || `temp-${Date.now()}`;
    
    this.socket.emit('sendMessage', {
      ...payload,
      tempId
    });
    
    return tempId;
  }
  
  setTyping(chatId: string, isTyping: boolean): void {
    if (!this.socket) return;
    
    const payload: TypingPayload = { chatId, isTyping };
    this.socket.emit('typing', payload);
  }
  
  onNewMessage(callback: (event: NewMessageEvent) => void): void {
    if (!this.socket) return;
    this.socket.on('newMessage', callback);
  }
  
  onUserTyping(callback: (event: UserTypingEvent) => void): void {
    if (!this.socket) return;
    this.socket.on('userTyping', callback);
  }
  
  onMessageFailed(callback: (event: MessageFailedEvent) => void): void {
    if (!this.socket) return;
    this.socket.on('messageFailed', callback);
  }
  
  onConnect(callback: () => void): void {
    if (!this.socket) return;
    this.socket.on('connect', callback);
  }
  
  onDisconnect(callback: (reason: string) => void): void {
    if (!this.socket) return;
    this.socket.on('disconnect', callback);
  }
}

// Create and export a singleton instance
const socketService: SocketService = new SocketServiceImpl(
  'http://localhost:3001'
);

export default socketService;