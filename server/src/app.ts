import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import * as messageService from './services/messageService';
import { router } from './routes';

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/', router);

// Socket.io connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Send existing messages to newly connected user
  socket.emit('messages', messageService.getAllMessages());
  
  // Listen for new messages
  socket.on('sendMessage', ({ sender, content }) => {
    const newMessage = messageService.createMessage(sender, content);
    
    // Broadcast the message to all connected clients
    io.emit('newMessage', newMessage);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});