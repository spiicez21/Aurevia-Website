import React from 'react';
import ChatMessage from './ChatMessage';

export interface ChatMessageData {
  id: string;
  message: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatContainerProps {
  messages: ChatMessageData[];
}

const ChatContainer: React.FC<ChatContainerProps> = ({ messages }) => {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="max-w-3xl mx-auto space-y-4">
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg.message}
            isUser={msg.isUser}
            timestamp={msg.timestamp}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatContainer;