import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { Chat } from "../types/socket.types";
import { loadChat } from "../services/chatAPI";
import MainContent from "../components/MainContent";
import socketService from "../services/socketService";

export default function TextPage() {
  const [chats, setChats] = useState([] as Chat[]);
  // const [error, setError] = useState(false);


  window.onload = async () => {
    const chatData = await loadChat();
    setChats(chatData);
  }

// ...existing code...
useEffect(() => {
    const connect = async () => {
      console.log('Connecting to socket...');
      await socketService.connect();
      
      // This check happens immediately after connect() starts, not after it completes
      if (!socketService.isConnected()) {
        console.error('Socket connection failed');
        // setError(true);
      }

      try {
        socketService.authenticate(localStorage.getItem('token') as string); // Remove the parameter here
        console.log('Socket authenticated successfully');
      } catch (error) {
        console.error('Socket authentication failed:', error);
        // setError(true);
      }
    }

    connect();

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
