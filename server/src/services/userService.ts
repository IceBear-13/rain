import jwt from 'jsonwebtoken';
import { User } from '@supabase/supabase-js';
import { supabaseAdmin } from '../db/db';
import dotenv from 'dotenv';

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
