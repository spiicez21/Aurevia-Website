import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Trash2, Pin } from 'lucide-react';
import apiService from '../../services/apiService';

interface ChatItem {
    id: string;
    title: string;
    is_pinned: boolean;
    last_message_at: string;
    created_at: string;
    message_count: number;
}

interface ChatHistoryProps {
    isOpen: boolean;
    currentChatId?: string;
    onSelectChat?: (chatId: string) => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({
    isOpen,
    currentChatId,
    onSelectChat,
}) => {
    const navigate = useNavigate();
    const [chats, setChats] = useState<ChatItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadChats = async () => {
        setIsLoading(true);
        try {
            const response = await apiService.getChats(50);
            setChats(response.data?.chats || []);
        } catch (err) {
            console.error('Failed to load chats:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            loadChats();
        }
    }, [isOpen]);

    const handleSelectChat = (chatId: string) => {
        if (onSelectChat) {
            onSelectChat(chatId);
        } else {
            navigate(`/chat?id=${chatId}`);
        }
    };

    const handleDeleteChat = async (e: React.MouseEvent, chatId: string) => {
        e.stopPropagation();
        try {
            await apiService.deleteChat(chatId);
            setChats(prev => prev.filter(c => c.id !== chatId));
        } catch (err) {
            console.error('Failed to delete chat:', err);
        }
    };

    const formatTimestamp = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m`;
        if (diffHours < 24) return `${diffHours}h`;
        if (diffDays < 7) return `${diffDays}d`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    if (!isOpen) return null;

    return (
        <div className="w-52 bg-surface/90 backdrop-blur-sm rounded-md shadow-[0px_4px_15px_rgba(0,0,0,0.4)] border border-gray-700/30 overflow-hidden animate-fade-in">
            {/* Chat List */}
            <div className="overflow-y-auto max-h-[50vh] scrollbar-thin">
                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="w-4 h-4 border-2 border-olive/30 border-t-olive rounded-full animate-spin" />
                    </div>
                ) : chats.length === 0 ? (
                    <div className="text-center py-6 px-3">
                        <MessageCircle size={20} className="text-gray-600 mx-auto mb-2" />
                        <p className="text-[10px] text-text-muted font-cabinet">No chats yet</p>
                    </div>
                ) : (
                    <div className="p-1">
                        {chats.map((chat) => (
                            <div
                                key={chat.id}
                                onClick={() => handleSelectChat(chat.id)}
                                className={`group relative px-2.5 py-2 rounded-md cursor-pointer transition-all duration-150 ${currentChatId === chat.id
                                    ? 'bg-olive/10 border border-olive/20'
                                    : 'hover:bg-charcoal/40 border border-transparent'
                                    }`}
                            >
                                <div className="flex items-center justify-between gap-1.5">
                                    <p className={`text-[11px] font-cabinet font-medium truncate flex-1 ${currentChatId === chat.id ? 'text-olive' : 'text-text-primary'
                                        }`}>
                                        {chat.is_pinned && <Pin size={9} className="inline mr-1 text-olive" />}
                                        {chat.title}
                                    </p>
                                    <button
                                        onClick={(e) => handleDeleteChat(e, chat.id)}
                                        className="opacity-0 group-hover:opacity-100 w-5 h-5 flex items-center justify-center rounded hover:bg-red-900/30 transition-all duration-150 shrink-0"
                                        title="Delete"
                                    >
                                        <Trash2 size={10} className="text-text-muted hover:text-red-400" />
                                    </button>
                                </div>
                                <p className="text-[9px] text-text-muted font-cabinet mt-0.5">
                                    {formatTimestamp(chat.last_message_at || chat.created_at)} · {chat.message_count || 0} msgs
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatHistory;
