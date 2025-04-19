import { Request } from "express";
import { IUser } from "../models/user";

export interface AuthRequest extends Request{
  user?: {
    id: string,
    email: string,
    username: string
  };
};
