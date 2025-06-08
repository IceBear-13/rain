import { supabase, supabaseAdmin } from "../db/db";
import { chat } from "../models/chatModel";
import { messages } from "../models/messagesModel";
import { getUserById } from "./userService";

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
      .select("participant_one, participant_two")
      .eq("c_id", chatId)
      .or(`participant_one.eq.${userId},participant_two.eq.${userId}`)
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
      console.error("User is not a participant in this chat" + chatId);
      return [];
    }

    console.log("Loading messages for chat:", chatId, "and user:", userId);

    const { data, error } = await supabaseAdmin
      .from("messages")
      .select("*")
      .eq("chat_id", chatId);
    
    if (error) {
      console.error("Error loading messages:", error);
      return [];
    }

    const messagesWithUser = await Promise.all(data.map(async (message) => {
      const user = await getUserById(message.sender_id);

      return {
        ...message,
        sender: user,
      };
    }));

    // console.log("Messages loaded:", messagesWithUser);
    return messagesWithUser as messages[];

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
      .or(`participant_one.eq.${userId},participant_two.eq.${userId}`);

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

export const getChatFromParticipants = async (participant_one: string, participant_two: string): Promise<chat | null> => {
  try {
    const { data, error } = await supabaseAdmin
      .from("chat")
      .select("*")
      .or(`participant_one.eq.${participant_one},participant_two.eq.${participant_two}`)
      .single();

    if (error) {
      console.error("Error fetching chat from participants:", error);
      return null;
    }

    if (!data) {
      console.log("No chat found for the given participants");
      return null;
    }

    return data as chat;
  } catch (error) {
    console.error("Error fetching chat from participants:", error);
    return null;
  }
}

export const createChat = async (name: string, participant_one: string, participant_two: string): Promise<chat | null> => {
  try{
    const chatId = crypto.randomUUID();

    const { data, error } = await supabaseAdmin
      .from("chat")
      .insert({ name, participant_one: participant_one, participant_two: participant_two, c_id: chatId })
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

    return chatData as chat;

  } catch (error) {
    console.error("Error creating chat:", error);
    return null;
  }
}
