import User, { IUser } from '../models/user';
import bcrypt from 'bcryptjs';

export const createUser = async (
  username: string, 
  email: string, 
  password: string
): Promise<IUser> => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  
  const user = new User({
    username,
    email,
    password: hashedPassword
  });
  
  return await user.save();
};

export const getUserByEmail = async (email: string): Promise<IUser | null> => {
  return await User.findOne({ email });
};

export const validatePassword = async (
  plainPassword: string, 
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};
