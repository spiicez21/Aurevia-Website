import express from 'express';
import authRoutes from './authRoutes.js';
import chatRoutes from './chatRoutes.js';
import systemRoutes from './systemRoutes.js';

const router = express.Router();

// API routes
router.use('/auth', authRoutes);
router.use('/chats', chatRoutes);
router.use('/system', systemRoutes);

// API info
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Aurevia Backend API',
    version: '1.0.0',
    documentation: '/api/docs',
    endpoints: {
      auth: '/api/auth',
      chats: '/api/chats',
      system: '/api/system'
    }
  });
});

export default router;