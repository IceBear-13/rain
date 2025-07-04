import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Add this import
import { Message, NewMessageEvent } from "../types/socket.types";
import ChatHeader from "./ChatHeader";
import TextArea from "./TextArea";
import { loadMessages } from "../services/chatAPI";
import NewChat from "./Newchat";
import socketService from "../services/socketService";
import io from 'socket.io-client'


export default function MainContent() {
    const { id: chatId } = useParams<{ id: string }>(); // Get chat ID from URL
    const [messages, setMessages] = useState([] as Message[]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [isNewChatVisible, setIsNewChatVisible] = useState(false);
    const socket = io('http://localhost:3000', {
        autoConnect: false,
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        transports: ['websocket']
    })

    // Handle new messages - now uses chatId from URL
    useEffect(() => {
        socket.on('newMessage', (data: NewMessageEvent) => {
            console.log('newMessage');
            setMessages(prev => [...prev, data.message]);
        })
    }, []);

    // Fetch messages when chat changes (URL parameter changes)
    useEffect(() => {
        const fetchMessages = async () => {
            if (!chatId) {
                setMessages([]);
                return;
            }

            setLoading(true);
            setError(false);
            try {
                const response = await loadMessages(chatId);
                setMessages(response);
            } catch (error) {
                console.error('Error loading messages:', error);
                setError(true);
            }
            setLoading(false);
        };

        fetchMessages();
    }, [chatId]);

    // Join the socket room when chatId changes
    useEffect(() => {
        if (chatId && socketService.isConnected()) {
            const userId = localStorage.getItem('rain_id');
            if (userId) {
                socketService.joinChat(chatId);
                console.log(`Joined socket room for chat: ${chatId}`);
            }
        }
    }, [chatId]);

    // Listen for custom event to show NewChat
    useEffect(() => {
        const handleShowNewChat = () => setIsNewChatVisible(true);
        window.addEventListener('show-new-chat', handleShowNewChat);
        return () => window.removeEventListener('show-new-chat', handleShowNewChat);
    }, []);

    return (
        <div className="relative h-full flex-1 flex flex-col" id="main-section">
            <NewChat 
                isVisible={isNewChatVisible} 
                onClose={() => setIsNewChatVisible(false)} 
            />
            <ChatHeader />
            
            <div className="flex-1 overflow-y-auto p-1 flex flex-col-reverse">
                <div className="flex flex-col w-full">
                    {loading ? (
                        <div className="text-center py-4">Loading messages...</div>
                    ) : error ? (
                        <div className="text-center py-4 text-red-500">Error loading messages. Please try again.</div>
                    ) : messages.length === 0 ? (
                        <div className="text-center py-4">No messages yet. Start a conversation!</div>
                    ) : (
                        Array.isArray(messages) ? messages.map((message) => (
                            <div 
                                id={message.m_id}
                                key={message.m_id} 
                                className={`py-2 px-4 my-1 max-w-3/4 rounded-lg ${
                                    message.sender.rain_id === localStorage.getItem('rain_id') 
                                        ? 'ml-auto bg-blue-500 text-white' 
                                        : 'mr-auto bg-gray-200'
                                }`}
                            >
                                <div className="text-sm font-semibold">{message.sender.username}</div>
                                <div>{message.content}</div>
                                <div className="text-xs opacity-70 text-right">
                                    {new Date(message.created_at).toLocaleTimeString()}
                                </div>
                            </div>
                        )) : <div className="text-center py-4">Invalid message data received.</div>
                    )}
                </div>
            </div>
            
            <TextArea />
        </div>
    );
}