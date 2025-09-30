import { body, param, query, validationResult } from 'express-validator';
import { Chat, Message, User } from '../models/index.js';
import { ollamaService } from '../services/index.js';
import { asyncHandler } from '../middleware/index.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Create new chat
 */
export const createChat = [
  // Validation rules
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  
  body('settings.temperature')
    .optional()
    .isFloat({ min: 0, max: 1 })
    .withMessage('Temperature must be between 0 and 1'),
  
  body('settings.maxTokens')
    .optional()
    .isInt({ min: 1, max: 4096 })
    .withMessage('Max tokens must be between 1 and 4096'),

  // Controller function
  asyncHandler(async (req, res) => {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        errors: errors.array()
      });
    }

    const { title, description, settings } = req.body;

    // Handle both authenticated and anonymous users
    let userId = req.user?._id;
    
    if (!userId) {
      // Create or find guest user
      let guestId = req.headers['x-guest-id'];
      if (!guestId) {
        guestId = `guest_${uuidv4()}`;
      }
      
      // For anonymous users, use a special guest identifier
      userId = guestId;
    }

    const chat = new Chat({
      user: userId,
      title,
      description,
      isGuest: !req.user,
      guestId: !req.user ? userId : undefined,
      settings: {
        ...settings,
        model: 'gemma2:2b'
      }
    });

    await chat.save();

    res.status(201).json({
      success: true,
      message: 'Chat created successfully',
      data: {
        chat,
        ...(chat.isGuest && { guestId: chat.guestId })
      }
    });
  })
];

/**
 * Get user's chats
 */
export const getChats = [
  // Validation rules
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('pinned')
    .optional()
    .isBoolean()
    .withMessage('Pinned must be a boolean'),

  // Controller function
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        errors: errors.array()
      });
    }

    const { limit, pinned } = req.query;
    const options = {
      limit: parseInt(limit) || 50,
      ...(pinned !== undefined && { pinned: pinned === 'true' })
    };

    // Handle both authenticated and anonymous users
    let userId = req.user?._id;
    let isGuest = false;
    
    if (!userId) {
      const guestId = req.headers['x-guest-id'];
      if (!guestId) {
        return res.json({
          success: true,
          data: {
            chats: [],
            count: 0
          }
        });
      }
      userId = guestId;
      isGuest = true;
    }

    const chats = isGuest 
      ? await Chat.find({ guestId: userId, isActive: true }).sort({ updatedAt: -1 }).limit(options.limit)
      : await Chat.findUserChats(userId, options);

    res.json({
      success: true,
      data: {
        chats,
        count: chats.length
      }
    });
  })
];

/**
 * Get single chat with messages
 */
export const getChat = [
  // Validation rules
  param('chatId')
    .isMongoId()
    .withMessage('Invalid chat ID'),
  
  query('messageLimit')
    .optional()
    .isInt({ min: 1, max: 200 })
    .withMessage('Message limit must be between 1 and 200'),

  // Controller function
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        errors: errors.array()
      });
    }

    const { chatId } = req.params;
    const { messageLimit } = req.query;

    // Handle both authenticated and anonymous users
    let userId = req.user?._id;
    let isGuest = false;
    
    if (!userId) {
      const guestId = req.headers['x-guest-id'];
      if (!guestId) {
        return res.status(404).json({
          success: false,
          message: 'Chat not found',
          code: 'CHAT_NOT_FOUND'
        });
      }
      userId = guestId;
      isGuest = true;
    }

    const chat = isGuest
      ? await Chat.findOne({ _id: chatId, guestId: userId, isActive: true }).populate({
          path: 'messages',
          options: { 
            sort: { createdAt: -1 },
            limit: parseInt(messageLimit) || 50
          }
        })
      : await Chat.findChatWithMessages(
          chatId, 
          userId, 
          parseInt(messageLimit) || 50
        );

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found',
        code: 'CHAT_NOT_FOUND'
      });
    }

    // Reverse messages to show chronological order
    if (chat.messages) {
      chat.messages.reverse();
    }

    res.json({
      success: true,
      data: {
        chat
      }
    });
  })
];

/**
 * Send message to chat
 */
export const sendMessage = [
  // Validation rules
  param('chatId')
    .isMongoId()
    .withMessage('Invalid chat ID'),
  
  body('content')
    .trim()
    .isLength({ min: 1, max: 10000 })
    .withMessage('Message content must be between 1 and 10000 characters'),
  
  body('stream')
    .optional()
    .isBoolean()
    .withMessage('Stream must be a boolean'),

  // Controller function
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        errors: errors.array()
      });
    }

    const { chatId } = req.params;
    const { content, stream = false } = req.body;

    // Handle both authenticated and anonymous users
    let userId = req.user?._id;
    let isGuest = false;
    
    if (!userId) {
      const guestId = req.headers['x-guest-id'];
      if (!guestId) {
        return res.status(401).json({
          success: false,
          message: 'Guest ID required for anonymous users',
          code: 'GUEST_ID_REQUIRED'
        });
      }
      userId = guestId;
      isGuest = true;
    }

    // Verify chat exists and belongs to user/guest
    const chat = isGuest
      ? await Chat.findOne({ _id: chatId, guestId: userId, isActive: true })
      : await Chat.findOne({ _id: chatId, user: userId, isActive: true });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found',
        code: 'CHAT_NOT_FOUND'
      });
    }

    // Create user message
    const userMessage = new Message({
      chat: chatId,
      user: userId,
      content,
      role: 'user',
      isGuest: isGuest
    });

    await userMessage.save();

    try {
      // Get conversation context
      const conversationHistory = await Message.getConversationContext(chatId, 10);
      
      // Format messages for Ollama
      const messages = conversationHistory
        .reverse()
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));

      if (stream) {
        // Set up Server-Sent Events
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Cache-Control'
        });

        let assistantContent = '';
        const startTime = Date.now();

        try {
          // Create assistant message with pending status
          const assistantMessage = new Message({
            chat: chatId,
            user: userId,
            content: '',
            role: 'assistant',
            status: 'processing',
            isGuest: isGuest,
            metadata: {
              model: chat.settings.model,
              temperature: chat.settings.temperature
            }
          });

          await assistantMessage.save();

          // Send initial message info
          res.write(`data: ${JSON.stringify({
            type: 'message_start',
            messageId: assistantMessage._id
          })}\n\n`);

          // Generate streaming response
          const streamOptions = {
            model: chat.settings.model,
            temperature: chat.settings.temperature,
            max_tokens: chat.settings.maxTokens,
            system: chat.settings.systemPrompt
          };

          for await (const chunk of ollamaService.generateStreamingCompletion(messages, streamOptions)) {
            assistantContent += chunk.content;
            
            // Send chunk to client
            res.write(`data: ${JSON.stringify({
              type: 'content_delta',
              delta: chunk.content
            })}\n\n`);

            if (chunk.done) {
              break;
            }
          }

          // Update message with final content
          const processingTime = Date.now() - startTime;
          assistantMessage.content = assistantContent;
          assistantMessage.status = 'completed';
          assistantMessage.metadata.processingTime = processingTime;
          assistantMessage.metadata.tokens = {
            prompt: ollamaService.estimateTokens(messages),
            completion: ollamaService.estimateTokens(assistantContent),
            total: ollamaService.estimateTokens(messages) + ollamaService.estimateTokens(assistantContent)
          };

          await assistantMessage.save();

          // Send completion event
          res.write(`data: ${JSON.stringify({
            type: 'message_complete',
            messageId: assistantMessage._id,
            processingTime
          })}\n\n`);

        } catch (error) {
          console.error('Streaming error:', error);
          res.write(`data: ${JSON.stringify({
            type: 'error',
            error: error.message
          })}\n\n`);
        }

        res.end();
      } else {
        // Non-streaming response
        const completionOptions = {
          model: chat.settings.model,
          temperature: chat.settings.temperature,
          max_tokens: chat.settings.maxTokens,
          system: chat.settings.systemPrompt
        };

        const completion = await ollamaService.generateCompletion(messages, completionOptions);

        // Create assistant message
        const assistantMessage = new Message({
          chat: chatId,
          user: userId,
          content: completion.content,
          role: 'assistant',
          isGuest: isGuest,
          metadata: {
            model: completion.model,
            tokens: completion.usage,
            processingTime: completion.processingTime,
            temperature: completion.metadata.temperature
          }
        });

        await assistantMessage.save();

        res.json({
          success: true,
          message: 'Message sent successfully',
          data: {
            userMessage,
            assistantMessage
          }
        });
      }
    } catch (error) {
      console.error('Message generation error:', error);
      
      // Create error message
      const errorMessage = new Message({
        chat: chatId,
        user: userId,
        content: 'Sorry, I encountered an error processing your message. Please try again.',
        role: 'assistant',
        status: 'failed',
        isGuest: isGuest,
        metadata: {
          error: error.message
        }
      });

      await errorMessage.save();

      if (stream) {
        res.write(`data: ${JSON.stringify({
          type: 'error',
          error: 'Failed to generate response'
        })}\n\n`);
        res.end();
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to generate response',
          code: 'GENERATION_ERROR',
          data: {
            userMessage,
            errorMessage
          }
        });
      }
    }
  })
];

/**
 * Update chat settings
 */
export const updateChat = [
  // Validation rules
  param('chatId')
    .isMongoId()
    .withMessage('Invalid chat ID'),
  
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  
  body('isPinned')
    .optional()
    .isBoolean()
    .withMessage('isPinned must be a boolean'),

  // Controller function
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        errors: errors.array()
      });
    }

    const { chatId } = req.params;
    const updates = req.body;

    const chat = await Chat.findOneAndUpdate(
      { _id: chatId, user: req.user._id, isActive: true },
      updates,
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found',
        code: 'CHAT_NOT_FOUND'
      });
    }

    res.json({
      success: true,
      message: 'Chat updated successfully',
      data: {
        chat
      }
    });
  })
];

/**
 * Delete chat
 */
export const deleteChat = [
  // Validation rules
  param('chatId')
    .isMongoId()
    .withMessage('Invalid chat ID'),

  // Controller function
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        errors: errors.array()
      });
    }

    const { chatId } = req.params;

    const chat = await Chat.findOneAndUpdate(
      { _id: chatId, user: req.user._id, isActive: true },
      { isActive: false },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found',
        code: 'CHAT_NOT_FOUND'
      });
    }

    res.json({
      success: true,
      message: 'Chat deleted successfully'
    });
  })
];