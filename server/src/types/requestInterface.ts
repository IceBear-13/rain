import { Request } from 'express';
import { Server } from 'http';

// Define the user object structure
export interface UserPayload {
  id: string;
  email?: string;
  username?: string;
}

// Base authenticated request interface
export interface AuthRequest extends Request {
  user?: UserPayload;
}

// Chat request interface (extends AuthRequest)
export interface ChatRequest extends AuthRequest {
  params: {
    id: string;
    [key: string]: string;
  };
}
