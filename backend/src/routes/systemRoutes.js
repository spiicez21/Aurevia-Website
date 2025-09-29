import express from 'express';
import { authenticate, requireAdmin } from '../middleware/index.js';
import {
  healthCheck,
  getModels,
  pullModel
} from '../controllers/systemController.js';

const router = express.Router();

// Public health check
router.get('/health', healthCheck);

// Protected system routes
router.get('/models', authenticate, getModels);
router.post('/models/pull', authenticate, requireAdmin, pullModel);

export default router;