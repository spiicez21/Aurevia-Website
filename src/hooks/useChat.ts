import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/apiService';

export interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export const useChat = () => {
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [chatHistory, setChatHistory] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load chat history from API
  const loadChatHistory = useCallback(async () => {
    try {
      const response = await apiService.getChats(20);
      if (response.success && response.data) {
        setChatHistory(response.data);
      }
    } catch (err) {
      console.warn('Could not load chat history:', err);
      // Don't set error state for this, as user might not be logged in
    }
  }, []);

  // Handle streaming response from AI
  const handleStreamingResponse = useCallback(async (chatId: string, message: string) => {
    try {
      const response = await apiService.sendStreamingMessage(chatId, message);
      const reader = response.body?.getReader();
      
      if (!reader) {
        throw new Error('Streaming not supported');
      }

      const decoder = new TextDecoder();
      const streamingMessage: Message = {
        id: `streaming-${Date.now()}`,
        content: '',
        isBot: true,
        timestamp: new Date(),
        isStreaming: true,
      };

      // Add streaming message placeholder
      setCurrentChat(prev => prev ? {
        ...prev,
        messages: [...prev.messages, streamingMessage],
      } : null);

      let buffer = '';
      
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.content) {
                streamingMessage.content += data.content;
                
                // Update the streaming message
                setCurrentChat(prev => {
                  if (!prev) return null;
                  
                  const messages = [...prev.messages];
                  const lastIndex = messages.length - 1;
                  
                  if (messages[lastIndex]?.id === streamingMessage.id) {
                    messages[lastIndex] = { ...streamingMessage };
                  }
                  
                  return { ...prev, messages };
                });
              }
              
              if (data.done) {
                // Mark streaming as complete
                streamingMessage.isStreaming = false;
                streamingMessage.id = data.messageId || streamingMessage.id;
                
                setCurrentChat(prev => {
                  if (!prev) return null;
                  
                  const messages = [...prev.messages];
                  const lastIndex = messages.length - 1;
                  
                  if (messages[lastIndex]?.isStreaming) {
                    messages[lastIndex] = { ...streamingMessage };
                  }
                  
                  return { ...prev, messages };
                });
                break;
              }
            } catch (parseError) {
              console.warn('Failed to parse streaming data:', parseError);
            }
          }
        }
      }
    } catch (err) {
      console.error('Streaming error:', err);
      // Fallback to regular message sending
      const response = await apiService.sendMessage(chatId, message, false);
      if (response.success && response.data) {
        const botMessage: Message = {
          id: response.data._id,
          content: response.data.content,
          isBot: true,
          timestamp: new Date(response.data.createdAt),
        };

        setCurrentChat(prev => {
          if (!prev) return null;
          
          // Replace the streaming message with the final response
          const messages = [...prev.messages];
          const lastIndex = messages.length - 1;
          
          if (messages[lastIndex]?.isStreaming) {
            messages[lastIndex] = botMessage;
          } else {
            messages.push(botMessage);
          }
          
          return { ...prev, messages };
        });
      }
    }
  }, []);

  // Load chat history on mount
  useEffect(() => {
    loadChatHistory();
  }, [loadChatHistory]);

  // Create a new chat
  const createNewChat = useCallback(async (firstMessage?: string) => {
    try {
      setError(null);
      const title = firstMessage 
        ? `${firstMessage.substring(0, 50)}${firstMessage.length > 50 ? '...' : ''}`
        : 'New Chat';
      
      const response = await apiService.createChat({ title });
      
      if (response.success && response.data) {
        const newChat: Chat = {
          id: response.data._id,
          title: response.data.title,
          messages: [],
          createdAt: new Date(response.data.createdAt),
          updatedAt: new Date(response.data.updatedAt),
        };
        
        setCurrentChat(newChat);
        setChatHistory(prev => [newChat, ...prev]);
        return newChat;
      } else {
        throw new Error('Failed to create chat');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create chat';
      setError(errorMessage);
      console.error('Error creating chat:', err);
      return null;
    }
  }, []);

  // Send a message and get AI response
  const sendMessage = useCallback(async (content: string, stream = true) => {
    if (!currentChat) {
      const newChat = await createNewChat(content);
      if (!newChat) return;
    }

    const chatToUse = currentChat!;
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isBot: false,
      timestamp: new Date(),
    };

    // Add user message immediately
    setCurrentChat(prev => prev ? {
      ...prev,
      messages: [...prev.messages, userMessage],
    } : null);

    try {
      setIsLoading(true);
      setError(null);

      if (stream) {
        // Handle streaming response
        await handleStreamingResponse(chatToUse.id, content);
      } else {
        // Handle regular response
        const response = await apiService.sendMessage(chatToUse.id, content, false);
        if (response.success && response.data) {
          const botMessage: Message = {
            id: response.data._id,
            content: response.data.content,
            isBot: true,
            timestamp: new Date(response.data.createdAt),
          };

          setCurrentChat(prev => prev ? {
            ...prev,
            messages: [...prev.messages, botMessage],
          } : null);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      console.error('Error sending message:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentChat, createNewChat, handleStreamingResponse]);

  // Load a specific chat
  const loadChat = useCallback(async (chatId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.getChat(chatId);
      if (response.success && response.data) {
        const chat: Chat = {
          id: response.data._id,
          title: response.data.title,
          messages: response.data.messages.map((msg: { _id: string; content: string; sender: string; createdAt: string }) => ({
            id: msg._id,
            content: msg.content,
            isBot: msg.sender === 'assistant',
            timestamp: new Date(msg.createdAt),
          })),
          createdAt: new Date(response.data.createdAt),
          updatedAt: new Date(response.data.updatedAt),
        };
        
        setCurrentChat(chat);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load chat';
      setError(errorMessage);
      console.error('Error loading chat:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Clear current chat
  const clearChat = useCallback(() => {
    setCurrentChat(null);
    setError(null);
  }, []);

  return {
    currentChat,
    chatHistory,
    isLoading,
    error,
    sendMessage,
    createNewChat,
    loadChat,
    clearChat,
    loadChatHistory,
  };
};