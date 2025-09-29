import mongoose from 'mongoose';

class DatabaseService {
  constructor() {
    this.connection = null;
  }

  /**
   * Connect to MongoDB database
   */
  async connect() {
    try {
      const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/aurevia-chat';
      
      const options = {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        bufferMaxEntries: 0,
        bufferCommands: false,
      };

      this.connection = await mongoose.connect(mongoURI, options);
      
      console.log(`✅ Connected to MongoDB: ${this.connection.connection.host}`);
      
      // Handle connection events
      mongoose.connection.on('error', (error) => {
        console.error('❌ MongoDB connection error:', error);
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️ MongoDB disconnected');
      });

      mongoose.connection.on('reconnected', () => {
        console.log('✅ MongoDB reconnected');
      });

      return this.connection;
    } catch (error) {
      console.error('❌ Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  /**
   * Disconnect from MongoDB
   */
  async disconnect() {
    try {
      await mongoose.disconnect();
      console.log('✅ Disconnected from MongoDB');
    } catch (error) {
      console.error('❌ Error disconnecting from MongoDB:', error);
    }
  }

  /**
   * Check database connection health
   */
  isConnected() {
    return mongoose.connection.readyState === 1;
  }

  /**
   * Get connection status
   */
  getConnectionStatus() {
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    return {
      state: states[mongoose.connection.readyState],
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name
    };
  }
}

// Create singleton instance
const databaseService = new DatabaseService();

export default databaseService;