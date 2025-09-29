import React from 'react';
import { Menu, Plus, MessageCircle, User } from 'lucide-react';

const Sidebar: React.FC = () => {
  return (
    <div className="absolute left-4 top-4 flex flex-col gap-2 z-10">
      {/* Top Menu Button - Individual Module */}
      <div className="w-10 h-10 bg-surface rounded-md shadow-[0px_4px_13px_rgba(0,0,0,0.3)] flex items-center justify-center">
        <button className="w-full h-full flex items-center justify-center hover:bg-surface-hover transition-colors rounded-md">
          <Menu size={16} className="text-text-secondary" />
        </button>
      </div>
      
      {/* Chat Module - Grouped */}
      <div className="bg-surface rounded-md shadow-[0px_4px_13px_rgba(0,0,0,0.3)] p-2 flex flex-col gap-3">
        {/* Add/Plus Button */}
        <button className="w-6 h-6 flex items-center justify-center hover:text-olive transition-colors">
          <Plus size={16} className="text-text-secondary" />
        </button>
        
        {/* Message/Communication Button */}
        <button className="w-6 h-6 flex items-center justify-center hover:text-olive transition-colors">
          <MessageCircle size={16} className="text-text-secondary" />
        </button>
      </div>
      
      {/* User Profile Button - Individual Module */}
      <div className="w-10 h-10 bg-surface rounded-full shadow-[0px_4px_13px_rgba(0,0,0,0.3)] flex items-center justify-center">
        <button className="w-full h-full flex items-center justify-center hover:bg-surface-hover transition-colors rounded-full">
          <User size={16} className="text-olive" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;