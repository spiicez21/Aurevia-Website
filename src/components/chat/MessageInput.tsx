import React, { useState } from 'react';
import { Plus, Lightbulb, Send } from 'lucide-react';

interface MessageInputProps {
  onSendMessage?: (message: string) => void;
  placeholder?: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage, 
  placeholder = "How can i help you ?" 
}) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && onSendMessage) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="flex items-center gap-3">
        {/* Left Add Button - Outside */}
        <div className="w-10 h-10 bg-charcoal rounded-full shadow-[0px_4px_15px_rgba(0,0,0,0.65)] flex items-center justify-center">
          <button className="w-full h-full flex items-center justify-center hover:bg-charcoal-light transition-colors rounded-full">
            <Plus size={18} className="text-text-secondary" />
          </button>
        </div>
        
        {/* Text Input Container - Center */}
        <div className="flex-1 h-10 bg-charcoal rounded-2xl shadow-[0px_4px_15px_rgba(0,0,0,0.65)] px-6 flex items-center">
          <input
            type="text"
            placeholder={placeholder}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full bg-transparent text-text-primary placeholder:text-text-muted text-sm border-none outline-none focus:ring-0"
          />
        </div>
        
        {/* Right Action Buttons - Outside */}
        <div className="flex items-center gap-2">
          {/* Lightbulb Button */}
          <div className="w-10 h-10 bg-charcoal rounded-full shadow-[0px_4px_15px_rgba(0,0,0,0.65)] flex items-center justify-center">
            <button className="w-full h-full flex items-center justify-center hover:bg-charcoal-light transition-colors rounded-full">
              <Lightbulb size={16} className="text-text-secondary" />
            </button>
          </div>
          
          {/* Send Button */}
          <div className="w-10 h-10 bg-charcoal rounded-full shadow-[0px_4px_15px_rgba(0,0,0,0.65)] flex items-center justify-center">
            <button 
              onClick={handleSend}
              className="w-full h-full flex items-center justify-center hover:bg-olive hover:shadow-olive-glow transition-all duration-200 rounded-full group"
            >
              <Send size={16} className="text-olive group-hover:text-charcoal" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;