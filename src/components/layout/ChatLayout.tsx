import React from 'react';
import Sidebar from './Sidebar';

interface ChatLayoutProps {
  children: React.ReactNode;
}

const ChatLayout: React.FC<ChatLayoutProps> = ({ children }) => {
  return (
    <div className="relative w-full min-h-screen bg-bg-primary">
      <Sidebar />
      <main className="flex flex-col justify-center items-center w-full min-h-screen px-8">
        {children}
      </main>
    </div>
  );
};

export default ChatLayout;