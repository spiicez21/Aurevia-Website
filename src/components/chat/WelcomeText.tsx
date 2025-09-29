import React from 'react';

interface WelcomeTextProps {
  username?: string;
}

const WelcomeText: React.FC<WelcomeTextProps> = ({ username = "Username" }) => {
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