import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Import services and middleware
import { databaseService } from './services/index.js';
import { 
  apiRateLimit, 
  errorHandler, 
  notFoundHandler 
} from './middleware/index.js';

// Import routes
import apiRoutes from './routes/index.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false, // Disable for SSE streaming
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "'unsafe-inline'"],
    },
  },
}));

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:5174',
      'http://localhost:3000',
      'http://localhost:5173'
    ];
    
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count']
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting
app.use(apiRateLimit);

// Health check endpoint (before rate limiting)
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use('/api', apiRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Aurevia Backend API',
    version: '1.0.0',
    documentation: '/api',
    health: '/health'
  });
});

// Error handling middleware (must be after routes)
app.use(notFoundHandler);
app.use(errorHandler);

// Graceful shutdown handling
const gracefulShutdown = async (signal) => {
  console.log(`\n🔄 Received ${signal}. Starting graceful shutdown...`);
  
  try {
    // Close database connection
    await databaseService.disconnect();
    
    // Close server
    server.close(() => {
      console.log('✅ Server closed successfully');
      process.exit(0);
    });
    
    // Force close after 10 seconds
    setTimeout(() => {
      console.log('⚠️ Forcing shutdown...');
      process.exit(1);
    }, 10000);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start server
const PORT = process.env.PORT || 5000;
let server;

const startServer = async () => {
  try {
    // Connect to database
    await databaseService.connect();
    
    // Start HTTP server
    server = app.listen(PORT, () => {
      console.log(`
🚀 Aurevia Backend Server Started Successfully!

📍 Server Details:
   • Environment: ${process.env.NODE_ENV || 'development'}
   • Port: ${PORT}
   • URL: http://localhost:${PORT}
   • API: http://localhost:${PORT}/api
   • Health: http://localhost:${PORT}/health

🛡️ Security Features:
   • CORS enabled for ${process.env.FRONTEND_URL || 'http://localhost:5174'}
   • Rate limiting active
   • Helmet security headers
   • JWT authentication

🤖 AI Integration:
   • Ollama URL: ${process.env.OLLAMA_BASE_URL || 'http://localhost:11434'}
   • Model: ${process.env.OLLAMA_MODEL || 'gemma2:2b'}

📊 Database:
   • MongoDB: ${process.env.MONGODB_URI || 'mongodb://localhost:27017/aurevia-chat'}

Ready to handle requests! 🎉
      `);
    });
    
    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
      } else {
        console.error('❌ Server error:', error);
      }
      process.exit(1);
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

export default app;