import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Plus, MessageCircle, User, X } from 'lucide-react';
import ChatHistory from './ChatHistory';
import ProfilePopup from './ProfilePopup';
import apiService from '../../services/apiService';

interface SidebarProps {
  currentChatId?: string;
  onSelectChat?: (chatId: string) => void;
  onNewChat?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentChatId, onSelectChat, onNewChat }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

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
    <>
      <div className="absolute left-4 top-4 z-10 animate-fade-in">
        <div className="flex flex-col gap-2">
          {/* Menu Toggle — expands sidebar labels */}
          <div className={`bg-surface/90 backdrop-blur-sm rounded-md shadow-[0px_4px_15px_rgba(0,0,0,0.4)] flex items-center border border-gray-700/30 hover:border-gray-600/50 transition-all duration-200 ${isExpanded ? 'px-2' : ''}`}>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-10 h-10 flex items-center justify-center hover:bg-surface-hover transition-colors rounded-md group shrink-0"
            >
              {isExpanded
                ? <X size={16} className="text-olive transition-colors duration-200" />
                : <Menu size={16} className="text-text-secondary group-hover:text-white transition-colors duration-200" />
              }
            </button>
            {isExpanded && (
              <span className="text-[11px] text-text-secondary font-cabinet font-medium pr-3 whitespace-nowrap">Menu</span>
            )}
          </div>

          {/* Chat Actions */}
          <div className={`bg-surface/90 backdrop-blur-sm rounded-md shadow-[0px_4px_15px_rgba(0,0,0,0.4)] flex flex-col border border-gray-700/30 hover:border-gray-600/50 transition-all duration-200 ${isExpanded ? 'px-2 py-1' : 'p-2'}`}>
            {/* New Chat */}
            <button
              onClick={handleNewChat}
              className={`flex items-center gap-2.5 hover:text-olive transition-all duration-200 group ${isExpanded ? 'h-9 px-1' : 'w-6 h-6 justify-center hover:scale-110 mx-auto mb-1'}`}
              title="New chat"
            >
              <Plus size={16} className="text-text-secondary group-hover:text-olive transition-colors duration-200 shrink-0" />
              {isExpanded && (
                <span className="text-[11px] text-text-secondary group-hover:text-olive font-cabinet font-medium whitespace-nowrap">New Chat</span>
              )}
            </button>

            {/* Chat History Toggle */}
            <button
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
              className={`flex items-center gap-2.5 hover:text-olive transition-all duration-200 group ${isExpanded ? 'h-9 px-1' : 'w-6 h-6 justify-center hover:scale-110 mx-auto mt-1'}`}
              title="Chat history"
            >
              <MessageCircle size={16} className={`transition-colors duration-200 shrink-0 ${isHistoryOpen ? 'text-olive' : 'text-text-secondary group-hover:text-olive'}`} />
              {isExpanded && (
                <span className={`text-[11px] font-cabinet font-medium whitespace-nowrap ${isHistoryOpen ? 'text-olive' : 'text-text-secondary group-hover:text-olive'}`}>History</span>
              )}
            </button>
          </div>

          {/* Profile */}
          <div className={`bg-surface/90 backdrop-blur-sm rounded-full shadow-[0px_4px_15px_rgba(0,0,0,0.4)] flex items-center border border-gray-700/30 hover:border-olive/50 transition-all duration-200 ${isExpanded ? 'rounded-md px-2' : ''}`}>
            <button
              onClick={() => setIsProfileOpen(true)}
              className={`flex items-center gap-2.5 group ${isExpanded ? 'h-10 px-1' : 'w-10 h-10 justify-center'}`}
              title="Profile"
            >
              <User size={16} style={{ color: '#C6D86E' }} className="shrink-0" />
              {isExpanded && (
                <span className="text-[11px] font-cabinet font-medium whitespace-nowrap" style={{ color: '#C6D86E' }}>Profile</span>
              )}
            </button>
          </div>
        </div>

        {/* Chat History box — to the right */}
        <div className={`absolute top-0 ${isExpanded ? 'left-36' : 'left-14'} transition-all duration-200`}>
          <ChatHistory
            isOpen={isHistoryOpen}
            currentChatId={currentChatId}
            onSelectChat={onSelectChat}
          />
        </div>
      </div>

      {/* Profile Popup */}
      <ProfilePopup isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </>
  );
};

export default Sidebar;