import Message from "../components/Message";
import Sidebar from "../components/Sidebar";
import { message } from "../types/interface";
import TextArea from "../components/TextArea";
import ChatHeader from "../components/ChatHeader";
import Chats from "../components/Chats";

export default function TextPage() {
  const messages: Array<message> = [
    {
      id: "1",
      from: "user",
      content: "Hello, how are you?"
    },
    {
      id: "2", 
      from: "assistant",
      content: "I'm doing well, thank you for asking!"
    }
  ];

  return (
    <>
      <div className="flex h-screen w-screen overflow-hidden">
        {/* Resizable Sidebar */}
        <Sidebar className="bg-gray-100">
          
          <Chats />
        </Sidebar>

        {/* Main content area - takes remaining width */}
        <div className="relative h-full flex-1 flex flex-col" id="main-section">
          {/* Header bar */}
          <ChatHeader />
          
          {/* Message content - flex-col-reverse makes newest messages appear at bottom */}
          <div className="flex-1 overflow-y-auto p-1 flex flex-col-reverse">
            <div className="flex flex-col w-full">
              {messages.map((message, index) => (
                <Message key={message.id} id={message.id} from={message.from} content={message.content} />
              ))}
            </div>
          </div>
          
          {/* Footer bar */}
          <TextArea />
        </div>
      </div>
    </>
  )
}