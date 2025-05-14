import { callbackify } from 'util';
import { supabase } from '../db/db';
import { messages } from '../models/messagesModel';

export const getMessages = async (userId: string) => {
  try {
    
    const { data: userMessages, error } = await supabase.
      from('messages')
      .select('id, content, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    return userMessages;
  } catch (error) {
    throw new Error('Error fetching messages');
  }
}

export const getMessageById = async (messageId: string) => {
  try {
    const { data: message, error } = await supabase
      .from('messages')
      .select('id, content, created_at')
      .eq('id', messageId)
      .single();

    if (error) {
      throw new Error('Error fetching message');
    }

    return message;
  } catch (error) {
    throw new Error('Error fetching message');
  }
}

export const createMessage = async (userId: string, content: string) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert([
        { user_id: userId, content: content }
      ]);

    if (error) {
      throw new Error('Error creating message');
    }

    return data;
  } catch (error) {
    throw new Error('Error creating message');
  }
}

export const getMessagesByChatId = async (chatId: string) => {
  try{
    const { data: chatMessages, error } = await supabase
      .from('messages')
      .select('id, content, created_at')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error('Error fetching messages');
    }

    return chatMessages;
  } catch (error) {
    throw new Error('Error fetching messages');
  }
}
