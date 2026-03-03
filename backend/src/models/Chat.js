import { query } from '../db.js';

const Chat = {
  /**
   * Create a new chat
   */
  async create({ user_id, title, description, is_guest, guest_id, settings }) {
    const result = await query(
      `INSERT INTO chats (user_id, title, description, is_guest, guest_id, settings)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        user_id,
        title?.trim() || 'New Chat',
        description?.trim() || '',
        is_guest || false,
        guest_id || null,
        JSON.stringify(settings || { model: 'gemma2:2b', temperature: 0.7, maxTokens: 1024, systemPrompt: 'You are a helpful AI assistant.' })
      ]
    );
    return result.rows[0];
  },

  /**
   * Find chat by ID
   */
  async findById(id) {
    const result = await query(`SELECT * FROM chats WHERE id = $1`, [id]);
    return result.rows[0] || null;
  },

  /**
   * Find chat by ID and user (authenticated)
   */
  async findByIdAndUser(id, userId) {
    const result = await query(
      `SELECT * FROM chats WHERE id = $1 AND user_id = $2 AND is_active = true`,
      [id, userId]
    );
    return result.rows[0] || null;
  },

  /**
   * Find chat by ID and guest
   */
  async findByIdAndGuest(id, guestId) {
    const result = await query(
      `SELECT * FROM chats WHERE id = $1 AND guest_id = $2 AND is_active = true`,
      [id, guestId]
    );
    return result.rows[0] || null;
  },

  /**
   * Get user's active chats (authenticated)
   */
  async findUserChats(userId, options = {}) {
    const limit = options.limit || 50;
    let sql = `SELECT * FROM chats WHERE user_id = $1 AND is_active = true`;
    const params = [userId];

    if (options.pinned !== undefined) {
      sql += ` AND is_pinned = $${params.length + 1}`;
      params.push(options.pinned);
    }

    sql += ` ORDER BY is_pinned DESC, last_message_at DESC LIMIT $${params.length + 1}`;
    params.push(limit);

    const result = await query(sql, params);
    return result.rows;
  },

  /**
   * Get guest's active chats
   */
  async findGuestChats(guestId, options = {}) {
    const limit = options.limit || 50;
    const result = await query(
      `SELECT * FROM chats WHERE guest_id = $1 AND is_active = true
       ORDER BY updated_at DESC LIMIT $2`,
      [guestId, limit]
    );
    return result.rows;
  },

  /**
   * Find chat with its messages
   */
  async findChatWithMessages(chatId, userId, limit = 50, isGuest = false) {
    // Get chat
    let chat;
    if (isGuest) {
      chat = await this.findByIdAndGuest(chatId, userId);
    } else {
      chat = await this.findByIdAndUser(chatId, userId);
    }

    if (!chat) return null;

    // Get messages
    const msgResult = await query(
      `SELECT * FROM messages WHERE chat_id = $1
       ORDER BY created_at ASC LIMIT $2`,
      [chatId, limit]
    );

    chat.messages = msgResult.rows;
    return chat;
  },

  /**
   * Update chat by ID
   */
  async updateById(id, userId, updates) {
    const setClauses = [];
    const values = [];
    let paramIndex = 1;

    if (updates.title !== undefined) {
      setClauses.push(`title = $${paramIndex++}`);
      values.push(updates.title.trim());
    }
    if (updates.is_pinned !== undefined) {
      setClauses.push(`is_pinned = $${paramIndex++}`);
      values.push(updates.is_pinned);
    }
    if (updates.description !== undefined) {
      setClauses.push(`description = $${paramIndex++}`);
      values.push(updates.description.trim());
    }
    if (updates.settings !== undefined) {
      setClauses.push(`settings = $${paramIndex++}`);
      values.push(JSON.stringify(updates.settings));
    }

    if (setClauses.length === 0) return null;

    setClauses.push(`updated_at = NOW()`);
    values.push(id, userId);

    const result = await query(
      `UPDATE chats SET ${setClauses.join(', ')}
       WHERE id = $${paramIndex++} AND user_id = $${paramIndex} AND is_active = true
       RETURNING *`,
      values
    );
    return result.rows[0] || null;
  },

  /**
   * Soft delete chat
   */
  async softDelete(id, userId) {
    const result = await query(
      `UPDATE chats SET is_active = false, updated_at = NOW()
       WHERE id = $1 AND user_id = $2 AND is_active = true
       RETURNING *`,
      [id, userId]
    );
    return result.rows[0] || null;
  },

  /**
   * Increment message count and update last_message_at
   */
  async incrementMessageCount(chatId) {
    await query(
      `UPDATE chats SET message_count = message_count + 1, last_message_at = NOW(), updated_at = NOW()
       WHERE id = $1`,
      [chatId]
    );
  }
};

export default Chat;