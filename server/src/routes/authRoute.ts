import { Router } from "express";
import { loginController, registerController, verifyToken } from "../controller/authController";
import { authMiddleware } from "../middleware/authMiddleware";

const authRouter = Router();

export default authRouter;


authRouter.post('/register', registerController);
authRouter.post('/login', loginController);
authRouter.get('/verify', authMiddleware, verifyToken);
