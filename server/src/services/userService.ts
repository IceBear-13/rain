import jwt from 'jsonwebtoken';
import { User } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { supabaseAdmin } from '../db/db';


dotenv.config();

export const verifyToken = (token: string)=> {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);


    console.log('Decoded user:', decoded);
    return decoded as User;


  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}

export const getUserById = async (userId: string) => {
  const { data, error } = await supabaseAdmin
    .from("user")
    .select("*")
    .eq("rain_id", userId)
    .single();

  if (error) {
    console.error("Error fetching user:", error);
    throw error;
  }

  return data as User;
}