import { useState, useRef, useEffect, ReactNode } from 'react';
import Chats from './Chats';
import { loadChat } from '../services/chatAPI';
import { Chat } from '../types/socket.types';

interface SidebarProps {
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  children?: ReactNode;
  className?: string;
}

export default function Sidebar({
  defaultWidth = 20,
  minWidth = 10,
  maxWidth = 20,
  className = ''
}: SidebarProps) {
  const [width, setWidth] = useState(defaultWidth);
  // Initialize chats as an empty array to ensure it's always an array
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragHandleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getChats = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await loadChat();
        
        // Check if response is an array
        if (Array.isArray(response)) {
          setChats(response as Chat[]);
        } else {
          // If it's not an array, set chats to empty array and log error
          console.error('Expected array of chats but got:', response);
          setChats([]);
          setError('Failed to load chats properly');
          console.log(response);
        }
      } catch (err) {
        console.error('Error fetching chats:', err);
        setChats([]);
        setError(err instanceof Error ? err.message : 'Failed to load chats');
      } finally {
        setLoading(false);
      }
    };
    
    getChats();
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      // Prevent text selection during drag
      e.preventDefault();
      
      const newWidth = (e.clientX / window.innerWidth) * 100;
      setWidth(Math.min(Math.max(newWidth, minWidth), maxWidth));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      // Remove the no-select class from body when done dragging
      document.body.classList.remove('resize-sidebar-dragging');
    };

    if (isDragging) {
      // Add a class to the body to prevent text selection during dragging
      document.body.classList.add('resize-sidebar-dragging');
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      // Make sure to clean up the class if component unmounts during drag
      document.body.classList.remove('resize-sidebar-dragging');
    };
  }, [isDragging, minWidth, maxWidth]);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Prevent default browser behavior that might cause text selection
    e.preventDefault();
    setIsDragging(true);
  };


  return (
    <div 
      className={`h-full relative flex flex-col ${className}`}
      style={{ width: `${width}%` }}
    >
      {/* Content area with scrolling */}
      <div className="flex-grow overflow-auto">
        {loading ? (
          <div className="text-center py-4">Loading chats...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">{error}</div>
        ) : chats.length === 0 ? (
          <div className="text-center py-4">No chats available.</div>
        ) : (
          // No need to check if chats is an array here since we ensure it above
          chats.map((chat) => (
            <Chats 
              key={chat.id} 
              channelName={chat.name} 
              id={chat.id} 
              // Check if last_message exists before accessing it
              lastMessage={chat.last_message ? chat.last_message : 'Empty chat'} 
            />
          ))
        )}
      </div>

      {/* User info bar - fixed at bottom */}
      <div className='grid items-center gap-x-3 bg-white'>
        <a 
          className='hover:bg-gray-100 hover:cursor-pointer border border-gray-200 p-2'
          onClick={() => window.dispatchEvent(new Event('show-new-chat'))}
        >
          New chat
        </a>
        <div className='flex items-center space-x-2 p-2 border border-gray-200'>
          <img src='avatar-default.svg' className='size-[40px]' alt="User avatar" />
          <h1>{localStorage.getItem('username') || 'User'}</h1>
        </div>
      </div>
      
      {/* Drag handle - positioned on RIGHT side */}
      <div 
        ref={dragHandleRef}
        className="absolute top-0 right-0 w-1 h-full cursor-ew-resize z-10"
        onMouseDown={handleMouseDown}
      />
    </div>
  );
}