import express from 'express';
import { authRateLimit } from '../middleware/index.js';
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  deactivateAccount
} from '../controllers/authController.js';
import { authenticate } from '../middleware/index.js';

const router = express.Router();

// Public routes (with rate limiting)
router.post('/register', authRateLimit, register);
router.post('/login', authRateLimit, login);

// Protected routes
router.use(authenticate); // Apply authentication to all routes below

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/password', changePassword);
router.delete('/account', deactivateAccount);

export default router;