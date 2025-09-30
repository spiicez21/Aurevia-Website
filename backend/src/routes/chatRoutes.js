import express from 'express';
import { authenticate, optionalAuth, chatRateLimit, aiRateLimit } from '../middleware/index.js';
import {
  createChat,
  getChats,
  getChat,
  sendMessage,
  updateChat,
  deleteChat
} from '../controllers/chatController.js';

const router = express.Router();

// Apply optional authentication to allow both authenticated and anonymous users
router.use(optionalAuth);

// Chat management routes
router.get('/', chatRateLimit, getChats);
router.post('/', chatRateLimit, createChat);
router.get('/:chatId', chatRateLimit, getChat);
router.put('/:chatId', chatRateLimit, updateChat);
router.delete('/:chatId', chatRateLimit, deleteChat);

// Message routes (with AI rate limiting)
router.post('/:chatId/messages', aiRateLimit, sendMessage);

export default router;