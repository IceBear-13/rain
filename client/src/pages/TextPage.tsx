import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { Chat } from "../types/socket.types";
import { loadChat } from "../services/chatAPI";
import MainContent from "../components/MainContent";
import socketService from "../services/socketService";

export default function TextPage() {
  const [chats, setChats] = useState([] as Chat[]);
  const [error, setError] = useState(false);


  window.onload = async () => {
    const chatData = await loadChat();
    setChats(chatData);
  }

  useEffect(() => {
    const connect = async () => {
      console.log('Connecting to socket...');
      await socketService.connect();
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

    const joinChats = async () => {
        if (chats.length > 0) {
            for (const chat of chats) {
                try {
                    await socketService.joinChat(chat.id);
                    console.log(`Joined chat ${chat.id}`);
                } catch (error) {
                    console.error(`Failed to join chat ${chat.id}:`, error);
                }
            }
        } else {
            console.warn('No chats available to join');
        }
    }
    const chatData = loadChat();
    chatData.then((data) => {
      setChats(data);
    });

    connect();
    joinChats();

    // console.log('i fire once');
  }, []);
  return (
    <>
      <div className="flex h-screen w-screen overflow-hidden">
        {/* Resizable Sidebar */}
        <Sidebar className="bg-gray-100">
          

        </Sidebar>

        {/* Main content area - takes remaining width */}
        <MainContent />
      </div>
    </>
  )
}
