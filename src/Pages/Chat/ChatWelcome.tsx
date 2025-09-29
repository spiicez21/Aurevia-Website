import React from 'react';
import ChatLayout from '../../components/layout/ChatLayout';
import WelcomeText from '../../components/chat/WelcomeText';
import MessageInput from '../../components/chat/MessageInput';

const ChatWelcome: React.FC = () => {
  const handleSendMessage = (message: string) => {
    console.log('Message sent:', message);
    // TODO: Implement message sending logic
  };

  return (
    <ChatLayout>
      <WelcomeText username="Username" />
      <MessageInput onSendMessage={handleSendMessage} />
    </ChatLayout>
  );
};

export default ChatWelcome;