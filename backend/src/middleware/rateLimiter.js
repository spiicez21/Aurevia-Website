import rateLimit from 'express-rate-limit';

/**
 * General API rate limiting
 */
export const apiRateLimit = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    code: 'RATE_LIMITED'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: (req) => {
    // Skip rate limiting for health check endpoints
    return req.path === '/health' || req.path === '/api/health';
  }
});

/**
 * Strict rate limiting for authentication endpoints
 */
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.',
    code: 'AUTH_RATE_LIMITED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true // Don't count successful requests
});

/**
 * Chat API rate limiting
 */
export const chatRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // limit each IP to 20 chat requests per minute
  message: {
    success: false,
    message: 'Too many chat requests, please slow down.',
    code: 'CHAT_RATE_LIMITED'
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * AI generation rate limiting (more restrictive)
 */
export const aiRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 AI requests per minute
  message: {
    success: false,
    message: 'Too many AI generation requests, please wait before trying again.',
    code: 'AI_RATE_LIMITED'
  },
  standardHeaders: true,
  legacyHeaders: false
});