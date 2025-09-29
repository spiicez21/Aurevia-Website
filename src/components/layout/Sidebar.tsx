import React from 'react';
import { Menu, Plus, MessageCircle, User } from 'lucide-react';

const Sidebar: React.FC = () => {
  return (
    <div className="absolute left-4 top-4 flex flex-col gap-2 z-10 animate-fade-in">
      {/* Top Menu Button - Individual Module */}
      <div className="w-10 h-10 bg-surface/90 backdrop-blur-sm rounded-md shadow-[0px_4px_15px_rgba(0,0,0,0.4)] flex items-center justify-center border border-gray-700/30 hover:border-gray-600/50 transition-all duration-200">
        <button className="w-full h-full flex items-center justify-center hover:bg-surface-hover transition-colors rounded-md group">
          <Menu size={16} className="text-text-secondary group-hover:text-white transition-colors duration-200" />
        </button>
      </div>
      
      {/* Chat Module - Grouped */}
      <div className="bg-surface/90 backdrop-blur-sm rounded-md shadow-[0px_4px_15px_rgba(0,0,0,0.4)] p-2 flex flex-col gap-3 border border-gray-700/30 hover:border-gray-600/50 transition-all duration-200">
        {/* Add/Plus Button */}
        <button className="w-6 h-6 flex items-center justify-center hover:text-olive transition-all duration-200 hover:scale-110 group">
          <Plus size={16} className="text-text-secondary group-hover:text-olive transition-colors duration-200" />
        </button>
        
        {/* Message/Communication Button */}
        <button className="w-6 h-6 flex items-center justify-center hover:text-olive transition-all duration-200 hover:scale-110 group">
          <MessageCircle size={16} className="text-text-secondary group-hover:text-olive transition-colors duration-200" />
        </button>
      </div>
      
      {/* User Profile Button - Individual Module */}
      <div className="w-10 h-10 bg-surface/90 backdrop-blur-sm rounded-full shadow-[0px_4px_15px_rgba(0,0,0,0.4)] flex items-center justify-center border border-gray-700/30 hover:border-olive/50 transition-all duration-200">
        <button className="w-full h-full flex items-center justify-center hover:bg-surface-hover transition-colors rounded-full group">
          <User size={16} className="text-olive group-hover:text-olive-400 transition-colors duration-200" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;