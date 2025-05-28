import { supabase, supabaseAdmin } from "../db/db";
import { chat } from "../models/chatModel";
import { messages } from "../models/messagesModel";

export const loadChat = async (chatId: string, userId: string): Promise<chat | null> => {
  
  try{
    const { data, error } = await supabaseAdmin
      .from("chat")
      .select("*")
      .eq("c_id", chatId)
      .single();

    const isParticipant = await checkIfUserIsParticipant(chatId, userId);

    if (!isParticipant) {
      // console.error("User is not a participant in this chat");
      return null;
    }


    if (error) {
      console.error("Error loading chat:", error);
      return null;
    }

    const chatData = data as chat;
    const chat: chat = {
      ...chatData,
    };

    return chat;
  } catch (error) {
    console.error("Error loading chat:", error);
    return null;
 }

}

export const checkIfUserIsParticipant = async (chatId: string, userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabaseAdmin
      .from("chat")
      .select("user_one, user_two")
      .eq("c_id", chatId)
      .or(`user_one.eq.${userId},user_two.eq.${userId}`)
      .single();

    if (error) {
      console.error("Error checking participant:", error);
      return false;
    }

    return data !== null;
  } catch (error) {
    console.error("Error checking participant:", error);
    return false;
  }
}

export const loadChatMessages = async (chatId: string, userId: string): Promise<messages[]> => {
  try{

    const isParticipant = await checkIfUserIsParticipant(chatId, userId);

    if (!isParticipant){
      // console.error("User is not a participant in this chat");
      return [];
    }

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("chat_id", chatId);
    
    if (error) {
      console.error("Error loading messages:", error);
      return [];
    }

    return data as messages[];
  } catch (error) {
    console.error("Error loading messages:", error);
    return [];
  }
}

export const loadChats = async (userId: string): Promise<chat[]> => {
  try {
    const { data, error } = await supabaseAdmin
      .from("chat")
      .select("c_id")
      .or(`user_one.eq.${userId},user_two.eq.${userId}`);

    if (error) {
      console.error("Error loading chats:", error);
      throw error;
    }

    const chatIds = data.map((chat) => chat.c_id);

    const { data: chats, error: chatsError } = await supabaseAdmin
      .from("chat")
      .select("*")
      .in("c_id", chatIds);

    if (chatsError) {
      console.error("Error loading chats:", chatsError);
      throw chatsError;
    }

    return chats as chat[];
  } catch (error) {
    console.error("Error loading chats:", error);
    return [];
  }
}

export const createChat = async (name: string, participant_one: string, participant_two: string): Promise<chat | null> => {
  try{
    const chatId = `${participant_one}-${participant_two}`;
    const { data, error } = await supabaseAdmin
      .from("chat")
      .insert({ name, type: "private", user_one: participant_one, user_two: participant_two, c_id: chatId })
      .select()
      .single();

    if (!chatId) {
      console.error("Error creating chat: No chat ID returned");
      return null;
    }




    if (error) {
      console.error("Error creating chat:", error);
      return null;
    }

    const { data: chatData, error: chatError } = await supabaseAdmin
      .from("chat")
      .select("*")
      .eq("c_id", chatId)
      .single();

    if (chatError) {
      console.error("Error loading chat:", chatError);
      return null;
    }

    const chat: chat = {
      ...chatData,
      participants_id: [participant_one, participant_two],
    };

    return chat;

  } catch (error) {
    console.error("Error creating chat:", error);
    return null;
  }
}
