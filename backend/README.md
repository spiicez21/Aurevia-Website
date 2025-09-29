# Aurevia Backend - MERN Stack with Ollama Integration

A complete Node.js/Express backend for the Aurevia chat application, featuring integration with Ollama's Gemma2:2b model for AI-powered conversations.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with secure password hashing
- **AI Integration**: Ollama Gemma2:2b model integration with streaming support
- **Real-time Chat**: Server-Sent Events (SSE) for streaming AI responses
- **MongoDB Integration**: Robust data models for users, chats, and messages
- **Rate Limiting**: Comprehensive rate limiting for different API endpoints
- **Security**: Helmet, CORS, input validation, and error handling
- **Development Tools**: Hot reload, logging, and debugging support

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/          # Route controllers
│   │   ├── authController.js
│   │   ├── chatController.js
│   │   └── systemController.js
│   ├── middleware/           # Express middleware
│   │   ├── auth.js
│   │   ├── rateLimiter.js
│   │   └── errorHandler.js
│   ├── models/              # MongoDB schemas
│   │   ├── User.js
│   │   ├── Chat.js
│   │   └── Message.js
│   ├── routes/              # API routes
│   │   ├── authRoutes.js
│   │   ├── chatRoutes.js
│   │   └── systemRoutes.js
│   ├── services/            # External services
│   │   ├── ollamaService.js
│   │   └── databaseService.js
│   └── server.js            # Main server file
├── .env                     # Environment variables
├── .env.example             # Environment template
└── package.json             # Dependencies and scripts
```

## 🛠️ Installation & Setup

### Prerequisites

1. **Node.js** (v18 or higher)
2. **MongoDB** (local or MongoDB Atlas)
3. **Ollama** with Gemma2:2b model

### Install Ollama and Gemma2:2b

```bash
# Install Ollama (macOS/Linux)
curl -fsSL https://ollama.ai/install.sh | sh

# Pull the Gemma2:2b model
ollama pull gemma2:2b

# Verify installation
ollama list
```

### Backend Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment configuration**:
   ```bash
   cp .env.example .env
   # Edit .env with your configurations
   ```

3. **Start MongoDB** (if running locally):
   ```bash
   mongod
   ```

4. **Start Ollama service**:
   ```bash
   ollama serve
   ```

5. **Start the backend server**:
   ```bash
   # Development mode (with hot reload)
   npm run dev
   
   # Production mode
   npm start
   ```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/password` - Change password

### Chat Management
- `GET /api/chats` - Get user's chats
- `POST /api/chats` - Create new chat
- `GET /api/chats/:id` - Get chat with messages
- `PUT /api/chats/:id` - Update chat
- `DELETE /api/chats/:id` - Delete chat

### Messages
- `POST /api/chats/:id/messages` - Send message (supports streaming)

### System
- `GET /api/system/health` - Health check
- `GET /api/system/models` - Available AI models

## 🔧 Configuration

### Environment Variables

```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/aurevia-chat

# Authentication
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d

# Ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=gemma2:2b

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
FRONTEND_URL=http://localhost:5174
```

## 🤖 AI Integration

The backend integrates with Ollama's Gemma2:2b model providing:

- **Streaming Responses**: Real-time AI responses via Server-Sent Events
- **Context Awareness**: Maintains conversation history
- **Configurable Parameters**: Temperature, max tokens, system prompts
- **Error Handling**: Graceful fallbacks for AI service issues
- **Token Estimation**: Rough token counting for usage tracking

### Example Streaming Request

```javascript
const response = await fetch('/api/chats/123/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-jwt-token'
  },
  body: JSON.stringify({
    content: 'Hello, how are you?',
    stream: true
  })
});

// Handle streaming response
const reader = response.body.getReader();
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = new TextDecoder().decode(value);
  const lines = chunk.split('\n');
  
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const data = JSON.parse(line.slice(6));
      console.log(data);
    }
  }
}
```

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: Multiple tiers of rate limiting
- **Input Validation**: Comprehensive request validation
- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Security headers and protection
- **Error Handling**: Secure error responses

## 📊 Database Schema

### User Model
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  preferences: {
    theme: String,
    language: String,
    notifications: Boolean
  },
  isActive: Boolean,
  lastSeen: Date
}
```

### Chat Model
```javascript
{
  user: ObjectId,
  title: String,
  description: String,
  settings: {
    model: String,
    temperature: Number,
    maxTokens: Number,
    systemPrompt: String
  },
  isPinned: Boolean,
  messageCount: Number
}
```

### Message Model
```javascript
{
  chat: ObjectId,
  user: ObjectId,
  content: String,
  role: 'user' | 'assistant' | 'system',
  metadata: {
    model: String,
    tokens: Object,
    processingTime: Number
  },
  status: 'pending' | 'completed' | 'failed'
}
```

## 🚦 Development

### Scripts
- `npm run dev` - Start development server with hot reload
- `npm start` - Start production server
- `npm test` - Run tests (when implemented)

### Logging
The server provides comprehensive logging:
- Request/response logging via Morgan
- Error logging with stack traces
- Service health monitoring
- Database connection status

## 🔍 Health Monitoring

Access `/api/system/health` to check:
- Server status and uptime
- Database connection
- Ollama service availability  
- AI model status

## 📝 License

MIT License - feel free to use this project for learning and development!

---

Built with ❤️ for the Aurevia project