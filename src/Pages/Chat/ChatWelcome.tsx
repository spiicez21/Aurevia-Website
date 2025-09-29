import React, { useState, useEffect } from 'react';
import ChatLayout from '../../components/layout/ChatLayout';
import WelcomeText from '../../components/chat/WelcomeText';
import MessageInput from '../../components/chat/MessageInput';
import ChatContainer, { type ChatMessageData } from '../../components/chat/ChatContainer';

const ChatWelcome: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [chatTitle, setChatTitle] = useState<string>('');

  const generateAIResponse = (userMessage: string): string => {
    // Simulate AI response based on user input
    if (userMessage.toLowerCase().includes('matrix')) {
      return `**Basic Terms**

• **Element**: Each entry in a matrix (e.g., in AAA, element a12=2a_{1,2}, meaning row 1, column 2).
• **Row matrix**: A matrix with only 1 row.
• **Column matrix**: A matrix with only 1 column.
• **Square matrix**: Number of rows = number of columns (e.g., 3×3).
• **Diagonal matrix**: Square matrix where all non-diagonal elements are 0.
• **Identity matrix**: A diagonal matrix with 1s on the main diagonal.
• **Zero matrix**: All entries are 0.`;
    }
    
    return `I understand you're asking about "${userMessage}". Let me help you with that topic.`;
  };

  const handleSendMessage = (message: string) => {
    const userMessage: ChatMessageData = {
      id: Date.now().toString(),
      message,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Set chat title from first message if not already set
    if (!chatTitle) {
      setChatTitle(`Chat about ${message}`);
    }

    // Activate chat mode
    setIsActive(true);

    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiResponse: ChatMessageData = {
        id: (Date.now() + 1).toString(),
        message: generateAIResponse(message),
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

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
          <ChatContainer messages={messages} />
        </ChatLayout>
        <MessageInput 
          onSendMessage={handleSendMessage}
          isActive={true}
        />
      </div>
    );
  }

  return (
    <ChatLayout>
      <WelcomeText username="Username" />
      <MessageInput onSendMessage={handleSendMessage} />
    </ChatLayout>
  );
};

export default ChatWelcome;