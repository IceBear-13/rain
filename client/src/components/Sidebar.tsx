import { useState, useRef, useEffect, ReactNode } from 'react';
import Chats from './Chats';

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
  const [isDragging, setIsDragging] = useState(false);
  const dragHandleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
        <Chats channelName="General" lastMessage="Welcome to the chat" id="general-chat" />
        {/* Add more content here */}
      </div>

      {/* User info bar - fixed at bottom */}
      <div className='flex items-center gap-x-3 p-2 border-t border-gray-200 bg-white'>
        <img src='avatar-default.svg' className='size-[40px]'/>
        <h1>Username</h1>
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