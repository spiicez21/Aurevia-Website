import { body, validationResult } from 'express-validator';
import { User } from '../models/index.js';
import { generateToken, asyncHandler } from '../middleware/index.js';

/**
 * Register new user
 */
export const register = [
  // Validation rules
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),

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

    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      const field = existingUser.email === email ? 'email' : 'username';
      return res.status(409).json({
        success: false,
        message: `User with this ${field} already exists`,
        code: 'USER_EXISTS',
        field
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Return user data (without password)
    const userData = user.getPublicProfile();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userData,
        token
      }
    });
  })
];

/**
 * Login user
 */
export const login = [
  // Validation rules
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),

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

    const { email, password } = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated',
        code: 'ACCOUNT_DEACTIVATED'
      });
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Update last seen
    user.lastSeen = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Return user data (without password)
    const userData = user.getPublicProfile();

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userData,
        token
      }
    });
  })
];

/**
 * Get current user profile
 */
export const getProfile = asyncHandler(async (req, res) => {
  const userData = req.user.getPublicProfile();
  
  res.json({
    success: true,
    data: {
      user: userData
    }
  });
});

/**
 * Update user profile
 */
export const updateProfile = [
  // Validation rules
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  
  body('preferences.theme')
    .optional()
    .isIn(['light', 'dark', 'auto'])
    .withMessage('Theme must be light, dark, or auto'),
  
  body('preferences.language')
    .optional()
    .isLength({ min: 2, max: 5 })
    .withMessage('Language code must be between 2 and 5 characters'),

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

    const { username, preferences } = req.body;
    const user = req.user;

    // Check if username is being changed and if it's available
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Username already exists',
          code: 'USERNAME_EXISTS'
        });
      }
      user.username = username;
    }

    // Update preferences
    if (preferences) {
      user.preferences = { ...user.preferences, ...preferences };
    }

    await user.save();

    const userData = user.getPublicProfile();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: userData
      }
    });
  })
];

/**
 * Change password
 */
export const changePassword = [
  // Validation rules
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number'),

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

    const { currentPassword, newPassword } = req.body;
    
    // Get user with password
    const user = await User.findById(req.user._id).select('+password');

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
        code: 'INVALID_PASSWORD'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  })
];

/**
 * Deactivate account
 */
export const deactivateAccount = asyncHandler(async (req, res) => {
  const user = req.user;
  user.isActive = false;
  await user.save();

  res.json({
    success: true,
    message: 'Account deactivated successfully'
  });
});