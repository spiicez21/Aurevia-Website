import React from 'react';
import ChatMessage from './ChatMessage';

export interface ChatMessageData {
  id: string;
  message: string;
  isUser: boolean;
  timestamp: Date;
  isStreaming?: boolean;
}

interface ChatContainerProps {
  messages: ChatMessageData[];
}

const ChatContainer: React.FC<ChatContainerProps> = ({ messages }) => {
  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="w-full max-w-4xl mx-auto">
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg.message}
            isUser={msg.isUser}
            timestamp={msg.timestamp}
            isStreaming={msg.isStreaming}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatContainer;