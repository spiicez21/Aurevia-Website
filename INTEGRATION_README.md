# Aurevia Chat Application

A full-stack chat application with React frontend and Node.js backend, featuring AI integration using Ollama Gemma2:2b model.

## 🚀 Features

- **Modern React Frontend**: Built with React 19.1.1, TypeScript, and Vite
- **Responsive Chat Interface**: ChatGPT-style interface with streaming responses
- **AI Integration**: Powered by Ollama Gemma2:2b model
- **Real-time Streaming**: Server-sent events for live AI responses
- **MERN Stack Backend**: Node.js, Express, MongoDB with JWT authentication
- **Custom Styling**: Tailwind CSS with custom color palette and fonts

## 🛠️ Technology Stack

### Frontend
- **React** 19.1.1 with TypeScript
- **Vite** 7.1.7 for fast development
- **Tailwind CSS** 4.1.13 with custom configuration
- **Lucide React** for icons
- **Custom Fonts**: Zodiak (serif) and Cabinet Grotesk (sans-serif)

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Ollama** integration for AI responses
- **CORS** and rate limiting

## 📦 Installation

### Prerequisites
1. **Node.js** (v18 or higher)
2. **MongoDB** (running locally or MongoDB Atlas)
3. **Ollama** with Gemma2:2b model
   ```bash
   # Install Ollama (visit https://ollama.ai for installation)
   ollama pull gemma2:2b
   ```

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Configure environment variables in `.env`:
   ```
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/aurevia_chat
   JWT_SECRET=your_super_secret_jwt_key_here
   OLLAMA_BASE_URL=http://localhost:11434
   OLLAMA_MODEL=gemma2:2b
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd d:\Aurevia-Website
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env`:
   ```
   VITE_API_URL=http://localhost:5000/api
   VITE_DEV_MODE=true
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 🚀 Usage

1. **Start Services**:
   - Ensure MongoDB is running
   - Start Ollama service and pull gemma2:2b model
   - Start the backend server (port 5000)
   - Start the frontend server (port 5173)

2. **Chat Interface**:
   - Visit http://localhost:5173
   - Start chatting with the AI assistant
   - Messages stream in real-time
   - Chat history is preserved

3. **API Endpoints**:
   - `POST /api/auth/register` - User registration
   - `POST /api/auth/login` - User login
   - `GET /api/chats` - Get chat history
   - `POST /api/chats` - Create new chat
   - `POST /api/chats/:id/messages` - Send message

## 🎨 Design Features

- **Color Palette**: Olive green (#C6D86E) primary with dark charcoal backgrounds
- **Typography**: Custom font stack with Zodiak and Cabinet Grotesk
- **Responsive Layout**: Optimized for desktop and mobile
- **Animations**: Smooth transitions and loading states
- **Accessibility**: Proper ARIA labels and keyboard navigation

## 🔧 Development

### Project Structure
```
aurevia-website/
├── src/
│   ├── components/
│   │   ├── chat/          # Chat components
│   │   ├── layout/        # Layout components
│   │   └── UI/            # Reusable UI components
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API services
│   └── Pages/             # Page components
├── public/
│   ├── fonts/             # Custom fonts
│   └── Image/             # Static images
└── backend/
    ├── src/
    │   ├── controllers/   # Route controllers
    │   ├── models/        # MongoDB models
    │   ├── middleware/    # Express middleware
    │   ├── routes/        # API routes
    │   └── services/      # Business logic
    └── config/            # Configuration files
```

### Key Components
- **ChatWelcome**: Main chat page component
- **MessageInput**: Input field with mode switching
- **ChatMessage**: Message display with markdown support
- **ChatContainer**: Message history container
- **useChat**: Custom hook for chat state management

## 🔒 Authentication

The application includes JWT-based authentication:
1. Register/login to create account
2. JWT token stored in localStorage
3. Protected API routes require authentication
4. Chat history tied to user accounts

## 🤖 AI Integration

- **Model**: Ollama Gemma2:2b for local AI inference
- **Streaming**: Real-time response streaming
- **Context**: Conversation context maintained
- **Fallback**: Graceful error handling when AI unavailable

## 🐛 Error Handling

- Network error displays with helpful messages
- Backend connection status indicators
- Graceful fallbacks when services unavailable
- Input validation and sanitization

## 📱 Mobile Support

- Responsive design for all screen sizes
- Touch-friendly interface elements
- Optimized for mobile chat experience

## 🔮 Future Enhancements

- [ ] Voice input/output
- [ ] File upload support
- [ ] Chat export functionality
- [ ] Multi-model AI support
- [ ] Real-time collaboration
- [ ] Push notifications

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**Happy Chatting!** 🎉