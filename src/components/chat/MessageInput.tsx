import React, { useState } from 'react';
import { Plus, Lightbulb, Send } from 'lucide-react';

interface MessageInputProps {
  onSendMessage?: (message: string) => void;
  placeholder?: string;
  isActive?: boolean;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage, 
  placeholder = "How can i help you ?",
  isActive = false,
  disabled = false
}) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && onSendMessage && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !disabled) {
      e.preventDefault();
      handleSend();
    }
  };

  // Active chat mode - bottom positioned input (responsive)
  if (isActive) {
    return (
      <div className="w-full bg-background/95 backdrop-blur-sm border-t border-gray-800/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Left Add Button */}
            <div className="w-10 h-10 bg-charcoal rounded-full shadow-[0px_4px_15px_rgba(0,0,0,0.65)] flex items-center justify-center">
              <button className="w-full h-full flex items-center justify-center hover:bg-charcoal-light transition-colors rounded-full">
                <Plus size={16} className="text-text-secondary" />
              </button>
            </div>
            
            {/* Text Input Container */}
            <div className="flex-1 h-10 sm:h-12 bg-charcoal/90 backdrop-blur-sm rounded-2xl shadow-[0px_4px_15px_rgba(0,0,0,0.65)] px-4 sm:px-6 flex items-center border border-gray-700/30 focus-within:border-olive/50 transition-colors duration-200">
              <input
                type="text"
                placeholder={disabled ? "Sending..." : placeholder}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={disabled}
                className="w-full bg-transparent text-text-primary placeholder:text-text-muted text-sm border-none outline-none focus:ring-0 font-cabinet antialiased disabled:opacity-50"
              />
            </div>
            
            {/* Right Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
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
                  disabled={disabled}
                  className="w-full h-full flex items-center justify-center hover:bg-olive hover:shadow-olive-glow transition-all duration-200 rounded-full group disabled:opacity-50 disabled:hover:bg-charcoal disabled:hover:shadow-none"
                >
                  <Send size={16} className="text-olive group-hover:text-charcoal" style={{color: '#C6D86E'}} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Welcome mode - centered input (responsive)
  return (
    <div className="w-full max-w-2xl px-4 sm:px-6">
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Left Add Button - Outside */}
        <div className="w-10 h-10 bg-charcoal rounded-full shadow-[0px_4px_15px_rgba(0,0,0,0.65)] flex items-center justify-center">
          <button className="w-full h-full flex items-center justify-center hover:bg-charcoal-light transition-colors rounded-full">
            <Plus size={18} className="text-text-secondary" />
          </button>
        </div>
        
        {/* Text Input Container - Center */}
        <div className="flex-1 h-10 bg-charcoal/90 backdrop-blur-sm rounded-2xl shadow-[0px_4px_15px_rgba(0,0,0,0.65)] px-4 sm:px-6 flex items-center border border-gray-700/30 focus-within:border-olive/50 transition-all duration-200">
          <input
            type="text"
            placeholder={disabled ? "Sending..." : placeholder}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={disabled}
            className="w-full bg-transparent text-text-primary placeholder:text-text-muted text-sm border-none outline-none focus:ring-0 font-cabinet antialiased disabled:opacity-50"
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
              disabled={disabled}
              className="w-full h-full flex items-center justify-center hover:bg-olive hover:shadow-olive-glow transition-all duration-200 rounded-full group disabled:opacity-50 disabled:hover:bg-charcoal disabled:hover:shadow-none"
            >
              <Send size={16} className="text-olive group-hover:text-charcoal" style={{color: '#C6D86E'}} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;