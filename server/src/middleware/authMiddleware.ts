import dotenv from "dotenv";
import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/requestInterface";
import jwt from "jsonwebtoken";

dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if(!token){
    res.status(401).json({
      success: false,
      message: 'Auth header is invalid'
    })
    return;
  }

  try{
    const decoded = await jwt.verify(token, JWT_SECRET_KEY);
    req.user = decoded as {id: string, username: string};
    next();

  } catch(error){
    res.status(500).json({
      success: false,
      message: error
    });
    return;
  }
}
