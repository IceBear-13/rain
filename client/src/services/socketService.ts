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
  
  async connect(): Promise<void> {
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
    });
    
    this.socket.connect();
  }

  authenticate(): void {
    if (!this.socket) {
      throw new Error('Socket not connected');
    }
    
    this.socket.emit('authenticate', { token: localStorage.getItem('token') }, (response: { success: boolean, error?: string }) => {
      if (!response.success) {
        console.error('Authentication failed:', response.error || 'Unknown error');
      } else {
        console.log('Socket authenticated successfully');
      }
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
    console.log('Socket connected:', !this.socket?.connected);
    return !this.socket?.connected;
  }
  
  joinChat(chatId: string): Promise<Message[]> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Socket not connected'));
        return;
      }
      
      const payload: JoinChatPayload = { chatId, userId: localStorage.getItem('userId') || '' };
      
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
    
    this.socket.emit('sendMessage', {
      ...payload
    });
    
    console.log('Message sent:', payload);
    return payload.chatId;
    
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
  'http://localhost:3000'
);

export default socketService;