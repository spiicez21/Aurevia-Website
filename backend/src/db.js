import { neon, Pool } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

// Create a connection pool for general queries
const pool = new Pool({ connectionString });

// Create a single-shot SQL function for simple queries
const sql = neon(connectionString);

/**
 * Execute a parameterized query using the pool
 */
async function query(text, params = []) {
    const client = await pool.connect();
    try {
        const result = await client.query(text, params);
        return result;
    } finally {
        client.release();
    }
}

export { pool, sql, query };
export default { pool, sql, query };
