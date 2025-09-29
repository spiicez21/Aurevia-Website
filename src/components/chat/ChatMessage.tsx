import React from 'react';

interface ChatMessageProps {
  message: string;
  isUser?: boolean;
  timestamp?: Date;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  isUser = false,
  timestamp 
}) => {
  return (
    <div className={`mb-4 animate-slide-up ${isUser ? 'flex justify-end' : 'flex justify-start'}`}>
      <div className={`max-w-[75%] ${isUser ? 'ml-8' : 'mr-8'}`}>
        <div
          className={`rounded-2xl px-6 py-4 shadow-lg transition-all duration-200 hover:shadow-xl ${
            isUser
              ? 'bg-olive/90 text-white ml-auto font-medium shadow-olive/25 hover:bg-olive'
              : 'bg-gray-800/90 text-gray-100 shadow-gray-900/30 border border-gray-700/50'
          }`}
        >
          <div className={`text-sm leading-relaxed whitespace-pre-wrap font-cabinet antialiased ${isUser ? 'font-medium' : 'font-normal'}`}>
            {message}
          </div>
        </div>
        {timestamp && (
          <div className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;