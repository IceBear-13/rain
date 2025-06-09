import jwt from "jsonwebtoken";
import { User } from "../models/userModel";
import { supabase, supabaseAdmin } from "../db/db";
import { hashPassword, verifyPassword } from "../utils/encrypt";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;

export const loginWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("user")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      console.error("Error fetching user:", error);
      throw new Error("User not found");
    }

    if (!data) {
      throw new Error("User not found");
    }

    // Make sure we're using the right column name from the database
    // The error suggests we might be getting undefined for data.password
    if (!data.encrypted_password) {
      throw new Error("Password data is missing");
    }

    const isValid = await verifyPassword(password, data.encrypted_password);
    if (!isValid) {
      throw new Error("Invalid password");
    }

    const user: User = data;

    const token = jwt.sign(
      { id: user.rain_id, username: user.username },
      JWT_SECRET_KEY,
      { expiresIn: "24h" }
    );

    return {
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.rain_id,
        username: user.username,
      },
    };

  } catch (error) {
    console.error("Error logging in with email:", error);
    throw new Error("Login failed");
  }
}

export const loginWithRainID = async (id: string, password: string) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("user")
      .select("*")
      .eq("rain_id", id)
      .single();

    if (error) {
      console.error("Error fetching user:", error);
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error("User not found");
    }

    if (!data.encrypted_password) {
      throw new Error("Password data is missing");
    }

    // This was inverted! It should check if verified is false
    const verified = await verifyPassword(password, data.encrypted_password);
    if (!verified) {
      throw new Error("Invalid password");
    }

    const user: User = data;

    const token = jwt.sign(
      { id: user.rain_id, username: user.username},
      JWT_SECRET_KEY,
      { expiresIn: "24h" }
    );

    // console.log("User logged in successfully:", user);

    return {
      success: true,
      message: "Login successful",
      token,
      user: {
        rain_id: user.rain_id,
        username: user.username,
      },
    };

  } catch (error) {
    console.error("Error logging in with username:", error);
    throw new Error("Login failed");
  }
}

export const registerUser = async (rain_id: string, username: string, password: string) => {
  try {    
    const { data, error } = await supabaseAdmin
      .from("user")
      .insert([{ rain_id, username, encrypted_password: await hashPassword(password) }])
      .select()
      .single();

    if (error) {
      console.error("Error registering user:", error);
      throw new Error("Registration failed");
    }

    const user: User = data;

    const token = jwt.sign(
      { id: user.rain_id, username: user.username },
      JWT_SECRET_KEY,
      { expiresIn: "24h" }
    );

    return {
      success: true,
      message: "Registration successful",
      token,
      user: {
        id: user.rain_id,
        username: user.username,
      },
    };

  } catch (error) {
    console.error("Error registering user:", error);
    throw new Error("Registration failed");
  }
}
