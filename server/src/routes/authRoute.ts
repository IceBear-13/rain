import { Router } from "express";
import { loginController, registerController } from "../controller/authController";

const authRouter = Router();

export default authRouter;


authRouter.post('/register', registerController);
authRouter.post('/login', loginController);
