import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

interface ChatMessageProps {
  message: string;
  isUser?: boolean;
  timestamp?: Date;
  isStreaming?: boolean;
}



const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  isUser = false,
  timestamp,
  isStreaming = false
}) => {
  console.log('💬 [DEBUG] ChatMessage rendering:');
  console.log('  - messageType:', isUser ? 'USER' : 'AI');
  console.log('  - messageContent:', message);
  console.log('  - messageLength:', message?.length || 0);
  console.log('  - messageType_check:', typeof message);
  console.log('  - isStreaming:', isStreaming);
  console.log('  - timestamp:', timestamp?.toISOString());
  
  // Additional safety check
  if (message === undefined || message === null) {
    console.error('❌ [ERROR] Message is null or undefined!');
    return null;
  }
  
  if (typeof message !== 'string') {
    console.error('❌ [ERROR] Message is not a string:', typeof message, message);
    return null;
  }
  if (isUser) {
    // User message: Sleek bubble on the right
    return (
      <div className="mb-6 animate-slide-up flex justify-end w-full">
        <div className="max-w-[85%] sm:max-w-[75%] md:max-w-[65%] lg:max-w-[55%] xl:max-w-[50%]">
          <div className="bg-olive-dark text-white rounded-2xl rounded-br-md px-4 sm:px-6 py-3 shadow-lg font-cabinet font-medium ml-auto">
            <div className="text-sm leading-relaxed whitespace-pre-wrap antialiased break-words">
              {message}
            </div>
          </div>
          {timestamp && (
            <div className="text-xs text-gray-500 mt-1 text-right pr-1">
              {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // AI message: Wide markdown text without bubble (ChatGPT style)
  return (
    <div className="mb-8 animate-slide-up w-full">
      <div className="w-full max-w-[95%] sm:max-w-[90%] md:max-w-[85%] lg:max-w-[80%] xl:max-w-[75%] pl-2 sm:pl-4">
        <div className="text-gray-100 font-cabinet leading-relaxed text-sm antialiased break-words">
          {message.trim() ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
            >
              {message}
            </ReactMarkdown>
          ) : (
            <span className="text-gray-500 italic">Generating response...</span>
          )}
        </div>
        {isStreaming && (
          <div className="inline-flex items-center mt-2">
            <div className="w-2 h-2 bg-olive rounded-full animate-pulse mr-1"></div>
            <div className="w-2 h-2 bg-olive rounded-full animate-pulse mr-1" style={{ animationDelay: '200ms' }}></div>
            <div className="w-2 h-2 bg-olive rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></div>
          </div>
        )}
        {timestamp && !isStreaming && (
          <div className="text-xs text-gray-500 mt-2 pl-1">
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;