import { useEffect, useState } from "react";
import { Message } from "../types/socket.types";
import ChatHeader from "./ChatHeader";
import TextArea from "./TextArea";
import { loadMessages } from "../services/chatAPI";
import socketService from "../services/socketService";

export default function MainContent() {
    const [messages, setMessages] = useState([] as Message[]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        const connect = async () => {
            socketService.connect();
            if (!socketService.isConnected()) {
                console.error('Socket connection failed');
                setError(true);
            }

            try {
                await socketService.authenticate(localStorage.getItem('token') || '');
                console.log('Socket authenticated successfully');
            } catch (error) {
                console.error('Socket authentication failed:', error);
                setError(true);
            }

        }
        const fetchMessages = async () => {
            setLoading(true);
            try{
                const response = await loadMessages(localStorage.getItem('selectedChatId') || 'noChatId');
                setMessages(response);
                console.log(response);
            }  catch (error) {
                console.error(error);
                setError(true);
            }
            setLoading(false);
        }
        fetchMessages();
        connect();

    }, []);
    return (
        
        <div className="relative h-full flex-1 flex flex-col" id="main-section">
            {/* Header bar */}
            <ChatHeader />
            
            {/* Message content - flex-col-reverse makes newest messages appear at bottom */}
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
                                key={message.id} 
                                className={`py-2 px-4 my-1 max-w-3/4 rounded-lg ${
                                    message.sender.rain_id === localStorage.getItem('userId') 
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
            
            {/* Footer bar */}
            <TextArea />
        </div>
    );
}