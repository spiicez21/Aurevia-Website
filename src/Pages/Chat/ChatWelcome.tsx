import React, { useEffect } from 'react';
import ChatLayout from '../../components/layout/ChatLayout';
import Sidebar from '../../components/layout/Sidebar';
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
      <div className="min-h-screen bg-background flex flex-col">
        <div className="flex-1 flex flex-col">
          <div className="relative w-full min-h-screen bg-bg-primary">
            <Sidebar />
            <main className="flex flex-col w-full min-h-screen px-4 sm:px-6 lg:px-8">
              <WelcomeText 
                chatTitle={chatTitle}
                isActive={true}
              />
              {error && (
                <div className="mx-4 sm:mx-6 lg:mx-8 mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
                  <strong>Error:</strong> {error}
                  <div className="mt-1 text-xs text-red-400">
                    Make sure the backend server is running on http://localhost:5000
                  </div>
                </div>
              )}
              <ChatContainer messages={messages} />
            </main>
          </div>
        </div>
        <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-gray-800/50 pb-safe">
          <MessageInput 
            onSendMessage={handleSendMessage}
            isActive={true}
            disabled={isLoading}
          />
        </div>
      </div>
    );
  }

  return (
    <ChatLayout>
      <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto">
        <WelcomeText username="Username" />
        {error && (
          <div className="mx-8 mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-300 text-sm max-w-2xl">
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
      </div>
    </ChatLayout>
  );
};

export default ChatWelcome;