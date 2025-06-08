import { useRef, useEffect } from 'react';
import socketService from '../services/socketService';
import { useParams } from 'react-router-dom';

export default function TextArea() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Auto-resize textarea based on content
  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto';
      // Set the height to match the scrollHeight (content height)
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const { id: chatId } = useParams<{ id: string }>();

  const handleSend = () => {
      const content = textareaRef.current?.value.trim();
      const userId = localStorage.getItem('rain_id') as string;
      // Use chatId from URL instead of localStorage
      
      if (!content || content.length === 0 || !userId || !chatId) {
          console.error('Content, userId, or chatId is missing');
          return;
      }

      const payload = {
          content: content,
          userId: userId,
          chatId: chatId, // Use URL parameter
      }

      try {
          socketService.sendMessage(payload);
          // Clear the textarea after sending
          if (textareaRef.current) {
              textareaRef.current.value = '';
          }
      } catch (error) {
          console.error('Error sending message:', error);
      }
  }

  
  useEffect(() => {
    // Add resize listener for window resizing
    window.addEventListener('resize', adjustHeight);
    return () => window.removeEventListener('resize', adjustHeight);
  }, []);


  
  return (
    <div className="p-1">
      <div className="w-full items-center flex sticky bottom-0 rounded-md space-x-2">
        <textarea
          ref={textareaRef}
          className="rounded-md min-h-[32px] max-h-[150px] border w-full outline-none focus:outline-none focus:ring-0 resize-none p-1.5 text-xs"
          placeholder="Type a message..."
          onInput={adjustHeight}
          rows={1}
        ></textarea>
        <button onClick={() => {handleSend()}}>send</button>
      </div>
    </div>
  );
}