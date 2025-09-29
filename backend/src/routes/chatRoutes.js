import express from 'express';
import { authenticate, chatRateLimit, aiRateLimit } from '../middleware/index.js';
import {
  createChat,
  getChats,
  getChat,
  sendMessage,
  updateChat,
  deleteChat
} from '../controllers/chatController.js';

const router = express.Router();

// Apply authentication to all chat routes
router.use(authenticate);

// Chat management routes
router.get('/', chatRateLimit, getChats);
router.post('/', chatRateLimit, createChat);
router.get('/:chatId', chatRateLimit, getChat);
router.put('/:chatId', chatRateLimit, updateChat);
router.delete('/:chatId', chatRateLimit, deleteChat);

// Message routes (with AI rate limiting)
router.post('/:chatId/messages', aiRateLimit, sendMessage);

export default router;