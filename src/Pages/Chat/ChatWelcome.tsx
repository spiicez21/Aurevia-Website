import React, { useEffect } from 'react';
import ChatLayout from '../../components/layout/ChatLayout';
import WelcomeText from '../../components/chat/WelcomeText';
import MessageInput from '../../components/chat/MessageInput';
import ChatContainer, { type ChatMessageData } from '../../components/chat/ChatContainer';
import { useChat } from '../../hooks/useChat';

const ChatWelcome: React.FC = () => {
  const { 
    currentChat, 
    isLoading, 
    error, 
    sendMessage 
  } = useChat();

  const handleSendMessage = async (message: string) => {
    await sendMessage(message, true); // Use streaming by default
  };

  // Convert API messages to component format
  const messages: ChatMessageData[] = currentChat?.messages.map(msg => ({
    id: msg.id,
    message: msg.content,
    isUser: !msg.isBot,
    timestamp: msg.timestamp,
    isStreaming: msg.isStreaming
  })) || [];

  const isActive = messages.length > 0;
  const chatTitle = currentChat?.title || '';

  // Update page title when chat becomes active
  useEffect(() => {
    if (isActive && chatTitle) {
      document.title = `${chatTitle} | Aurevia`;
    }
  }, [isActive, chatTitle]);

  if (isActive) {
    return (
      <div className="min-h-screen bg-background flex flex-col pb-20">
        <ChatLayout>
          <WelcomeText 
            chatTitle={chatTitle}
            isActive={true}
          />
          {error && (
            <div className="mx-8 mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
              <strong>Error:</strong> {error}
              <div className="mt-1 text-xs text-red-400">
                Make sure the backend server is running on http://localhost:5000
              </div>
            </div>
          )}
          <ChatContainer messages={messages} />
        </ChatLayout>
        <MessageInput 
          onSendMessage={handleSendMessage}
          isActive={true}
          disabled={isLoading}
        />
      </div>
    );
  }

  return (
    <ChatLayout>
      <WelcomeText username="Username" />
      {error && (
        <div className="mx-8 mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
          <strong>Connection Error:</strong> {error}
          <div className="mt-1 text-xs text-red-400">
            Backend server may not be running. You can still chat - it will use local responses.
          </div>
        </div>
      )}
      <MessageInput 
        onSendMessage={handleSendMessage} 
        disabled={isLoading}
      />
    </ChatLayout>
  );
};

export default ChatWelcome;