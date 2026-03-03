import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Plus, MessageCircle, User, X } from 'lucide-react';
import ChatHistory from './ChatHistory';
import apiService from '../../services/apiService';

interface SidebarProps {
  currentChatId?: string;
  onSelectChat?: (chatId: string) => void;
  onNewChat?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentChatId, onSelectChat, onNewChat }) => {
  const navigate = useNavigate();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const handleNewChat = async () => {
    if (onNewChat) {
      onNewChat();
      return;
    }
    try {
      const response = await apiService.createChat({ title: 'New Chat' });
      const chatId = response.data?.chat?.id;
      if (chatId) {
        navigate(`/chat?id=${chatId}`);
      } else {
        navigate('/chat');
      }
    } catch {
      navigate('/chat');
    }
  };

  return (
    <div className="absolute left-4 top-4 z-10 animate-fade-in">
      {/* Sidebar icon strip */}
      <div className="flex flex-col gap-2">
        {/* Menu Toggle */}
        <div className="w-10 h-10 bg-surface/90 backdrop-blur-sm rounded-md shadow-[0px_4px_15px_rgba(0,0,0,0.4)] flex items-center justify-center border border-gray-700/30 hover:border-gray-600/50 transition-all duration-200">
          <button
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            className="w-full h-full flex items-center justify-center hover:bg-surface-hover transition-colors rounded-md group"
          >
            {isHistoryOpen
              ? <X size={16} className="text-olive transition-colors duration-200" />
              : <Menu size={16} className="text-text-secondary group-hover:text-white transition-colors duration-200" />
            }
          </button>
        </div>

        {/* Chat Actions */}
        <div className="bg-surface/90 backdrop-blur-sm rounded-md shadow-[0px_4px_15px_rgba(0,0,0,0.4)] p-2 flex flex-col gap-3 border border-gray-700/30 hover:border-gray-600/50 transition-all duration-200">
          <button
            onClick={handleNewChat}
            className="w-6 h-6 flex items-center justify-center hover:text-olive transition-all duration-200 hover:scale-110 group"
            title="New chat"
          >
            <Plus size={16} className="text-text-secondary group-hover:text-olive transition-colors duration-200" />
          </button>

          <button
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            className="w-6 h-6 flex items-center justify-center hover:text-olive transition-all duration-200 hover:scale-110 group"
            title="Chat history"
          >
            <MessageCircle size={16} className={`transition-colors duration-200 ${isHistoryOpen ? 'text-olive' : 'text-text-secondary group-hover:text-olive'}`} />
          </button>
        </div>

        {/* Profile */}
        <Link
          to="/profile"
          className="w-10 h-10 bg-surface/90 backdrop-blur-sm rounded-full shadow-[0px_4px_15px_rgba(0,0,0,0.4)] flex items-center justify-center border border-gray-700/30 hover:border-olive/50 transition-all duration-200 group"
          title="Profile"
        >
          <User size={16} className="text-olive group-hover:text-olive transition-colors duration-200" style={{ color: '#C6D86E' }} />
        </Link>
      </div>

      {/* Chat History — positioned to the right of the icon strip */}
      <div className="absolute left-14 top-0">
        <ChatHistory
          isOpen={isHistoryOpen}
          currentChatId={currentChatId}
          onSelectChat={onSelectChat}
        />
      </div>
    </div>
  );
};

export default Sidebar;