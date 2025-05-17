import axios from "axios";
import socketService from "./socketService";
import { Chat, Message } from "../types/socket.types";

const BACKEND_ENDPOINT = 'http://localhost:3000/'

export const loadChat = async () => {
    try {
        const response = await axios.get(`${BACKEND_ENDPOINT}api/chat`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }
        );

        if (response.status === 200) {
            return response.data as Chat[];
        } else {
            throw new Error('Failed to load chat');
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const loadMessages = async (chat_id: string) => {
    try {
        const response = await axios.get(`${BACKEND_ENDPOINT}api/chat/${chat_id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })

        if (response.status === 200) {
            return response.data as Message[];
        } else {
            throw new Error('Failed to load messages');
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const joinChat = async (chatId: string) => {
    try{
        return await socketService.joinChat(chatId);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const leaveChat = async (chatId: string) => {
    try{
        return await socketService.leaveChat(chatId);
    } catch (error) {
        console.error(error);
        throw error;
    }
}