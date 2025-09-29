import React from 'react';

interface ChatMessageProps {
  message: string;
  isUser?: boolean;
  timestamp?: Date;
  isStreaming?: boolean;
}

// Simple markdown renderer for basic formatting
const renderMarkdown = (text: string) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
    .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
    .replace(/`(.*?)`/g, '<code class="bg-gray-800 px-1 py-0.5 rounded text-sm font-mono">$1</code>') // Inline code
    .replace(/^• (.+)$/gm, '<li class="ml-4">$1</li>') // Bullet points
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4">$1</li>') // Numbered lists
    .replace(/\n/g, '<br>') // Line breaks
};

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  isUser = false,
  timestamp,
  isStreaming = false
}) => {
  if (isUser) {
    // User message: Sleek bubble on the right
    return (
      <div className="mb-6 animate-slide-up flex justify-end pr-4">
        <div className="max-w-[65%]">
          <div className="bg-olive/90 text-white rounded-2xl px-6 py-3 shadow-lg font-cabinet font-medium">
            <div className="text-sm leading-relaxed whitespace-pre-wrap antialiased">
              {message}
            </div>
          </div>
          {timestamp && (
            <div className="text-xs text-gray-500 mt-1 text-right">
              {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // AI message: Wide markdown text without bubble (ChatGPT style)
  return (
    <div className="mb-8 animate-slide-up pl-4">
      <div className="w-full max-w-none pr-16">
        <div 
          className="text-gray-100 font-cabinet leading-relaxed text-sm antialiased"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(message) }}
        />
        {isStreaming && (
          <div className="inline-flex items-center mt-2">
            <div className="w-2 h-2 bg-olive rounded-full animate-pulse mr-1"></div>
            <div className="w-2 h-2 bg-olive rounded-full animate-pulse mr-1" style={{ animationDelay: '200ms' }}></div>
            <div className="w-2 h-2 bg-olive rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></div>
          </div>
        )}
        {timestamp && !isStreaming && (
          <div className="text-xs text-gray-500 mt-2">
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;