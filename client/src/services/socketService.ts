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
      transports: ['websocket']
    });
    
    return new Promise<void>((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Failed to create socket'));
        return;
      }

      this.socket.on('connect', () => {
        console.log('Socket connected successfully');
        resolve();
      });

      this.socket.on('connect_error', (error: Error) => {
        console.error('Socket connection error:', error);
        reject(error);
      });

      this.socket.connect();
    });
}

  authenticate(token: string): void {
    if (!this.socket) {
        throw new Error('Socket not connected');
    }
    
    this.socket.emit('authenticate', { token }, (response: { success: boolean, error?: string }) => {
        if (!response.success) {
            console.error('Authentication failed:', response.error || 'Unknown error');
        } else {
            console.log('Socket authenticated successfully');
        }
    });
  }
  
  disconnect(): void {
    if (this.socket) {
      this.cleanupListeners();
      this.socket.disconnect();
      this.socket = null;
    }
  }
  
  isConnected(): boolean {
    console.log('Socket connected:', this.socket?.connected);
    return this.socket?.connected || false;
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
  
  private newMessageHandlers: Set<(event: NewMessageEvent) => void> = new Set();

  onNewMessage(callback: (event: NewMessageEvent) => void): void {
      if (!this.socket) return;
      this.newMessageHandlers.add(callback);
      this.socket.on('newMessage', callback);
      console.log('Listening for new messages');
  }

  offNewMessage(callback: (event: NewMessageEvent) => void): void {
      if (!this.socket) return;
      this.newMessageHandlers.delete(callback);
      this.socket.off('newMessage', callback);
  }

  // Add this method to clean up all listeners when disconnecting
  private cleanupListeners(): void {
      if (!this.socket) return;
      this.newMessageHandlers.forEach(handler => {
          this.socket!.off('newMessage', handler);
      });
      this.newMessageHandlers.clear();
  }
  
  onUserTyping(callback: (event: UserTypingEvent) => void): void {
    if (!this.socket) return;
    this.socket.on('userTyping', callback);
  }
  
  onMessageFailed(callback: (event: MessageFailedEvent) => void): void {
    if (!this.socket) return;
    this.socket.on('messageFailed', callback);
  }

  onJoinChat(callback: (event: JoinChatResponse) => void): void {
    if (!this.socket) return;
    this.socket.on('joinChat', callback);
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

const socketService: SocketService = new SocketServiceImpl(
  'http://localhost:3000'
);

export default socketService;