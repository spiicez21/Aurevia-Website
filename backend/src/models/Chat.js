import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.Mixed, // Can be ObjectId or string for guests
    required: [true, 'User is required'],
    index: true
  },
  isGuest: {
    type: Boolean,
    default: false
  },
  guestId: {
    type: String,
    sparse: true, // Only index if present
    index: true
  },
  title: {
    type: String,
    required: [true, 'Chat title is required'],
    trim: true,
    maxLength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxLength: [500, 'Description cannot exceed 500 characters'],
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true,
    maxLength: [20, 'Tag cannot exceed 20 characters']
  }],
  messageCount: {
    type: Number,
    default: 0
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  },
  settings: {
    model: {
      type: String,
      default: 'gemma2:2b'
    },
    temperature: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.7
    },
    maxTokens: {
      type: Number,
      min: 1,
      max: 4096,
      default: 1024
    },
    systemPrompt: {
      type: String,
      default: 'You are a helpful AI assistant.'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for chat messages
chatSchema.virtual('messages', {
  ref: 'Message',
  localField: '_id',
  foreignField: 'chat',
  options: { sort: { createdAt: 1 } }
});

// Virtual for latest message
chatSchema.virtual('latestMessage', {
  ref: 'Message',
  localField: '_id',
  foreignField: 'chat',
  justOne: true,
  options: { sort: { createdAt: -1 } }
});

// Index for efficient queries
chatSchema.index({ user: 1, createdAt: -1 });
chatSchema.index({ user: 1, isPinned: -1, lastMessageAt: -1 });
chatSchema.index({ user: 1, isActive: 1 });

// Update lastMessageAt when messages are added
chatSchema.methods.updateLastMessage = function() {
  this.lastMessageAt = new Date();
  return this.save();
};

// Static method to get user's active chats
chatSchema.statics.findUserChats = function(userId, options = {}) {
  const query = { user: userId, isActive: true };
  
  if (options.pinned !== undefined) {
    query.isPinned = options.pinned;
  }
  
  return this.find(query)
    .populate('latestMessage')
    .sort({ isPinned: -1, lastMessageAt: -1 })
    .limit(options.limit || 50);
};

// Static method to get chat with messages
chatSchema.statics.findChatWithMessages = function(chatId, userId, limit = 50) {
  return this.findOne({ _id: chatId, user: userId, isActive: true })
    .populate({
      path: 'messages',
      options: { 
        sort: { createdAt: -1 },
        limit: limit
      }
    });
};

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;