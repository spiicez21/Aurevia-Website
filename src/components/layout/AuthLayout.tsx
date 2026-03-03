import React from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="relative w-full min-h-screen bg-bg-primary flex items-center justify-center px-4 sm:px-6">
      {/* Subtle background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-olive/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-md animate-fade-in">
        {/* Branding */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-block">
            <h1 className="text-4xl sm:text-5xl font-zodiak tracking-wide">
              Aurevia
            </h1>
          </Link>
        </div>

        {/* Auth Card */}
        <div className="bg-surface/90 backdrop-blur-sm rounded-2xl shadow-[0px_8px_30px_rgba(0,0,0,0.5)] border border-gray-700/30 p-8 sm:p-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
