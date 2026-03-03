import { pool } from '../db.js';
import initSchema from '../db/initSchema.js';

class DatabaseService {
  constructor() {
    this.connected = false;
  }

  /**
   * Connect to Neon PostgreSQL and initialize schema
   */
  async connect() {
    try {
      const dbUrl = process.env.DATABASE_URL || '';
      const host = dbUrl.includes('@') ? dbUrl.split('@')[1]?.split('/')[0] : 'unknown';
      console.log(`🔌 Attempting to connect to Neon PostgreSQL: ${host}`);

      // Test connection
      const client = await pool.connect();
      const result = await client.query('SELECT NOW() as now, current_database() as db');
      client.release();

      this.connected = true;
      console.log(`✅ Connected to Neon PostgreSQL`);
      console.log(`📊 Database: ${result.rows[0].db}`);
      console.log(`🕐 Server time: ${result.rows[0].now}`);

      // Initialize schema
      await initSchema();

      return true;
    } catch (error) {
      console.error('❌ Failed to connect to Neon PostgreSQL:');
      console.error('   Error:', error.message);
      this.connected = false;
      throw error;
    }
  }

  /**
   * Disconnect from PostgreSQL
   */
  async disconnect() {
    try {
      await pool.end();
      this.connected = false;
      console.log('✅ Disconnected from Neon PostgreSQL');
    } catch (error) {
      console.error('❌ Error disconnecting from Neon PostgreSQL:', error);
    }
  }

  /**
   * Check database connection health
   */
  isConnected() {
    return this.connected;
  }

  /**
   * Get connection status
   */
  getConnectionStatus() {
    return {
      state: this.connected ? 'connected' : 'disconnected',
      type: 'postgresql',
      provider: 'neon'
    };
  }
}

// Create singleton instance
const databaseService = new DatabaseService();

export default databaseService;