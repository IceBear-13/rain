import { Router, Request, Response } from "express";
import chatRouter from './chatRoutes'
import authRouter from "./authRoute";

export const router = Router();

router.use('/api/chats', chatRouter);
router.use('/api/auth', authRouter);
