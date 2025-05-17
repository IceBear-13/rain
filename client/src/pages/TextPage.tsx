import Message from "../components/Message";
import Sidebar from "../components/Sidebar";
import { message } from "../types/interface";
import TextArea from "../components/TextArea";
import ChatHeader from "../components/ChatHeader";
import { useEffect, useState } from "react";
import { Chat } from "../types/socket.types";
import { loadChat } from "../services/chatAPI";
import MainContent from "../components/MainContent";

export default function TextPage() {
  const [chats, setChats] = useState([] as Chat[]);

  window.onload = async () => {
    const chatData = await loadChat();
    setChats(chatData);
  }

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
