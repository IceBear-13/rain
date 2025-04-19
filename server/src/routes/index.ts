import { Router, Request, Response } from "express";
import messageRouter from './messagesRoutes'
import authRouter from "./authRoute";

export const router = Router();

router.use('/api/messages', messageRouter)
router.use('/api/auth', authRouter);
