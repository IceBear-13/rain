import { Request, Response } from "express";
import { loginWithEmail, loginWithRainID, registerUser } from "../services/authService";
import { AuthRequest } from "../types/requestInterface";

export const registerController = async (req: Request, res: Response) => {
  try{
    const rain_id = req.body.id;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    if(!rain_id || !username || !email || !password) {
      res.status(400).json({ success: false, message: "All fields are required" });
      return;
    }

    const { success, message, token, user } = await registerUser(rain_id, username, email, password);

    if (!success) {
      res.status(400).json({ success: false, message });
      return;
    }

    res.status(201).json({
      success: true,
      message,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch(error){
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export const loginController = async (req: Request, res: Response) => {
  try{
    const id = req.body.id;
    const password = req.body.password;

    if(!id || !password) {
      res.status(400).json({ success: false, message: "ID and password are required" });
      return;
    }

    const { success, message, token, user } = await loginWithRainID(id, password);


    if (!success) {
      res.status(400).json({ success: false, message });
      return;
    }
    res.status(200).json({
      success: true,
      message,
      token,
      user: {
        id: user.rain_id,
        username: user.username,
        email: user.email,
      },
    });
  } catch(error){
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export const verifyToken = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    
    if (!user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Token is valid",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
