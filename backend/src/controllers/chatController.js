import { body, param, query as validateQuery, validationResult } from 'express-validator';
import { Chat, Message } from '../models/index.js';
import { ollamaService } from '../services/index.js';
import { asyncHandler } from '../middleware/index.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Create new chat
 */
export const createChat = [
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

    const { title, description, settings } = req.body;

    // Handle both authenticated and anonymous users
    let userId = req.user?.id;
    let isGuest = false;
    let guestId = null;

    if (!userId) {
      guestId = req.headers['x-guest-id'];
      if (!guestId) {
        guestId = `guest_${uuidv4()}`;
      }
      userId = guestId;
      isGuest = true;
    }

    const chat = await Chat.create({
      user_id: userId,
      title,
      description,
      is_guest: isGuest,
      guest_id: isGuest ? guestId : null,
      settings: {
        ...settings,
        model: 'gemma2:2b'
      }
    });

    res.status(201).json({
      success: true,
      message: 'Chat created successfully',
      data: {
        chat,
        ...(isGuest && { guestId })
      }
    });
  })
];

/**
 * Get user's chats
 */
export const getChats = [
  validateQuery('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  validateQuery('pinned')
    .optional()
    .isBoolean()
    .withMessage('Pinned must be a boolean'),

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

    let userId = req.user?.id;
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
      ? await Chat.findGuestChats(userId, options)
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
  param('chatId')
    .isUUID()
    .withMessage('Invalid chat ID'),

  validateQuery('messageLimit')
    .optional()
    .isInt({ min: 1, max: 200 })
    .withMessage('Message limit must be between 1 and 200'),

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

    let userId = req.user?.id;
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

    const chat = await Chat.findChatWithMessages(
      chatId, userId, parseInt(messageLimit) || 50, isGuest
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
  param('chatId')
    .isUUID()
    .withMessage('Invalid chat ID'),

  body('content')
    .trim()
    .isLength({ min: 1, max: 10000 })
    .withMessage('Message content must be between 1 and 10000 characters'),

  body('stream')
    .optional()
    .isBoolean()
    .withMessage('Stream must be a boolean'),

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

    let userId = req.user?.id;
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
      ? await Chat.findByIdAndGuest(chatId, userId)
      : await Chat.findByIdAndUser(chatId, userId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found',
        code: 'CHAT_NOT_FOUND'
      });
    }

    // Create user message
    const userMessage = await Message.create({
      chat_id: chatId,
      user_id: userId,
      content,
      role: 'user',
      is_guest: isGuest
    });

    // Increment message count
    await Chat.incrementMessageCount(chatId);

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

      const chatSettings = chat.settings || {};

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
          const assistantMessage = await Message.create({
            chat_id: chatId,
            user_id: userId,
            content: '',
            role: 'assistant',
            status: 'processing',
            is_guest: isGuest,
            metadata: {
              model: chatSettings.model || 'gemma2:2b',
              temperature: chatSettings.temperature || 0.7
            }
          });

          await Chat.incrementMessageCount(chatId);

          // Send initial message info
          res.write(`data: ${JSON.stringify({
            type: 'message_start',
            messageId: assistantMessage.id
          })}\n\n`);

          // Generate streaming response
          const streamOptions = {
            model: chatSettings.model || 'gemma2:2b',
            temperature: chatSettings.temperature || 0.7,
            max_tokens: chatSettings.maxTokens || 1024,
            system: chatSettings.systemPrompt || 'You are a helpful AI assistant.'
          };

          for await (const chunk of ollamaService.generateStreamingCompletion(messages, streamOptions)) {
            assistantContent += chunk.content;

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
          await Message.updateById(assistantMessage.id, {
            content: assistantContent,
            status: 'completed',
            metadata: {
              model: chatSettings.model || 'gemma2:2b',
              temperature: chatSettings.temperature || 0.7,
              processingTime,
              tokens: {
                prompt: ollamaService.estimateTokens(messages),
                completion: ollamaService.estimateTokens(assistantContent),
                total: ollamaService.estimateTokens(messages) + ollamaService.estimateTokens(assistantContent)
              }
            }
          });

          // Send completion event
          res.write(`data: ${JSON.stringify({
            type: 'message_complete',
            messageId: assistantMessage.id,
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
          model: chatSettings.model || 'gemma2:2b',
          temperature: chatSettings.temperature || 0.7,
          max_tokens: chatSettings.maxTokens || 1024,
          system: chatSettings.systemPrompt || 'You are a helpful AI assistant.'
        };

        const completion = await ollamaService.generateCompletion(messages, completionOptions);

        // Create assistant message
        const assistantMessage = await Message.create({
          chat_id: chatId,
          user_id: userId,
          content: completion.content,
          role: 'assistant',
          is_guest: isGuest,
          metadata: {
            model: completion.model,
            tokens: completion.usage,
            processingTime: completion.processingTime,
            temperature: completion.metadata.temperature
          }
        });

        await Chat.incrementMessageCount(chatId);

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
      const errorMessage = await Message.create({
        chat_id: chatId,
        user_id: userId,
        content: 'Sorry, I encountered an error processing your message. Please try again.',
        role: 'assistant',
        status: 'failed',
        is_guest: isGuest,
        metadata: {
          error: error.message
        }
      });

      await Chat.incrementMessageCount(chatId);

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
  param('chatId')
    .isUUID()
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
    const { title, isPinned } = req.body;

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (isPinned !== undefined) updates.is_pinned = isPinned;

    const chat = await Chat.updateById(chatId, req.user.id, updates);

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
  param('chatId')
    .isUUID()
    .withMessage('Invalid chat ID'),

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

    const chat = await Chat.softDelete(chatId, req.user.id);

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