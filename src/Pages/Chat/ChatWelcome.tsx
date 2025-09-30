import React, { useEffect } from 'react';
import { Share2 } from 'lucide-react';
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
    isStreaming,
    error, 
    sendMessage,
    stopGeneration
  } = useChat();

  const handleSendMessage = async (message: string) => {
    await sendMessage(message, true); // Use streaming by default
  };

  const handleShareChat = async () => {
    if (!currentChat || messages.length === 0) {
      return;
    }

    try {
      // Create a shareable text version of the chat
      const chatText = messages.map(msg => {
        const sender = msg.isUser ? 'You' : 'AI';
        return `${sender}: ${msg.message}`;
      }).join('\n\n');

      const shareData = {
        title: chatTitle || 'Chat with AI Assistant',
        text: `Chat conversation:\n\n${chatText}`,
        url: window.location.href
      };

      // Try using native Web Share API first
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(`${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`);
        
        // Show a temporary notification (you could replace this with a toast notification)
        const notification = document.createElement('div');
        notification.textContent = 'Chat copied to clipboard!';
        notification.className = 'fixed top-4 right-4 bg-olive text-charcoal px-4 py-2 rounded-lg shadow-lg z-50 font-medium';
        document.body.appendChild(notification);
        
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 3000);
      }
    } catch (error) {
      console.error('Error sharing chat:', error);
    }
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
            
            {/* Share Button - Top Right Corner */}
            <div className="fixed top-4 right-4 z-40">
              <button
                onClick={handleShareChat}
                className="w-12 h-12 bg-charcoal/90 backdrop-blur-sm rounded-full shadow-[0px_4px_15px_rgba(0,0,0,0.65)] flex items-center justify-center hover:bg-olive hover:shadow-olive-glow transition-all duration-200 group border border-gray-700/30"
                title="Share this chat"
              >
                <Share2 size={18} className="text-olive group-hover:text-charcoal" />
              </button>
            </div>
            
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
            onStopGeneration={stopGeneration}
            isActive={true}
            disabled={isLoading}
            isStreaming={isStreaming}
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
          onStopGeneration={stopGeneration} 
          disabled={isLoading}
          isStreaming={isStreaming}
        />
      </div>
    </ChatLayout>
  );
};

export default ChatWelcome;