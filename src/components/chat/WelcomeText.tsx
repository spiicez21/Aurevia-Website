import React from 'react';

interface WelcomeTextProps {
  username?: string;
  chatTitle?: string;
  isActive?: boolean;
}

const WelcomeText: React.FC<WelcomeTextProps> = ({ 
  username = "Username", 
  chatTitle,
  isActive = false 
}) => {
  if (isActive && chatTitle) {
    return (
      <div className="text-center py-4 mb-6 animate-fade-in">
        <h1 className="text-xl md:text-2xl font-cabinet text-olive font-medium tracking-wide">
          {chatTitle}
        </h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mb-16">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-center">
        <span className="font-cabinet text-text-secondary">Hey, </span>
        <span className="font-zodiak text-olive">{username} !</span>
      </h1>
    </div>
  );
};

export default WelcomeText;