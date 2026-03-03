import { query } from '../db.js';

const Message = {
  /**
   * Create a new message
   */
  async create({ chat_id, user_id, content, role, is_guest, status, metadata, type }) {
    const result = await query(
      `INSERT INTO messages (chat_id, user_id, content, role, is_guest, status, metadata, type)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        chat_id,
        user_id,
        content || '',
        role,
        is_guest || false,
        status || 'completed',
        JSON.stringify(metadata || {}),
        type || 'text'
      ]
    );
    return result.rows[0];
  },

  /**
   * Find message by ID
   */
  async findById(id) {
    const result = await query(`SELECT * FROM messages WHERE id = $1`, [id]);
    return result.rows[0] || null;
  },

  /**
   * Get conversation context (recent messages for AI)
   */
  async getConversationContext(chatId, limit = 10) {
    const result = await query(
      `SELECT content, role, created_at FROM messages
       WHERE chat_id = $1
       ORDER BY created_at DESC LIMIT $2`,
      [chatId, limit]
    );
    return result.rows;
  },

  /**
   * Get messages for a chat (chronological)
   */
  async findByChatId(chatId, limit = 50) {
    const result = await query(
      `SELECT * FROM messages WHERE chat_id = $1
       ORDER BY created_at ASC LIMIT $2`,
      [chatId, limit]
    );
    return result.rows;
  },

  /**
   * Update message content, status, and metadata
   */
  async updateById(id, updates) {
    const setClauses = [];
    const values = [];
    let paramIndex = 1;

    if (updates.content !== undefined) {
      setClauses.push(`content = $${paramIndex++}`);
      values.push(updates.content);
    }
    if (updates.status !== undefined) {
      setClauses.push(`status = $${paramIndex++}`);
      values.push(updates.status);
    }
    if (updates.metadata !== undefined) {
      setClauses.push(`metadata = $${paramIndex++}`);
      values.push(JSON.stringify(updates.metadata));
    }
    if (updates.is_edited !== undefined) {
      setClauses.push(`is_edited = $${paramIndex++}`);
      values.push(updates.is_edited);
    }

    if (setClauses.length === 0) return null;

    setClauses.push(`updated_at = NOW()`);
    values.push(id);

    const result = await query(
      `UPDATE messages SET ${setClauses.join(', ')} WHERE id = $${paramIndex}
       RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }
};

export default Message;