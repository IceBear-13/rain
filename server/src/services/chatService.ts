import { supabase } from "../db/db";
import { chat } from "../models/chatModel";
import { messages } from "../models/messagesModel";

export const loadChat = async (chatId: string, userId: string): Promise<chat | null> => {
  
  try{
    const { data, error } = await supabase
      .from("chat")
      .select("*")
      .eq("c_id", chatId)
      .single();

    const { data: participants, error: participantsError } = await supabase
      .from("chat_participants")
      .select("user_id")
      .eq("chat_id", chatId);

    if (participantsError) {
      console.error("Error loading participants:", participantsError);
      return null;
    }

    const participantIds = participants.map((participant) => participant.user_id);
    const isParticipant = participantIds.includes(userId);

    if (!isParticipant) {
      console.error("User is not a participant in this chat");
      return null;
    }

    if (error) {
      console.error("Error loading chat:", error);
      return null;
    }

    const chatData = data as chat;
    const chat: chat = {
      ...chatData,
      participants_id: participantIds,
    };

    return chat;
  } catch (error) {
    console.error("Error loading chat:", error);
    return null;
 }

}

export const checkIfUserIsParticipant = async (chatId: string, userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from("chat_participants")
      .select("user_id")
      .eq("chat_id", chatId)
      .eq("user_id", userId)
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
      console.error("User is not a participant in this chat");
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
    const { data, error } = await supabase
      .from("chat_participants")
      .select("chat_id")
      .eq("user_id", userId);

    if (error) {
      console.error("Error loading chats:", error);
      throw error;
    }

    const chatIds = data.map((chat) => chat.chat_id);

    const { data: chats, error: chatsError } = await supabase
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

export const createChat = async (name: string, type: 'group' | 'private', participantsId: string[]): Promise<chat | null> => {
  try{
    const { data, error } = await supabase
      .from("chat")
      .insert({ name, type })
      .select()
      .single();

    const chatId = data?.c_id;

    if (!chatId) {
      console.error("Error creating chat: No chat ID returned");
      return null;
    }

    const { error: participantsError } = await supabase
      .from("chat_participants")
      .insert(participantsId.map((userId) => ({ chat_id: chatId, user_id: userId })));

    if (participantsError) {
      console.error("Error adding participants:", participantsError);
      return null;
    }

    if (error) {
      console.error("Error creating chat:", error);
      return null;
    }

    const { data: chatData, error: chatError } = await supabase
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
      participants_id: participantsId,
    };

    return chat;

  } catch (error) {
    console.error("Error creating chat:", error);
    return null;
  }
}
