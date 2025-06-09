import express, { NextFunction } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import * as chatService from './services/chatService';
import * as messageService from './services/messageService';
import { router } from './routes';
import { verifyToken } from './services/userService';

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/', router);

// Track active users and their rooms
const userSockets = new Map(); // userId -> socketId
const socketUsers = new Map(); // socketId -> userId

// Socket.io connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Authenticate user and join their chats
  socket.on('authenticate', async ({ token }) => {
    if (!token) return;
    
    // Verify token and get userId
    const user = verifyToken(token);

    if (!user) {
      console.error('Authentication failed for socket:', socket.id);
      socket.emit('unauthorized', { message: 'Invalid token' });
      return;
    }

    const userId = user.id as string;
    console.log(userId);
    // Associate socket with user
    userSockets.set(userId, socket.id);
    socketUsers.set(socket.id, userId);
    
    console.log(`User ${userId} authenticated on socket ${socket.id}`);
    
    try {
      // Load all chats for the user and join those rooms
      const userChats = await chatService.loadChats(userId);
      
      userChats.forEach(chat => {
        socket.join(chat.c_id);
        console.log(`User ${userId} joined chat room ${chat.c_id}`);
      });
    } catch (error) {
      console.error('Error loading user chats for socket rooms:', error);
    }
  });
  
  socket.on('createChat', async (chat_name: string, userId_one: string, userId_two: string) => {
    try{
      const existingChat = await chatService.getChatFromParticipants(userId_one, userId_two);
      if (existingChat) {
        console.log('Chat already exists:', existingChat);
        socket.emit('chatExists', { chatId: existingChat.c_id });
        return;
      }

      // Create a new chat
      console.log('Creating new chat:', chat_name, userId_one, userId_two);
      const chat = await chatService.createChat(chat_name, userId_one, userId_two);

      if (!chat) {
        console.error('Failed to create chat');
        socket.emit('error', { message: 'Failed to create chat' });
        return;
      }

      socket.join(chat.c_id);
      const recipientSocketId = userSockets.get(userId_two);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('newChat', { chatId: chat.c_id, chatName: chat_name });
      }
      console.log(`Chat created successfully: ${chat.c_id}`);

      
    } catch (error) {
      console.error('Error creating chat:', error);
      socket.emit('error', { message: 'Error creating chat' });
    }
  } )

  // Join a specific chat room
  socket.on('joinChat', async ({ chatId, userId }) => {
    try {
      const isParticipant = await chatService.checkIfUserIsParticipant(chatId, userId);
      
      if (isParticipant) {
        socket.join(chatId);
        console.log(`User ${userId} joined chat room ${chatId}`);
      } else {
        socket.emit('error', { message: 'Not authorized to join this chat' });
      }
    } catch (error) {
      console.error('Error joining chat room:', error);
      socket.emit('error', { message: 'Error joining chat room' });
    }
  });

  socket.on('leaveChat', async ({ chatId, userId }) => {
    try {
      const isParticipant = await chatService.checkIfUserIsParticipant(chatId, userId);
      if (isParticipant) {
        socket.leave(chatId);
        console.log(`User ${userId} left chat room ${chatId}`);
      } else {
        socket.emit('error', { message: 'Not authorized to leave this chat' });
      }
    } catch (error) {
      console.error('Error leaving chat room:', error);
      socket.emit('error', { message: 'Error leaving chat room' });
    }
  });
  
  // Listen for new messages
  socket.on('sendMessage', async ({ chatId, userId, content }) => {
    try {
      // First verify user is a participant in this chat
      const isParticipant = await chatService.checkIfUserIsParticipant(chatId, userId);
      
      if (!isParticipant) {
        socket.emit('error', { message: 'Not authorized to send messages to this chat' });
        return;
      }
      
      // Create the message in the database
      const message = await messageService.createMessage(userId, content, chatId);
      console.log('Message created:', message);
      
      // Broadcast the message to all clients in this chat room
      socket.to(chatId).emit('newMessage', {
        message
      });

    console.log('emitted to ' + chatId + ' message: ' + content);
      
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('error', { message: 'Error sending message' });
    }
  });
  
  // User is typing indicator
  socket.on('typing', ({ chatId, userId, isTyping }) => {
    socket.to(chatId).emit('userTyping', { userId, isTyping });
  });
  
  socket.on('disconnect', () => {
    const userId = socketUsers.get(socket.id);
    if (userId) {
      userSockets.delete(userId);
      socketUsers.delete(socket.id);
    }
    console.log('User disconnected:', socket.id);
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
    socket.emit('error', { message: 'An error occurred' });
  });

  socket.on('unauthorized', (error) => {
    console.error('Unauthorized access:', error);
    socket.emit('unauthorized', { message: 'Unauthorized access' });
  });

});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default server;
export { io };
