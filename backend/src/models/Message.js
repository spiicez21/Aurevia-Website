import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: [true, 'Chat is required'],
    index: true
  },
  user: {
    type: mongoose.Schema.Types.Mixed, // Can be ObjectId or string for guests
    required: [true, 'User is required'],
    index: true
  },
  isGuest: {
    type: Boolean,
    default: false
  },
  content: {
    type: String,
    required: [true, 'Message content is required'],
    trim: true,
    maxLength: [10000, 'Message cannot exceed 10000 characters']
  },
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: [true, 'Message role is required'],
    index: true
  },
  type: {
    type: String,
    enum: ['text', 'image', 'file', 'code'],
    default: 'text'
  },
  metadata: {
    model: {
      type: String,
      default: 'gemma2:2b'
    },
    tokens: {
      prompt: { type: Number, default: 0 },
      completion: { type: Number, default: 0 },
      total: { type: Number, default: 0 }
    },
    processingTime: {
      type: Number, // in milliseconds
      default: 0
    },
    temperature: {
      type: Number,
      min: 0,
      max: 1
    },
    error: {
      type: String,
      default: null
    }
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'completed'
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  editHistory: [{
    content: String,
    editedAt: {
      type: Date,
      default: Date.now
    }
  }],
  reactions: [{
    emoji: {
      type: String,
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for efficient queries
messageSchema.index({ chat: 1, createdAt: -1 });
messageSchema.index({ user: 1, createdAt: -1 });
messageSchema.index({ chat: 1, role: 1 });
messageSchema.index({ status: 1 });

// Virtual for word count
messageSchema.virtual('wordCount').get(function() {
  return this.content ? this.content.split(/\s+/).length : 0;
});

// Virtual for character count
messageSchema.virtual('charCount').get(function() {
  return this.content ? this.content.length : 0;
});

// Update chat's message count and last message time after saving
messageSchema.post('save', async function() {
  try {
    const Chat = mongoose.model('Chat');
    await Chat.findByIdAndUpdate(this.chat, {
      $inc: { messageCount: 1 },
      $set: { lastMessageAt: this.createdAt }
    });
  } catch (error) {
    console.error('Error updating chat after message save:', error);
  }
});

// Update chat's message count after deletion
messageSchema.post('deleteOne', { document: true }, async function() {
  try {
    const Chat = mongoose.model('Chat');
    await Chat.findByIdAndUpdate(this.chat, {
      $inc: { messageCount: -1 }
    });
  } catch (error) {
    console.error('Error updating chat after message deletion:', error);
  }
});

// Instance method to add reaction
messageSchema.methods.addReaction = function(emoji, userId) {
  // Remove existing reaction from this user
  this.reactions = this.reactions.filter(
    reaction => reaction.user.toString() !== userId.toString()
  );
  
  // Add new reaction
  this.reactions.push({ emoji, user: userId });
  return this.save();
};

// Instance method to remove reaction
messageSchema.methods.removeReaction = function(userId) {
  this.reactions = this.reactions.filter(
    reaction => reaction.user.toString() !== userId.toString()
  );
  return this.save();
};

// Static method to get conversation context
messageSchema.statics.getConversationContext = function(chatId, limit = 10) {
  return this.find({ chat: chatId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('content role createdAt')
    .lean();
};

// Static method to get user's recent messages
messageSchema.statics.getUserRecentMessages = function(userId, limit = 20) {
  return this.find({ user: userId })
    .populate('chat', 'title')
    .sort({ createdAt: -1 })
    .limit(limit);
};

const Message = mongoose.model('Message', messageSchema);

export default Message;